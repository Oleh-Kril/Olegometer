import { useMutation, useQueryClient } from "@tanstack/react-query"
import Agent from "@/Agent"

const exportDesignScreenshot = async ({ projectName, pageUrl, designName }: { projectName: string, pageUrl: string, designName: string }) => {
    const encodedProjectName = encodeURIComponent(projectName)
    const encodedPageUrl = encodeURIComponent(pageUrl)
    const encodedDesignName = encodeURIComponent(designName)

    return await Agent.post(`/projects/${encodedProjectName}/${encodedPageUrl}/${encodedDesignName}/export-design-screenshot`)
}

function useExportDesign() {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: exportDesignScreenshot,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] })
        },
    })

    return mutation
}

export default useExportDesign
