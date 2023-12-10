// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import puppeteer from "puppeteer"
import Agent from '../../Agent'
import uploadImageToS3 from "../../requests/S3/uploadImageToS3"

export default async function GET(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const fileKey = 'EH0gHvwosCd7pVbE9NRWey'; // Replace with your Figma file key
    const personalAccessToken = process.env.FIGMA_ACCESS_TOKEN;
    console.log(personalAccessToken)
    const imageId = '4082-841'
    try {
      // Make a request to the Figma API to render images
      const response = await Agent.get(`https://api.figma.com/v1/images/${fileKey}?ids=${imageId}&scale=2&format=jpg`, {
        headers: {
          'X-FIGMA-TOKEN': personalAccessToken,
        },
      });

      const { images } = response.data;

      const url = images[imageId.replace('-', ':')]

      Agent.get(url,{
        method: 'GET',
        responseType: 'arraybuffer', // Specify 'arraybuffer' for binary data
      })
          .then((data: any) => {
            // Convert the array buffer to a base64-encoded string
            const base64Image = Buffer.from(data, 'binary').toString('base64');
            const key = 'mayorford777@gmail.com:example-image'
            console.log(data)
            // uploadImageToS3(key, data)
          })
          .catch(error => {
            console.error('Failed to download file:', error.message);
          });
    } catch (error) {
      console.error('Error fetching Figma images:', error);
    }

    res.status(200)
  }catch (error) {
    console.error('Error capturing screenshot:', error);
    res.status(500).json({ error: 'Internal Server Error.' });
  }
}
