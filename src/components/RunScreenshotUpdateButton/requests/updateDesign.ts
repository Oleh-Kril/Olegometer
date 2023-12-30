import parseFigmaUrl from "../../../utils/parseFigmaUrl"
import Agent from "../../../Agent"

export default async function updateDesign(project: Project, pageUrl: string, design: Design, name: string, userEmail?: string){
    if(!userEmail){
        throw new Error('User not authorized')
    }

    if(userEmail !== project.author){
        throw new Error('User has no access to this project')
    }

    const {fileKey, imageId} = parseFigmaUrl(design.designUrl)

    if(!fileKey || !imageId){
        throw new Error('Invalid Figma URL')
    }

    const response = await Agent.get(`https://api.figma.com/v1/images/${fileKey}?ids=${imageId}&format=jpg`, {
        headers: {
            'X-FIGMA-TOKEN': project.figmaToken,
        },
    });

    const { images } = response as any

    const imageUrl = images[imageId.replace(/-/g, ':')]

    const updates: Design = await Agent.post('/api/s3/upload-from-figma', {
        projectId: project.id,
        pageUrl,
        url: design.designUrl,
        name,
        userEmail,
        imageUrl,
    })

    const updatedDesign: Design = {
        ...design,
        width: updates.width,
        designSnapshotUrl: updates.designSnapshotUrl,
    }

    const updatedProject: Project = await Agent.put(`/api/projects/${project.id}/pages/update-design?url=${pageUrl}`, updatedDesign)

    return updatedProject
}
