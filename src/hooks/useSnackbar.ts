import {useAtom, useSetAtom} from 'jotai'
import {SnackbarItem, snackbarsAtom} from '@/store/snackbarStore'

const useSnackbar = () => {
    const [_, setSnackbars] = useAtom(snackbarsAtom)

    const showSnackbar = (messages: SnackbarItem[]) => {
        const validMessages = messages.filter((msg) => msg.condition)
        if(validMessages.length === 0) return
        setSnackbars(validMessages)
    }

    const showError = (message: string) => {
        setSnackbars((prev) => ([...prev, { message, severity: 'error', condition: true }]))
    }

    return {snackbar: showSnackbar, showError}
}

export default useSnackbar
