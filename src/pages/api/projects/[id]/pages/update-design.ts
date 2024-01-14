import { NextApiRequest, NextApiResponse } from 'next'
import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import getProjectsHandlerData from '@utils/getProjectsHandlerData'
import getCurrentTimeString from "@utils/dateUtils"
import updateDesignQuery from "@requests/project/design/updateDesignQuery"

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
    design.designSnapshotLastUpdated = getCurrentTimeString()

    const updatedProject = await updateDesignQuery(
        projectsCollection,
        user.email,
        projectId,
        url as string,
        designName,
        design
    )

    if (updatedProject) {
        res.status(200).json(updatedProject)
    } else {
        res.status(404).json({ error: 'Not found' })
    }
})
