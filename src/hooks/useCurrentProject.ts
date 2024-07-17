import { useCallback } from 'react'
import useProjects from '../store/projectsStore'
import { useRouter } from 'next/router'

const useCurrentProject = (getPage?: boolean, getDesign?: boolean, pageName?: string, designName?: string) => {
    const { projects, error, isLoading } = useProjects()
    const router = useRouter()

    const getProjectAndData = useCallback(() => {
        const project = projects.find(project => project.id === router.query.id) as Project

        if (getPage) {
            const pageUrl = router.query.pageUrl as string
            const page = project?.pages[pageUrl] as Page

            if (getDesign) {
                const designName = router.query.designName as string
                const design = page?.designs[designName] as Design

                return { project, page, pageUrl, design, designName }
            }

            return { project, page, pageUrl }
        }

        if (pageName) {
            const page = project?.pages[pageName] as Page

            if (designName) {
                const design = page?.designs[designName] as Design

                return { project, page, pageUrl: pageName, design, designName }
            }

            return { project, page, pageUrl: pageName }
        }

        return { project }
    }, [router.query, projects])

    if (isLoading) {
        return { isLoading, project: null, page: null, design: null } // Adjust as needed
    }

    if (error) {
        return { error, project: null, page: null, design: null } // Adjust as needed
    }

    return getProjectAndData()
}

export default useCurrentProject
