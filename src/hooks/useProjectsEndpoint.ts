import { useCallback } from 'react'
import useProjects from '../store/projectsStore'

type Method = 'POST' | 'PUT' | 'DELETE' | 'GET'

const useProjectsEndpoint = () => {
    const { projects, setProjects } = useProjects()

    const makeRequestAndUpdateState = useCallback(async (apiRequest: () => Promise<Project | string>, method: Method = 'PUT') => {
        try {
            const response = await apiRequest()
            let newProjectsList: Project[]

            switch (method) {
            case 'POST':
                newProjectsList = [...projects, response] as Project[]
                break
            case 'DELETE':
                newProjectsList = projects.filter(project => project.id !== response)
                break
            case 'GET':
                newProjectsList = [...projects, response] as Project[]
                break
            default:
                newProjectsList = projects.map((project) => project.id === (response as Project).id ? response : project) as Project[]
            }

            setProjects(newProjectsList)
            return response
        } catch (error) {
            console.error('Error making request:', error)
            throw error
        }
    }, [setProjects])

    return makeRequestAndUpdateState
}

export default useProjectsEndpoint
