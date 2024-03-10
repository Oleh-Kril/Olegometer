import updateDesignSnapshot from '@requests/project/design/updateDesignSnapshot'
import updatePageSnapshot from '@requests/project/page/updatePageSnapshot'

export default async function updateAllSnapshots(project: Project, userEmail?: string, exportFigmaDesigns?: boolean){

    if(!userEmail){
        throw new Error('User not authorized')
    }

    const promises: Promise<void>[] = []
    let updatedProject: Project = {...project}

    Object.entries(project.pages).forEach(([pageUrl, page]) => {
        Object.entries(page.designs).forEach(([designName, design]) => {
            const promiseForPageSnapshot = updatePageSnapshot(project, pageUrl, design, designName).then(updates => {
                updatedProject = updates
            })

            if(exportFigmaDesigns){
                const promise = updateDesignSnapshot(project, pageUrl, design, designName).then(updates => {
                    updatedProject = updates

                    return promiseForPageSnapshot
                })

                promises.push(promise)
            }else{
                promises.push(promiseForPageSnapshot)
            }

        })
    })

    await Promise.all(promises)

    return updatedProject
}
