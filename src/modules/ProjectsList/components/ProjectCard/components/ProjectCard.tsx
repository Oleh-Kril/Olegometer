import styles from '../styles/ProjectCard.module.scss'
import {useRouter} from 'next/router'
import React from 'react'
import Agent from '../../../../../Agent'
import useProjectsEndpoint from '../../../../../hooks/useProjectsEndpoint'
import useConfirmationModal from '../../../../../store/confirmationModalStore'
import {RESET} from 'jotai/utils'
import useCurrentProject from '../../../../../hooks/useCurrentProject'

export default function ProjectCard({name, domainUrl, id}: Project){
    const router = useRouter()
    const callApiAndUpdateState = useProjectsEndpoint()
    const [confirmationModal, setConfirmationModal] = useConfirmationModal()
    const { project } = useCurrentProject()

    function openProjectPage(){
        router?.push('/projects/' + id)
    }

    async function deleteProject(){
        if(project.pages.length === 0){
            await callApiAndUpdateState(() => Agent.delete<string>(`/api/projects/${id}`), 'DELETE')
        }else{
            window.alert('NOT deleted. You can not delete project with pages. Please delete all pages first.')
        }

        setConfirmationModal(RESET)
    }

    function onDeleteRequest(e: React.MouseEvent<HTMLButtonElement>){
        e.stopPropagation()
        setConfirmationModal({modalTitle: 'Are you sure you want to delete the project?', onConfirm: deleteProject, showModal: true})
    }

    return (
        <div className={styles.projectCard} onClick={openProjectPage}>
            <h3>{name}</h3>
            <p>{domainUrl}</p>
            <button onClick={onDeleteRequest} className={styles.deleteButton}>X</button>
        </div>
    )
}
