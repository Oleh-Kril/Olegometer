import { NextApiRequest, NextApiResponse } from 'next'
import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import getProjectsHandlerData from '../../../../../utils/getProjectsHandlerData'
import puppeteer, {Page} from 'puppeteer'
import uploadImageToS3 from '../../../../../requests/s3/uploadImageToS3'
import {ObjectId} from 'bson'
import transformIdProperty from '../../../../../utils/transformIdProperty'
import waitTillHTMLRendered from "@utils/waitTillHTMLRendered"
import Agent from "@/Agent"
import sizeOf from "image-size"

export default withApiAuthRequired(async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try{
        const {projectsCollection, user, method, projectId} =  await getProjectsHandlerData(req, res)
        const { url  } = req.query

        switch (method) {
        case 'POST':
            const { dynamicElement, dynamicElementName } = req.body as {
                dynamicElementName: string,
                dynamicElement: DynamicElement,
                imageUrl: string,
            }

            Agent.get(imageUrl,{
                method: 'GET',
                responseType: 'arraybuffer',
            })
                .then(async (data: any) => {
                    const imageBuffer = Buffer.from(data, 'base64')
                    const dimensions = sizeOf(imageBuffer)
                    const { width } = dimensions

                    const key = `${userEmail}:/${projectId}:${pageUrl}:/${width}:design`

                    uploadImageToS3(key, data).then(async () => {
                        const design = {
                            width: width || 1900,
                            designUrl,
                            designSnapshotUrl: key,
                        } as Design

                        res.status(200).json(design)

                    })
                })

            if (!design || !projectDomainUrl || !dynamicElement) {
                return res.status(400).json({ error: 'Missing required parameters.' })
            }

            try {
                const {actions, elementToCapture} = dynamicElement
                const {type, className} = actions[0]
                const {className: elementToCaptureClassName} = elementToCapture

                const browser = await puppeteer.launch()
                const page = await browser.newPage()
                await page.goto(projectDomainUrl + (url as string), { waitUntil: 'networkidle0' })

                // await waitTillHTMLRendered(page)

                await page.setViewport({width: design.width, height: 1080 })
                await page.click('.' + className)

                console.log("clicked")
                // Wait for the page to render after the action
                await waitTillHTMLRendered(page)
                const base64 = await page.screenshot({ encoding: 'base64', fullPage: true})

                const htmlToCapture = await page.$("." + elementToCaptureClassName);
                if (htmlToCapture) {
                    const base64 = await htmlToCapture.screenshot({ encoding: 'base64'})
                    await browser.close()

                    return res.status(200).json('data:image/jpeg;base64,' + base64)
                }
                return res.status(200).json("No data")
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

