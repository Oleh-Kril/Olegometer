import parseFigmaUrl from '@utils/parseFigmaUrl'
import Agent from '@/Agent'

export default async function updateAllSnapshots(project: Project, userEmail?: string, exportFigmaDesigns?: boolean){

    if(!userEmail){
        throw new Error('User not authorized')
    }

    if(userEmail !== project.author){
        throw new Error('User has no access to this project')
    }

    const promises: Promise<void>[] = []
    const updatedProject: Project = {...project}

    Object.entries(project.pages).forEach(([pageUrl, page]) => {
        Object.entries(page.designs).forEach(([designName, design]) => {
            const promiseForPageSnapshot = Agent.post<Project>(`/api/projects/${project.id}/pages/make-screenshot?url=${pageUrl}`,
                {design, projectDomainUrl: project.domainUrl, designName}).then((updates) => {
                updatedProject.pages = updates.pages
            })

            if(exportFigmaDesigns){
                const {fileKey, imageId} = parseFigmaUrl(design.designUrl)

                if(fileKey && imageId){
                    const promise = Agent.get<{images: any}>(`https://api.figma.com/v1/images/${fileKey}?ids=${imageId}&format=jpg`, {
                        headers: {
                            'X-FIGMA-TOKEN': project.figmaToken,
                        },
                    }).then(({images}) => {
                        const imageUrl = images[imageId.replace(/-/g, ':')]

                        return Agent.post<Design>('/api/s3/upload-from-figma', {
                            projectId: project.id,
                            pageUrl,
                            designUrl: design.designUrl,
                            userEmail,
                            imageUrl,
                        }).then((updates: Design) => {
                            const updatedDesign: Design = {
                                ...design,
                                width: updates.width,
                                designSnapshotUrl: updates.designSnapshotUrl,
                            }

                            updatedProject.pages[pageUrl].designs[designName] = updatedDesign

                            return promiseForPageSnapshot
                        })
                    })
                    promises.push(promise)
                }
            }else{
                promises.push(promiseForPageSnapshot)
            }

        })
    })

    await Promise.all(promises)

    return updatedProject
}
