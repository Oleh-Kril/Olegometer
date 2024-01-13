import { NextApiRequest, NextApiResponse } from 'next'
import { ObjectId } from 'bson'
import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import transformIdProperty from '../../../../../utils/transformIdProperty'
import getProjectsHandlerData from '../../../../../utils/getProjectsHandlerData'

export default withApiAuthRequired(async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try{
        const {projectsCollection, user, method, projectId} =  await getProjectsHandlerData(req, res)

        switch (method) {
        case 'POST':
            const {pageUrl}: {pageUrl: Url} = req.body

            const updatedProject = await projectsCollection.findOneAndUpdate(
                { _id: new ObjectId(projectId), author: user?.email },
                {
                    $set: {
                        [`pages.${pageUrl}`]: {designs: {}},
                    },
                },
                { returnDocument: 'after' }
            )

            if (updatedProject) {
                res.status(200).json(transformIdProperty(updatedProject))
            } else {
                res.status(404).json({ error: 'Project not found' })
            }
            break

        case 'DELETE':
            const { url } = req.query

            const deletedProject = await projectsCollection.findOneAndUpdate(
                { _id: new ObjectId(projectId), author: user?.email },
                {
                    $unset: { [`pages.${url}`]: 1 },
                },
                { returnDocument: 'after' }
            )

            if (deletedProject) {
                res.status(200).json(transformIdProperty(deletedProject))
            } else {
                res.status(404).json({ error: 'Project not found' })
            }
            break

        default:
            res.setHeader('Allow', ['POST'])
            res.status(405).end(`Method ${method} Not Allowed`)
        }

    }catch{
        return res
    }
})
