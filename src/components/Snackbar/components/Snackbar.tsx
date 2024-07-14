import React, { useEffect } from 'react'
import { useAtom } from 'jotai'
import { snackbarsAtom } from '@/store/snackbarStore'
import styles from '../styles/Snackbar.module.scss'

const Snackbar = () => {
    const [snackbars, setSnackbars] = useAtom(snackbarsAtom)

    useEffect(() => {
        if (snackbars.length) {
            const timer = setTimeout(() => {
                setSnackbars([])
            }, 3000)

            return () => clearTimeout(timer)
        }
    }, [snackbars, setSnackbars])

    return (
        <div className={styles.snackbarContainer}>
            {snackbars.map((snackbar, index) => (
                <div
                    key={index}
                    className={`${styles.snackbar} ${styles[snackbar.severity]}`}
                >
                    {snackbar.message}
                </div>
            ))}
        </div>
    )
}

export default Snackbar
