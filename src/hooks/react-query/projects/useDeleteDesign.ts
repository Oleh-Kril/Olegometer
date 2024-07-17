import Agent from "@/Agent"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const deleteDesign = async ({ projectName, pageUrl, designName }: { projectName: string, pageUrl: string, designName: string }) => {
    const encodedProjectName = encodeURIComponent(projectName)
    const encodedPageUrl = encodeURIComponent(pageUrl)
    const encodedDesignName = encodeURIComponent(designName)
    return await Agent.delete(`/projects/${encodedProjectName}/${encodedPageUrl}/${encodedDesignName}`)
}

function useDeleteDesign() {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: deleteDesign,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] })
        },
    })

    return mutation
}

export default useDeleteDesign

