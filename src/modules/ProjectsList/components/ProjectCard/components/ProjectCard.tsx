import styles from '../styles/ProjectCard.module.scss'
import {useRouter} from 'next/router'
import React, {useEffect} from 'react'
import {RESET} from 'jotai/utils'
import useProjects from '@store/projectsStore'
import useProjectsEndpoint from '@hooks/useProjectsEndpoint'
import useConfirmationModal from '@store/confirmationModalStore'
import Agent from '@/Agent'
import useCreateProject from "@hooks/react-query/projects/useCreateProject"
import useDeleteProject from "@hooks/react-query/projects/useDeleteProject"
import useSnackbar from "@hooks/useSnackbar"

export default function ProjectCard({name, domainUrl, id}: Project){
    const router = useRouter()
    const [confirmationModal, setConfirmationModal] = useConfirmationModal()
    const { projects } = useProjects()
    const project = projects.find(project => project.id === id) as Project

    const { mutateAsync: deleteProject, error, isSuccess } = useDeleteProject()

    function openProjectPage(){
        router?.push('/projects/' + id)
    }

    async function handleProjectDelete(){
        if(Object.entries(project.pages).length === 0){
            await deleteProject(project.name)
        }else{
            window.alert('NOT deleted. You can not delete project with pages. Please delete all pages first.')
        }

        setConfirmationModal(RESET)
    }

    const { snackbar } = useSnackbar()

    snackbar([
        {
            message: 'Project deleted successfully',
            severity: 'success',
            condition: isSuccess
        },
        {
            message: error?.message ?? 'An error occurred while deleting the project',
            severity: 'error',
            condition: !!error
        },
    ])

    function onDeleteRequest(e: React.MouseEvent<HTMLButtonElement>){
        e.stopPropagation()
        setConfirmationModal({modalTitle: 'Are you sure you want to delete the project?', onConfirm: handleProjectDelete, showModal: true})
    }

    return (
        <div className={styles.projectCard} onClick={openProjectPage}>
            <h3>{name}</h3>
            <p>{domainUrl}</p>
            <button onClick={onDeleteRequest} className={styles.deleteButton}>X</button>
        </div>
    )
}
