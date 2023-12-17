// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import puppeteer from "puppeteer"
import Agent from '../../Agent'
import uploadImageToS3 from "../../requests/S3/uploadImageToS3"
import axios from "axios"
import getImageFromS3 from "../../requests/S3/getImageFromS3"

export default async function GET(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const key = 'mayorford777@gmail.com:example-image-binary'

    const base64 = await getImageFromS3(key).then(buffer => (
        buffer?.toString("base64")
    ))

    res.status(200).json(base64)
}
