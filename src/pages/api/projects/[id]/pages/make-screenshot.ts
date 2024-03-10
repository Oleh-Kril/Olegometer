import { NextApiRequest, NextApiResponse } from 'next'
import { chromium } from 'playwright'
import getProjectsHandlerData from '@utils/getProjectsHandlerData'
import uploadImageToS3 from '@requests/s3/uploadImageToS3'
import getCurrentTimeString from '@utils/dateUtils'
import updateDesignQuery from '@requests/project/design/updateDesignQuery'

interface Body {
    design: Design;
    projectDomainUrl: string;
    designName: string;
    timeout?: number;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try{
        const {projectsCollection, user, method, projectId} =  await getProjectsHandlerData(req, res)
        const { url } = req.query

        switch (method) {
        case 'POST':
            const { design, projectDomainUrl, designName, timeout }: Body = req.body

            if (!design) {
                return res.status(400).json({ error: 'Missing required design parameter.' })
            }

            try {
                const browser = await chromium.launch()
                const page = await browser.newPage()
                await page.goto(projectDomainUrl + (url as string), { waitUntil: 'networkidle' })

                await page.waitForLoadState('networkidle')

                await page.setViewportSize({ width: design.width, height: design.height })

                if(timeout){
                    await page.waitForTimeout(timeout*1000)
                }

                const imageBuffer = await page.screenshot({ type: 'jpeg', fullPage: true })

                await browser.close()

                const key = `${user.email}/${projectId}/${url}/${design.width}:${design.height}.jpeg`

                uploadImageToS3(key, imageBuffer).then(async () => {
                    design.websiteSnapshotUrl = key
                    design.websiteSnapshotLastUpdated = getCurrentTimeString()

                    const updatedProject = await updateDesignQuery(
                        projectsCollection,
                        user.email,
                        projectId,
                        url as string,
                        designName, design
                    )

                    if (updatedProject) {
                        res.status(200).json(updatedProject)
                    } else {
                        res.status(404).json({ error: 'Not found' })
                    }
                })

            }catch (error) {
                console.error('Error capturing screenshot:', error)
                res.status(500).json({ error: 'Internal Server Error.' })
            }
            break

        default:
            res.setHeader('Allow', ['POST'])
            res.status(405).end(`Method ${method} Not Allowed`)
        }

    }catch{
        return res
    }
}

