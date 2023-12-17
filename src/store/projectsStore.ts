import { atom, useAtom } from 'jotai'
import useSWR from 'swr'
import Agent from '../Agent'

const fetcher = (url: string) => Agent.get<Project[]>(url)

const projectsAtom = atom<Project[] | null>(null)

const useProjects = () => {
    const [projects, setProjects] = useAtom(projectsAtom)

    const { data: apiProjects, error } = useSWR('/api/projects', fetcher)

    if (projects === null && apiProjects) {
        setProjects(apiProjects)
        return apiProjects
    }

    return projects || []
}

export default useProjects
