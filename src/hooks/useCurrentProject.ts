import { useCallback } from 'react'
import useProjects from '../store/projectsStore'
import {useRouter} from 'next/router'

const useCurrentProject = (getPage?: boolean, getDesign?: boolean) => {
    const { projects, setProjects } = useProjects()
    const router = useRouter()

    const getProjectAndData = useCallback(() => {
        const project = projects.find(project => project.id === router.query.id) as Project

        if(getPage){
            const page = project?.pages[router.query.pageUrl as string] as Page

            if(getDesign){
                const design = page?.designs[router.query.designName as string] as Design

                return {project, page, design}
            }

            return {project, page}
        }

        return {project}
    }, [router.query, projects])

    return getProjectAndData()
}

export default useCurrentProject
