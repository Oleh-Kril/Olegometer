import {NextApiRequest, NextApiResponse} from "next"
import {getSession, Session} from "@auth0/nextjs-auth0"
import clientPromise from "../db"

const COLLECTION_NAME = 'projects'

export default async function getProjectsHandlerData(
    req: NextApiRequest,
    res: NextApiResponse
){
    const { user } = await getSession(req, res) as Session
    const { method } = req

    const client = await clientPromise
    const projectsCollection = client.db().collection<Project>(COLLECTION_NAME)

    if(!projectsCollection){
        res.status(500).json({error: "Connection to db wasn't established"})
        throw new Error("Connection to db wasn't established")
    }

    const projectId = req.query.id as string;

    return {user, method, projectsCollection, projectId}
}
