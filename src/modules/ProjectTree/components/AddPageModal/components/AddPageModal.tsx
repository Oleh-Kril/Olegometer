import React from "react"
import Modal from "../../../../../ui/Modal"
import {ModalProps} from "../../../../../ui/Modal"
import {FieldValues, useForm} from "react-hook-form"
import styles from '../styles/AddPageModal.module.scss'
import Agent from "../../../../../Agent"
import {useRouter} from "next/router"
import useProjectsEndpoint from "../../../../../hooks/useProjectsEndpoint"

type Props = Omit<ModalProps, 'children'>

function AddPageModal({showModal, onRequestClose} : Props){
    const router = useRouter()
    const makeRequestAndUpdateState = useProjectsEndpoint()

    const onCreatePageSubmit = async (data: FieldValues) => {
        const projectId = router.query.id as string

        await makeRequestAndUpdateState(() => Agent.post<Project>(`/api/projects/${projectId}/pages`, { url: data.url, designs: [] }));
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
