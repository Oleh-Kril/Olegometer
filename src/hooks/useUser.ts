export const useUser = (): {user: User, error: {message: string} | null, isLoading: boolean} => {
    return {
        user: {
            name: 'John Doe',
            email: 'mayorfrod777@gmail.com'
        },
        error: null,
        isLoading: false
    }
}
