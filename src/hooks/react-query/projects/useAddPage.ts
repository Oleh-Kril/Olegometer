import Agent from "@/Agent"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const addPage = async ({ projectName, ...payload }: { projectName: string, pageUrl: string, avoidAuth?: boolean, authPage?: boolean }) => {
    const encodedProjectName = encodeURIComponent(projectName)

    return await Agent.post(`/projects/${encodedProjectName}`, payload)
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
