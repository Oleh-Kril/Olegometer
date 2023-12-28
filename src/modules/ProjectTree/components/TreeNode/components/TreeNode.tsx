import React, {MouseEventHandler} from "react"
import styles from '../styles/TreeNode.module.scss'
import useConfirmationModal from "../../../../../store/confirmationModalStore"
import {useRouter} from "next/router"
import Agent from "../../../../../Agent"
import {RESET} from "jotai/utils"
import useProjects from "../../../../../store/projectsStore"
import useProjectsEndpoint from "../../../../../hooks/useProjectsEndpoint"

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
    const router = useRouter()
    const {projects, setProjects} = useProjects()
    const makeRequestAndUpdateState = useProjectsEndpoint()

    async function deletePage(){
        const projectId = router.query.id
        const project = projects.find(project => project.id === projectId) as Project
        const page = project.pages.find(page => page.url === name)

        if(page && page.designs.length === 0) {
            await makeRequestAndUpdateState(() => Agent.delete<string>(`/api/projects/${projectId}/pages?url=${name}`))
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
