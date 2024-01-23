import { NextApiRequest, NextApiResponse } from 'next'
import {ObjectId} from 'bson'
import getProjectsHandlerData from '@utils/getProjectsHandlerData'
import transformIdProperty from '@utils/transformIdProperty'
import getCurrentTimeString from "@utils/dateUtils"

export default async function POST(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const {projectsCollection, user, method, projectId} =  await getProjectsHandlerData(req, res)

    const { url } = req.query
    const {design, designName} = req.body
    design.designSnapshotLastUpdated = getCurrentTimeString()

    const updatedProject = await projectsCollection.findOneAndUpdate(
        {
            _id: new ObjectId(projectId),
            author: user?.email,
            [`pages.${url}`]: { $exists: true },
        },
        {
            $set: {
                [`pages.${url}.designs.${designName}`]: design,
            },
        },
        { returnDocument: 'after' }
    )

    if (updatedProject) {
        res.status(200).json(transformIdProperty(updatedProject))
    } else {
        res.status(404).json({ error: 'Project not found' })
    }
}
