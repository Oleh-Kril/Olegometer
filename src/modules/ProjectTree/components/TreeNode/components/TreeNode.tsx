import React, {MouseEventHandler} from 'react'
import styles from '../styles/TreeNode.module.scss'

import {RESET} from 'jotai/utils'
import useConfirmationModal from '@store/confirmationModalStore'
import useCurrentProject from '@hooks/useCurrentProject'
import useProjectsEndpoint from '@hooks/useProjectsEndpoint'
import Agent from '@/Agent'

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
    const makeRequestAndUpdateState = useProjectsEndpoint()
    const {project, page} = useCurrentProject(true)

    async function deletePage(){
        if(page && Object.keys(page.designs).length === 0) {
            await makeRequestAndUpdateState(() => Agent.delete<string>(`/api/projects/${project.id}/pages?url=${name}`))
        }else{
            window.alert('You can only delete pages without designs')
        }
        setConfirmationModal(RESET)
    }

    function onDeleteHandler(e: React.MouseEvent<HTMLButtonElement>){
        e.stopPropagation()
        onDeleteClick
            ? setConfirmationModal({modalTitle: 'Are you sure you want to delete the design?', onConfirm: onDeleteClick, showModal: true})
            : setConfirmationModal({modalTitle: 'Are you sure you want to delete the page?', onConfirm: deletePage, showModal: true})
    }

    return (
        <div className={`${styles.treeNode} ${className} ${isOutlined && styles.treeNodeOutlined}`} {...props}>
            <p>{name}</p>
            {!isOutlined && <button onClick={onDeleteHandler} className={styles.deleteButton}>X</button>}
            {children}
        </div>
    )
}
