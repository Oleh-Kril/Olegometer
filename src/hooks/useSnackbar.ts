import { useSetAtom } from 'jotai'
import {SnackbarItem, snackbarsAtom} from '@/store/snackbarStore'

const useSnackbar = () => {
    const setSnackbars = useSetAtom(snackbarsAtom)

    const showSnackbar = (messages: SnackbarItem[]) => {
        const validMessages = messages.filter((msg) => msg.condition)
        setSnackbars(validMessages)
    }

    const showError = (message: string) => {
        setSnackbars((prev) => ([...prev, { message, severity: 'error', condition: true }]))

        setTimeout(() => {
            setSnackbars((prev) => (prev.filter((msg) => msg.message !== message)))
        }, 3500)
    }

    return {snackbar: showSnackbar, showError}
}

export default useSnackbar
