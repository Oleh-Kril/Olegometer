import Agent from "@/Agent"
import {useMutation, useQueryClient} from "@tanstack/react-query"

const createProject = async (project: CreateProjectDto) => {
    return await Agent.post(`/projects`, project)
}

function useCreateProject() {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: createProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects']})
        },
    })

    return mutation
}

export default useCreateProject
