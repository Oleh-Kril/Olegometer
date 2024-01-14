import parseFigmaUrl from '@utils/parseFigmaUrl'
import Agent from '@/Agent'

export default async function updateDesignSnapshot(project: Project, pageUrl: string, design: Design, designName: string, userEmail?: string){
    const {fileKey, imageId} = parseFigmaUrl(design.designUrl)

    if(!fileKey || !imageId){
        throw new Error('Invalid Figma URL')
    }

    const response = await Agent.get(`https://api.figma.com/v1/images/${fileKey}?ids=${imageId}&format=jpg`, {
        headers: {
            'X-FIGMA-TOKEN': project.figmaToken,
        },
    })

    const { images } = response as any

    const imageUrl = images[imageId.replace(/-/g, ':')]

    const updates: Design = await Agent.post('/api/s3/upload-from-figma', {
        projectId: project.id,
        pageUrl,
        url: design.designUrl,
        userEmail,
        imageUrl,
    })

    const updatedDesign: Design = {
        ...design,
        width: updates.width,
        designSnapshotUrl: updates.designSnapshotUrl,
    }

    return Agent.put<Project>(
        `/api/projects/${project.id}/pages/update-design?url=${pageUrl}`,
        {design: updatedDesign, designName}
    )
}
