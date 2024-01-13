import { NextApiRequest, NextApiResponse } from 'next'
import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import {ObjectId} from 'bson'
import deleteImageFromS3 from '@requests/s3/deleteImageFromS3'
import getProjectsHandlerData from '@utils/getProjectsHandlerData'
import transformIdProperty from '@utils/transformIdProperty'


export default withApiAuthRequired( async function DELETE(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { url, designName } = req.query
    const {projectsCollection, user, method, projectId} =  await getProjectsHandlerData(req, res)

    const project = await projectsCollection.findOne<Project>({
        _id: new ObjectId(projectId),
        author: user?.email,
        [`pages.${url}.designs.${designName}`]: { $exists: true },
    })

    if(project){
        const page = project.pages[url as string]
        if(page){
            const design = page.designs[designName as string] as Design
            if(design){
                if(design.designSnapshotUrl) {
                    await deleteImageFromS3(design.designSnapshotUrl)
                }
                if(design.websiteSnapshotUrl) {
                    await deleteImageFromS3(design.websiteSnapshotUrl)
                }
            }
        }
    }

    const updatedProject = await projectsCollection.findOneAndUpdate(
        {
            _id: new ObjectId(projectId),
            author: user?.email,
            [`pages.${url}.designs.${designName}`]: { $exists: true },
        },
        {
            $unset: {
                [`pages.${url}.designs.${designName}`]: 1,
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
