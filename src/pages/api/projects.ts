import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise, { getDatabase} from "../../db"
import {ObjectId} from "bson"
import {getSession, withApiAuthRequired} from "@auth0/nextjs-auth0"

const COLLECTION_NAME = 'projects';

export default withApiAuthRequired(async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { user } = await getSession(req, res);
    const { method } = req;
    const projectId = req.query.id as string;

    const client = await clientPromise
    const projectsCollection = client.db().collection<Project>(COLLECTION_NAME)

    if(!projectsCollection){
        res.status(500).json({error: "Connection to db wasn't established"});
        return res
    }

    switch (method) {
        case 'GET':
            const allProjects = await projectsCollection.find({ author: user?.email }).toArray();

            const projectsWithIdAsString = allProjects.map((project) => {
                const { _id, ...rest } = project;
                return {...rest, id: _id.toString() };
            });

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
})
