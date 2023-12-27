import Agent from "../../../../../Agent"
import parseFigmaUrl from "../../../../../utils/parseFigmaUrl";

export default async function addDesign(projectId: string, pageUrl: string, designUrl: string, name: string, userEmail?: string){
    if(!userEmail){
        throw new Error('User not authorized')
    }

    const {fileKey, imageId} = parseFigmaUrl(designUrl)
    const personalAccessToken = await Agent.get(`/api/projects/${projectId}/figmaToken`)
    console.log(fileKey, imageId, personalAccessToken, userEmail, name)

    try {
        const response = await Agent.get(`https://api.figma.com/v1/images/${fileKey}?ids=${imageId}&format=jpg`, {
            headers: {
                'X-FIGMA-TOKEN': personalAccessToken,
            },
        });
        const { images } = response

        const imageUrl = images[imageId.replace(/-/g, ':')]

        const updatedProject: Project = await Agent.post('/api/s3/upload-from-figma', {
            projectId,
            pageUrl,
            designUrl,
            name,
            userEmail,
            imageUrl,
            fileKey,
            imageId
        })

        return updatedProject

    } catch (error) {
        console.error('Error fetching Figma images and uploading to s3:', error);
    }
}
