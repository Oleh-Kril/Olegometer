import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from "../../../db"
import {getSession, withApiAuthRequired} from "@auth0/nextjs-auth0"
import transformIdProperty from "../../../utils/transformIdProperty"
import getProjectsHandlerData from "../../../utils/getProjectsHandlerData"

export default withApiAuthRequired(async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try{
        const {projectsCollection, user, method} =  await getProjectsHandlerData(req, res)

        switch (method) {
            case 'GET':
                const allProjects = await projectsCollection.find({ author: user?.email }).toArray();

                const projectsWithIdAsString = allProjects.map((project) => transformIdProperty(project)) as Project[];

                res.status(200).json(projectsWithIdAsString);
                break;

            case 'POST':
                const newProject: Project = req.body;
                const result = await projectsCollection.insertOne(newProject);

                if(result.acknowledged){
                    res.status(201).json(result.insertedId.toString());
                }else{
                    res.status(400).json({ error: 'Project not created' })
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
