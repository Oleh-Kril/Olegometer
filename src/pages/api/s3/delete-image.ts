import type { NextApiRequest, NextApiResponse } from 'next'
import deleteImageFromS3 from '../../../requests/s3/deleteImageFromS3'

export default async function DELETE(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const key = req.query.key as string

    await deleteImageFromS3(key)

    res.status(200).json({key})
}
