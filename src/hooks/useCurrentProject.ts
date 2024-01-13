import { useCallback } from 'react'
import useProjects from '../store/projectsStore'
import {useRouter} from 'next/router'

const useCurrentProject = (getPage?: boolean, getDesign?: boolean) => {
    const { projects, setProjects } = useProjects()
    const router = useRouter()

    const getProjectAndData = useCallback(() => {
        const project = projects.find(project => project.id === router.query.id) as Project

        if(getPage){
            const pageUrl = router.query.pageUrl as string
            const page = project?.pages[pageUrl] as Page

            if(getDesign){
                const designName = router.query.designName as string
                const design = page?.designs[designName] as Design

                return {project, page, pageUrl, design, designName}
            }

            return {project, page, pageUrl}
        }

        return {project}
    }, [router.query, projects])

    return getProjectAndData()
}

export default useCurrentProject
