import { NextApiRequest, NextApiResponse } from 'next';
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import Agent from "../../../Agent"
import sizeOf from "image-size"
import {ObjectId} from "bson"
import transformIdProperty from "../../../utils/transformIdProperty"
import getProjectsHandlerData from "../../../utils/getProjectsHandlerData"
import uploadImageToS3 from "../../../requests/S3/uploadImageToS3"

export default withApiAuthRequired(async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try{
        const {projectsCollection, user, method} =  await getProjectsHandlerData(req, res)
        const {
            projectId,
            pageUrl,
            designUrl,
            name,
            userEmail,
            imageUrl,
            fileKey,
            imageId
        } = req.body

        switch (method) {
            case 'POST':
                Agent.get(imageUrl,{
                    method: 'GET',
                    responseType: 'arraybuffer',
                })
                    .then(async (data: any) => {
                        const imageBuffer = Buffer.from(data, 'base64');
                        const dimensions = sizeOf(imageBuffer);
                        const { width } = dimensions;

                        const key = `${userEmail}:/${projectId}:${pageUrl}:/${width}:design`

                        // uploadImageToS3(key, data).then(async () => {
                            const design = {
                                    width: width || 1900,
                                    designUrl,
                                    designSnapshotUrl: key,
                                    name
                                } as Design

                            const updatedProject = await projectsCollection.findOneAndUpdate(
                                {
                                    _id: new ObjectId(projectId),
                                    author: user?.email,
                                    'pages.url': pageUrl
                                },
                                {
                                    $push: {
                                        'pages.$.designs': design
                                    },
                                },
                                { returnDocument: 'after' }
                            );

                            if (updatedProject) {
                                res.status(200).json(transformIdProperty(updatedProject));
                            } else {
                                res.status(404).json({ error: 'Project not found' });
                            }
                            })
                    // })
                    .catch(error => {
                        res.status(500).json({ error: 'Something went wrong' });
                    });
                break;

            default:
                res.setHeader('Allow', ['POST']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }

    }catch{
        return res
    }
})
