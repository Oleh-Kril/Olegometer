import { NextApiRequest, NextApiResponse } from 'next'
import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import Agent from '../../../Agent'
import sizeOf from 'image-size'
import uploadImageToS3 from '../../../requests/s3/uploadImageToS3'

export default withApiAuthRequired(async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try{
        const {
            projectId,
            pageUrl,
            designUrl,
            name,
            userEmail,
            imageUrl,
        } = req.body

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
                        name
                    } as Design

                    res.status(200).json(design)

                })
            })
            .catch(error => {
                res.status(500).json({ error: 'Something went wrong' })
            })
    }catch{
        return res
    }
})
