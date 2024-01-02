import { NextApiRequest, NextApiResponse } from 'next'
import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import getProjectsHandlerData from '../../../../../utils/getProjectsHandlerData'
import puppeteer, {Page} from 'puppeteer'
import uploadImageToS3 from '../../../../../requests/s3/uploadImageToS3'
import {ObjectId} from 'bson'
import transformIdProperty from '../../../../../utils/transformIdProperty'
import getImageFromS3 from '../../../../../requests/s3/getImageFromS3'
import deleteImageFromS3 from '../../../../../requests/s3/deleteImageFromS3'

export default withApiAuthRequired( async function POST(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const {projectsCollection, user, method, projectId} =  await getProjectsHandlerData(req, res)

    const { url } = req.query
    const design = req.body

    const updatedProject = await projectsCollection.findOneAndUpdate(
        {
            _id: new ObjectId(projectId),
            author: user?.email,
            'pages.url': url
        },
        {
            $push: {
                'pages.$.designs': design
            },
        },
        { returnDocument: 'after' }
    )

    if (updatedProject) {
        res.status(200).json(transformIdProperty(updatedProject))
    } else {
        res.status(404).json({ error: 'Project not found' })
    }
})
