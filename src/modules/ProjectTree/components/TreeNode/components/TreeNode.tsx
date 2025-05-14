import React, {MouseEventHandler, useEffect} from 'react'
import styles from '../styles/TreeNode.module.scss'

import {RESET} from 'jotai/utils'
import useConfirmationModal from '@store/confirmationModalStore'
import useCurrentProject from '@hooks/useCurrentProject'
import useSnackbar from "@hooks/useSnackbar"
import useDeletePage from "@hooks/react-query/projects/useDeletePage"

export type TreeNodeProps = {
    name: string
    children?: React.ReactNode
    onClick?: MouseEventHandler<HTMLDivElement>
    onDeleteClick?: () => void
    className?: string
    isOutlined?: boolean
    id?: string
}

export default function TreeNode({name, onDeleteClick, children, className, isOutlined, ...props}: TreeNodeProps){
    const [confirmationModal, setConfirmationModal] = useConfirmationModal()
    const {project, page} = useCurrentProject(true, false, name)

    const { mutateAsync: deletePageAsync, error, isSuccess } = useDeletePage()

    const { snackbar, showError } = useSnackbar()

    useEffect(() => {
        snackbar([
            {
                message: 'Page deleted successfully',
                severity: 'success',
                condition: isSuccess
            },
            {
                message: error?.message ?? 'An error occurred while deleting the page',
                severity: 'error',
                condition: !!error
            },
        ])
    }, [isSuccess, error])


    async function handlePageDelete(){
        if(page){
            if(Object.keys(page.designs).length === 0) {
                await deletePageAsync({projectName: project.name, pageUrl: name})
            }else{
                showError('You can only delete pages without design')
            }
        }

        setConfirmationModal(RESET)
    }

    function onDeleteHandler(e: React.MouseEvent<HTMLButtonElement>){
        e.stopPropagation()
        onDeleteClick
            ? setConfirmationModal({modalTitle: 'Are you sure you want to delete the design?', onConfirm: onDeleteClick, showModal: true})
            : setConfirmationModal({modalTitle: `Are you sure you want to delete the '${name}' page?`, onConfirm: handlePageDelete, showModal: true})
    }

    return (
        <div className={`${styles.treeNode} ${className} ${isOutlined && styles.treeNodeOutlined}`} {...props}>
            <p>{name}</p>
            {!isOutlined && <button onClick={onDeleteHandler} className={styles.deleteButton}>X</button>}
            {children}
        </div>
    )
}
