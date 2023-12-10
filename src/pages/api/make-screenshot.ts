// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import puppeteer from "puppeteer"

export default async function GET(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { url, width } = req.query;
  let height = 1080

  if (!url || !width) {
    return res.status(400).json({ error: 'Missing required parameters.' });
  }

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url as string, { waitUntil: 'networkidle2' });

    // const bodyHandle = await page.$('body');
    // if(bodyHandle){
    //   const box = await bodyHandle.boundingBox();
    //   await bodyHandle.dispose();
    //
    //   if(box){
    //     height = box?.height || 1080;
    //   }
    // }

    await page.setViewport({width: 1920, height });
    const base64Screenshot = await page.screenshot({ encoding: 'base64' });
    await browser.close();

    res.status(200).json({base64: base64Screenshot})
  }catch (error) {
    console.error('Error capturing screenshot:', error);
    res.status(500).json({ error: 'Internal Server Error.' });
  }
}
