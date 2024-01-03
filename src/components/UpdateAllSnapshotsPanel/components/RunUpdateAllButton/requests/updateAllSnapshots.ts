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
    let updatedProject: Project = {...project}

    project.pages.forEach((page, pageIdx) => {
        page.designs.forEach((design, designIdx) => {

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
                            pageUrl: page.url,
                            url: design.designUrl,
                            name: design.name,
                            userEmail,
                            imageUrl,
                        }).then((updates: Design) => {
                            const updatedDesign: Design = {
                                ...design,
                                width: updates.width,
                                designSnapshotUrl: updates.designSnapshotUrl,
                            }

                            updatedProject.pages[pageIdx].designs[designIdx] = updatedDesign

                            return Agent.post<Project>(`/api/projects/${project.id}/pages/make-screenshot?url=${page.url}`,
                                {updatedDesign, projectDomainUrl: project.domainUrl}).then((updates) => {
                                updatedProject = updates
                            })
                        })
                    })

                    promises.push(promise)
                }
            }else{
                const promise = Agent.post<Project>(`/api/projects/${project.id}/pages/make-screenshot?url=${page.url}`,
                    {design, projectDomainUrl: project.domainUrl}).then((updates) => {
                    updatedProject = updates
                })

                promises.push(promise)
            }
        })
    })

    await Promise.all(promises)

    return updatedProject
}
