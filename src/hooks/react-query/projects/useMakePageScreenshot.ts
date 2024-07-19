import { useMutation, useQueryClient } from "@tanstack/react-query"
import Agent from "@/Agent"

const makePageScreenshot = async ({ projectName, pageUrl, designName }: { projectName: string, pageUrl: string, designName: string }) => {
    const encodedProjectName = encodeURIComponent(projectName)
    const encodedPageUrl = encodeURIComponent(pageUrl)
    const encodedDesignName = encodeURIComponent(designName)

    return await Agent.post(`/projects/${encodedProjectName}/${encodedPageUrl}/${encodedDesignName}/make-screenshot`)
}

function useMakePageScreenshot() {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: makePageScreenshot,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] })
        },
    })

    return mutation
}

export default useMakePageScreenshot
