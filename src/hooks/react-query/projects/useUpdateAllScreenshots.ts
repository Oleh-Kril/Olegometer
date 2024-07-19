import { useMutation, useQueryClient } from "@tanstack/react-query"
import Agent from "@/Agent"

const updateAllScreenshots = async ({ projectName, exportDesigns }: { projectName: string, exportDesigns: boolean }) => {
    const encodedProjectName = encodeURIComponent(projectName)
    return await Agent.post(`/projects/${encodedProjectName}/snapshots/update-all?exportDesigns=${exportDesigns}`)
}

function useUpdateAllScreenshots() {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: updateAllScreenshots,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] })
        },
    })

    return mutation
}

export default useUpdateAllScreenshots
