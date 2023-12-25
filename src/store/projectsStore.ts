import { atom, useAtom } from 'jotai'
import useSWR from 'swr'
import Agent from '../Agent'

const fetcher = async (url: string) => await Agent.get<Project[]>(url)

const projectsAtom = atom<Project[] | null>(null)

function useProjects(){
    const [projects, setProjects] = useAtom(projectsAtom)

    const { data: apiProjects, error } = useSWR('/api/projects', fetcher)

    if (projects === null && apiProjects) {
        setProjects(apiProjects)
        return {projects: apiProjects, setProjects: setProjects}
    }

    return {projects: projects || [], setProjects: setProjects}
}

export default useProjects
