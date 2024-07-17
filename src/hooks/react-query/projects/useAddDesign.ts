import Agent from "@/Agent"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const addDesign = async ({ projectName, pageUrl, designDto }: { projectName: string, pageUrl: string, designDto: CreateDesignDto }) => {
    const encodedProjectName = encodeURIComponent(projectName)
    const encodedPageUrl = encodeURIComponent(pageUrl)

    return await Agent.post(`/projects/${encodedProjectName}/${encodedPageUrl}`, designDto)
}

function useAddDesign() {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: addDesign,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] })
        },
    })

    return mutation
}

export default useAddDesign
