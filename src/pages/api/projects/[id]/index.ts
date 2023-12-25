import { NextApiRequest, NextApiResponse } from 'next';
import {ObjectId} from "bson"
import {withApiAuthRequired} from "@auth0/nextjs-auth0"
import getProjectsHandlerData from "../../../../utils/getProjectsHandlerData"

export default withApiAuthRequired(async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try{
        const {projectsCollection, user, method, projectId} =  await getProjectsHandlerData(req, res)

        switch (method) {
        case 'PATCH':
            const updatedProject: Project = req.body;

            const patchedProject = await projectsCollection.findOneAndUpdate(
                { _id: new ObjectId(projectId) },
                { $set: updatedProject },
                { returnDocument: 'after' }
            );

            if (patchedProject) {
                res.status(200).json(patchedProject);
            } else {
                res.status(404).json({ error: 'Project not found' });
            }
            break;

            case 'DELETE':
                const deletedProject = await projectsCollection.findOneAndDelete({
                    _id: new ObjectId(projectId),
                });
                console.log(deletedProject)
                if (deletedProject) {
                    res.status(200).json(deletedProject._id.toString());
                } else {
                    res.status(404).json({ error: 'Project not found' });
                }
                break;

            default:
                res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }

    }catch{
        return res
    }
})
