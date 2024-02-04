import parseFigmaUrl from '@utils/parseFigmaUrl'
import Agent from '@/Agent'

export default async function addDesign(project: Project, pageUrl: string, designUrl: string, name: string, userEmail?: string){
    const {fileKey, imageId} = parseFigmaUrl(designUrl)

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

    if(!imageUrl){
        window.alert('Design isn\'t added. Please check Figma URL and try again')
    }

    const design: Design = await Agent.post('/api/s3/upload-from-figma', {
        projectId: project.id,
        pageUrl,
        designUrl,
        userEmail,
        imageUrl,
    })

    const updatedProject: Project = await Agent.post(
        `/api/projects/${project.id}/pages/add-design?url=${pageUrl}`,
        {design, designName: name}
    )

    return updatedProject
}
