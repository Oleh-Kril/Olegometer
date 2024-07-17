import { useMutation, useQueryClient } from '@tanstack/react-query'
import Agent from '@/Agent'

const deletePage = async ({ projectName, pageUrl }: { projectName: string, pageUrl: string }) => {
    const encodedProjectName = encodeURIComponent(projectName)
    const encodedPageUrl = encodeURIComponent(pageUrl)

    return await Agent.delete(`/projects/${encodedProjectName}/${encodedPageUrl}`)
}

function useDeletePage() {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: deletePage,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] })
        },
    })

    return mutation
}

export default useDeletePage
