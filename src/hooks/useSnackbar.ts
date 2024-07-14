import { useSetAtom } from 'jotai'
import {SnackbarItem, snackbarsAtom} from '@/store/snackbarStore'

const useSnackbar = () => {
    const setSnackbars = useSetAtom(snackbarsAtom)

    const showSnackbar = (messages: SnackbarItem[]) => {
        const validMessages = messages.filter((msg) => msg.condition)
        setSnackbars(validMessages)
    }

    return showSnackbar
}

export default useSnackbar
