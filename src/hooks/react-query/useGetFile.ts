import { useQuery } from '@tanstack/react-query'
import Agent from '@/Agent'

const fetchFile = async (fileKey: string) => {
    return await Agent.get<string>(`/file-storage?key=${fileKey}`)
}

function useGetFile(fileKey: string) {
    const response = useQuery<string>({
        queryKey: [`file-${fileKey}`],
        queryFn: () => fetchFile(fileKey),
    })

    return response
}

export default useGetFile
