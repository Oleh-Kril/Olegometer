import { atom } from 'jotai'

export interface SnackbarItem {
    condition: boolean
    message: string
    severity: 'error' | 'warning' | 'info' | 'success'
}

export const snackbarsAtom = atom<SnackbarItem[]>([])

