import React, {useState} from "react"
import Modal from "../../../../../ui/Modal"
import {ModalProps} from "../../../../../ui/Modal"
import {FieldValues, useForm} from "react-hook-form"
import styles from '../styles/AddPageModal.module.scss'
import Agent from "../../../../../Agent"
import {useRouter} from "next/router"
import useProjects from "../../../../../store/projectsStore"

type Props = Omit<ModalProps, 'children'>

function AddPageModal({showModal, onRequestClose} : Props){
    const {projects, setProjects} = useProjects()
    const router = useRouter()

    const onCreatePageSubmit = async (data: FieldValues) => {
        const projectId = router.query.id as string

        const updatedProject = await Agent.post(`/api/projects/${projectId}/pages`, {url: data.url, designs: []})

        const newProjectsList = projects.map((project) => project.id === projectId ? updatedProject : project) as Project[]

        setProjects(newProjectsList)
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    return (
        <Modal showModal={showModal} onRequestClose={onRequestClose}>
            <div className={styles.addPageModal}>
                <form onSubmit={handleSubmit(onCreatePageSubmit)}>
                    <input {...register('url', { required: true })} />
                    {errors.url && <p>Please enter url before saving.</p>}
                    <input type="submit" />
                </form>
            </div>
        </Modal>
    )
}

export default AddPageModal
