import {Collection} from 'mongodb'
import {ObjectId} from 'bson'
import transformIdProperty from '@utils/transformIdProperty'

export default async function updateDesignQuery(
    projectsCollection : Collection<Project>,
    userEmail: string ,
    projectId: string,
    url: string,
    designName: string,
    design: Design,
): Promise<Project | null> {
    const updatedProject = await projectsCollection.findOneAndUpdate(
        {
            _id: new ObjectId(projectId),
            author: userEmail,
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

    return updatedProject ? transformIdProperty(updatedProject) : null
}
