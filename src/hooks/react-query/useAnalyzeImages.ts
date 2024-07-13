import Agent from "@/Agent"
import {useMutation, useQueryClient} from "@tanstack/react-query"

const compareScreenshots = async ({ projectName, pageUrl, designName }: {projectName: string, pageUrl: string, designName: string}) => {
    const encodedProjectName = encodeURIComponent(projectName)
    const encodedPageUrl = encodeURIComponent(pageUrl)
    const encodedDesignName = encodeURIComponent(designName)

    return await Agent.post(`/projects/${encodedProjectName}/${encodedPageUrl}/${encodedDesignName}/compare-screenshots`)
}

function useAnalyzeImages() {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: compareScreenshots,
        onSuccess: () => {
            queryClient.invalidateQueries()
        },
    })

    return mutation
}

export default useAnalyzeImages
