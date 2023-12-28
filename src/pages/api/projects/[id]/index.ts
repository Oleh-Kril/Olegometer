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

        case 'DELETE':
            const deletedProject = await projectsCollection.findOneAndDelete({
                _id: new ObjectId(projectId),
                author: user.email,
            });

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
