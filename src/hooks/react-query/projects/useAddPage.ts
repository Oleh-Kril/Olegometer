import Agent from "@/Agent"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const addPage = async ({ projectName, pageUrl }: { projectName: string, pageUrl: string }) => {
    const encodedProjectName = encodeURIComponent(projectName)

    return await Agent.post(`/projects/${encodedProjectName}`, { pageUrl })
}

function useAddPage() {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: addPage,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] })
        },
    })

    return mutation
}

export default useAddPage
