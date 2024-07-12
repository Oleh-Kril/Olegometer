import { useQuery, useQueryClient } from '@tanstack/react-query'
import Agent from '@/Agent'

const fetchProjects = async () => {
   return await Agent.get<Project[]>('/projects')
}

function useProjects() {
    const queryClient = useQueryClient()

    const { data: projects, error, isLoading, ...rest } = useQuery<Project[]>({
        queryKey: ['projects'],
        queryFn: fetchProjects,
        initialData: () => queryClient.getQueryData<Project[]>(['projects']),
        staleTime: 1000 * 60 * 5, // 5 minutes
    })

    return { projects: projects || [], error, isLoading, ...rest }
}

export default useProjects
