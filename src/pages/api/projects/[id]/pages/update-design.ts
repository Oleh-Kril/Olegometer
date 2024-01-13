import { NextApiRequest, NextApiResponse } from 'next'
import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import {ObjectId} from 'bson'
import getProjectsHandlerData from "@utils/getProjectsHandlerData";
import transformIdProperty from "@utils/transformIdProperty";

interface Body {
    design: Design;
    designName: string;
}

export default withApiAuthRequired( async function PUT(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const {projectsCollection, user, method, projectId} =  await getProjectsHandlerData(req, res)

    const { url } = req.query
    const {design, designName}: Body = req.body

    const updatedProject = await projectsCollection.findOneAndUpdate(
        {
            _id: new ObjectId(projectId),
            author: user?.email,
            [`pages.${url}.designs.${designName}`]: { $exists: true },
        },
        {
            $set: {
                [`pages.${url}.designs.${designName}`]: design,
            },
        },
        {
            returnDocument: 'after',
        }
    )

    if (updatedProject) {
        res.status(200).json(transformIdProperty(updatedProject))
    } else {
        res.status(404).json({ error: 'Project not found' })
    }
})
