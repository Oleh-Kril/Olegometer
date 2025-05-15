import Agent from "@/Agent"
import {useMutation} from "@tanstack/react-query"
import {useRouter} from "next/router"
import useSnackbar from "@/hooks/useSnackbar" 
const logoutUser = async (): Promise<void> => {
    return await Agent.post(`/auth/logout`)
}

function useLogout() {
    const router = useRouter()
    const {showError} = useSnackbar()

    const mutation = useMutation<void, Error, void>({
        mutationFn: logoutUser,
        onSuccess: () => {
            router.push('/')
        },
        onError: (error) => {
            showError(error.message || "Logout failed. Please try again.")
        },
    })

    return mutation
}

export default useLogout 