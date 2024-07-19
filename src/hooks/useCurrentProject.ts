import { useCallback } from 'react'
import useProjects from '../store/projectsStore'
import { useRouter } from 'next/router'

type BaseReturn = { project: Project, isLoading: boolean, error?: any, page?: Page, pageUrl?: string, design?: Design, designName?: string }

const useCurrentProject = (getPage?: boolean, getDesign?: boolean, pageName?: string, designName?: string): BaseReturn => {
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

                return { project, page, pageUrl, design, designName, isLoading, error }
            }

            return { project, page, pageUrl, isLoading, error }
        }

        if (pageName) {
            const page = project?.pages[pageName] as Page

            if (designName) {
                const design = page?.designs[designName] as Design

                return { project, page, pageUrl: pageName, design, designName, isLoading, error }
            }

            return { project, page, pageUrl: pageName, isLoading, error }
        }

        return { project, isLoading, error }
    }, [router.query, projects, getPage, getDesign, pageName, designName, isLoading, error])

    if (isLoading) {
        return { isLoading, project: null as any, error: null}
    }

    if (error) {
        return { error, project: null as any, isLoading}
    }

    return getProjectAndData()
}

export default useCurrentProject
