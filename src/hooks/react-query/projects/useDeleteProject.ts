import Agent from "@/Agent"
import {useMutation, useQueryClient} from "@tanstack/react-query"

const deleteProject = async (projectName: string) => {
    const encodedProjectName = encodeURIComponent(projectName)

    return await Agent.delete(`/projects/${encodedProjectName}`)
}

function useDeleteProject() {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: deleteProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects']})
        },
    })

    return mutation
}

export default useDeleteProject
