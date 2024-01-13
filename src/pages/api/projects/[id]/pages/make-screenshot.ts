import { NextApiRequest, NextApiResponse } from 'next'
import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import puppeteer from 'puppeteer'
import {ObjectId} from 'bson'
import waitTillHTMLRendered from '@utils/waitTillHTMLRendered'
import getProjectsHandlerData from '@utils/getProjectsHandlerData'
import uploadImageToS3 from '@requests/s3/uploadImageToS3'
import transformIdProperty from '@utils/transformIdProperty'

interface Body {
    design: Design;
    projectDomainUrl: string;
    designName: string;
}

export default withApiAuthRequired(async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try{
        const {projectsCollection, user, method, projectId} =  await getProjectsHandlerData(req, res)
        const { url } = req.query

        switch (method) {
        case 'POST':
            const { design, projectDomainUrl, designName }: Body = req.body

            if (!design) {
                return res.status(400).json({ error: 'Missing required design parameter.' })
            }

            try {
                const browser = await puppeteer.launch()
                const page = await browser.newPage()
                await page.goto(projectDomainUrl + (url as string), { waitUntil: 'networkidle0' })

                await waitTillHTMLRendered(page)

                await page.setViewport({width: design.width, height: 1080 })
                const imageBuffer = await page.screenshot({ encoding: 'binary', fullPage: true})
                await browser.close()

                const key = `${user.email}:/${projectId}:${url}:/${design.width}`

                uploadImageToS3(key, imageBuffer).then(async () => {
                    const updatedProject = await projectsCollection.findOneAndUpdate(
                        {
                            _id: new ObjectId(projectId),
                            author: user?.email,
                            [`pages.${url}.designs.${designName}`]: { $exists: true },
                        },
                        {
                            $set: {
                                [`pages.${url}.designs.${designName}.websiteSnapshotUrl`]: key,
                            },
                        },
                        {
                            returnDocument: 'after',
                        }
                    )

                    if (updatedProject) {
                        res.status(200).json(transformIdProperty(updatedProject))
                    } else {
                        res.status(404).json({ error: 'Project not found' })
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
})

