import parseFigmaUrl from '@utils/parseFigmaUrl'
import Agent from '@/Agent'

export default async function addDynamicElement(project: Project, pageUrl: string, designName: string, dynamicElementName: string, dynamicElement: DynamicElement, userEmail?: string){

    const {fileKey, imageId} = parseFigmaUrl(dynamicElement.designUrl)

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
        window.alert(`Dynamic element isn't added. Please check Figma URL and try again`)
    }

    const updatedProject: Project = await Agent.post(
        `/api/projects/${project.id}/pages/add-dynamicElement?url=${pageUrl}&designName=${designName}`,
        {dynamicElementName, dynamicElement}
    )

    return updatedProject
}
