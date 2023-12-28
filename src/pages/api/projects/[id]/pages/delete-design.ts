import { NextApiRequest, NextApiResponse } from 'next';
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import getProjectsHandlerData from "../../../../../utils/getProjectsHandlerData";
import puppeteer, {Page} from "puppeteer";
import uploadImageToS3 from "../../../../../requests/S3/uploadImageToS3";
import {ObjectId} from "bson";
import transformIdProperty from "../../../../../utils/transformIdProperty";
import getImageFromS3 from "../../../../../requests/S3/getImageFromS3";
import deleteImageFromS3 from "../../../../../requests/S3/deleteImageFromS3";

export default withApiAuthRequired( async function DELETE(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { url, designName } = req.query
    const {projectsCollection, user, method, projectId} =  await getProjectsHandlerData(req, res)

    const project = await projectsCollection.findOne<Project>({
        _id: new ObjectId(projectId),
        author: user?.email,
        'pages.url': url,
        'pages.designs.name': designName,
    });

    if(project){
        const page = project.pages.find(page => page.url === url)
        if(page){
            const design = page.designs.find(design => design.name === designName) as Design
            if(design){
                // if(design.designSnapshotUrl) {
                //     await deleteImageFromS3(design.designSnapshotUrl)
                // }
                // if(design.websiteSnapshotUrl) {
                //     await deleteImageFromS3(design.websiteSnapshotUrl)
                // }
            }
        }
    }

    const updatedProject = await projectsCollection.findOneAndUpdate(
        {
            _id: new ObjectId(projectId),
            author: user?.email,
            'pages.url': url,
        },
        {
            $pull: {
                'pages.$.designs': { name: designName },
            },
        },
        {
            returnDocument: 'after',
        }
    );

    if (updatedProject) {
        res.status(200).json(transformIdProperty(updatedProject));
    } else {
        res.status(404).json({ error: 'Project not found' });
    }
})
