import React, {MouseEventHandler} from "react"
import styles from '../styles/TreeNode.module.scss'
import useConfirmationModal from "../../../../../store/confirmationModalStore"
import {useRouter} from "next/router"
import Agent from "../../../../../Agent"
import {RESET} from "jotai/utils"
import useProjects from "../../../../../store/projectsStore"

export type TreeNodeProps = {
    name: string
    children?: React.ReactNode[]
    onClick?: MouseEventHandler<HTMLDivElement>
    className?: string
    isOutlined?: boolean
    id?: string
}

export default function TreeNode({name, children, className, isOutlined, ...props}: TreeNodeProps){
    const [confirmationModal, setConfirmationModal] = useConfirmationModal()
    const router = useRouter()
    const { projects, setProjects } = useProjects()

    async function deletePage(){
        const projectId = router.query.id

        const updatedProject = await Agent.delete(`/api/projects/${projectId}/pages?url=${name}`)

        const newProjectsList = projects.map((project) => project.id === projectId ? updatedProject : project) as Project[]

        setProjects(newProjectsList)

        setConfirmationModal(RESET)
    }

    function onDeleteHandler(e: React.MouseEvent<HTMLButtonElement>){
        e.stopPropagation()

        setConfirmationModal({modalTitle: 'Are you sure you want to delete the page?', onConfirm: deletePage, showModal: true})
    }

    return (
        <div className={`${styles.treeNode} ${className} ${isOutlined && styles.treeNodeOutlined}`} {...props}>
            <p>{name}</p>
            <button onClick={onDeleteHandler} className={styles.deleteButton}>X</button>
            {children}
        </div>
    )
}
