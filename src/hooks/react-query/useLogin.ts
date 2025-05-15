import Agent from "@/Agent"
import {useMutation} from "@tanstack/react-query"
import {useRouter} from "next/router"
import useSnackbar from "@/hooks/useSnackbar"

interface LoginCredentials {
    username?: string;
    password?: string;
}

interface LoginResponse {
    message: string;
}

const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    return await Agent.post(`/auth/login`, credentials)
}

function useLogin() {
    const router = useRouter()
    const {showError} = useSnackbar()

    const mutation = useMutation<LoginResponse, Error, LoginCredentials>({
        mutationFn: loginUser,
        onSuccess: () => {
            router.push('/projects')
        },
        onError: (error) => {
            showError(error.message || "Login failed. Please try again.")
        },
    })

    return mutation
}

export default useLogin 