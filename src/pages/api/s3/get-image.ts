import type { NextApiRequest, NextApiResponse } from 'next'
import getImageFromS3 from '../../../requests/s3/getImageFromS3'

export default async function GET(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const key = req.query.key as string

    const base64 = await getImageFromS3(key).then((buffer: any) => (
        buffer?.toString('base64') || null
    ))

    res.status(200).json(base64)
}
