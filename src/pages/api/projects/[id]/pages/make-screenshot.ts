import { NextApiRequest, NextApiResponse } from 'next';
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import getProjectsHandlerData from "../../../../../utils/getProjectsHandlerData";
import puppeteer, {Page} from "puppeteer";
import uploadImageToS3 from "../../../../../requests/s3/uploadImageToS3";
import {ObjectId} from "bson";
import transformIdProperty from "../../../../../utils/transformIdProperty";

export default withApiAuthRequired(async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try{
        const {projectsCollection, user, method, projectId} =  await getProjectsHandlerData(req, res)
        const { url } = req.query

        switch (method) {
            case 'POST':
                const { design, projectDomainUrl } = req.body as { design: Design, projectDomainUrl: string };

                if (!design) {
                    return res.status(400).json({ error: 'Missing required design parameter.' });
                }

                try {
                    const browser = await puppeteer.launch();
                    const page = await browser.newPage();
                    await page.goto(projectDomainUrl + (url as string), { waitUntil: 'networkidle0' });

                    await waitTillHTMLRendered(page);

                    await page.setViewport({width: design.width, height: 1080 });
                    const imageBuffer = await page.screenshot({ encoding: 'binary', fullPage: true});
                    await browser.close();

                    const key = `${user.email}:/${projectId}:${url}:/${design.width}`

                    uploadImageToS3(key, imageBuffer).then(async () => {
                        const updatedProject = await projectsCollection.findOneAndUpdate(
                            {
                                _id: new ObjectId(projectId),
                                author: user?.email,
                                'pages.url': url,
                                'pages.designs.name': design.name,
                            },
                            {
                                $set: {
                                    'pages.$[i].designs.$[j].websiteSnapshotUrl': key,
                                },
                            },
                            {
                                arrayFilters: [
                                    { 'i.url': url },
                                    { 'j.name': design.name },
                                ],
                                returnDocument: 'after',
                            }
                        );

                        if (updatedProject) {
                            res.status(200).json(transformIdProperty(updatedProject));
                        } else {
                            res.status(404).json({ error: 'Project not found' });
                        }
                    })

                }catch (error) {
                    console.error('Error capturing screenshot:', error);
                    res.status(500).json({ error: 'Internal Server Error.' });
                }
                break;

            default:
                res.setHeader('Allow', ['POST']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }

    }catch{
        return res
    }
})

async function waitTillHTMLRendered(page: Page, timeout = 30000){
    const checkDurationMsecs = 1000;
    const maxChecks = timeout / checkDurationMsecs;
    let lastHTMLSize = 0;
    let checkCounts = 1;
    let countStableSizeIterations = 0;
    const minStableSizeIterations = 3;

    while(checkCounts++ <= maxChecks){
        let html = await page.content();
        let currentHTMLSize = html.length;

        let bodyHTMLSize = await page.evaluate(() => document.body.innerHTML.length);

        console.log('last: ', lastHTMLSize, ' <> curr: ', currentHTMLSize, " body html size: ", bodyHTMLSize);

        if(lastHTMLSize != 0 && currentHTMLSize == lastHTMLSize)
            countStableSizeIterations++;
        else
            countStableSizeIterations = 0; //reset the counter

        if(countStableSizeIterations >= minStableSizeIterations) {
            console.log("Page rendered fully..");
            break;
        }

        lastHTMLSize = currentHTMLSize;
        await page.waitForTimeout(checkDurationMsecs);
    }
};

