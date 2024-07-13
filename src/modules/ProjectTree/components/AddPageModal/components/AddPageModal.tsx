import React from 'react'
import Modal from '../../../../../ui/Modal'
import {ModalProps} from '../../../../../ui/Modal'
import {FieldValues, useForm} from 'react-hook-form'
import styles from '../styles/AddPageModal.module.scss'
import Agent from '../../../../../Agent'
import {useRouter} from 'next/router'
import useProjectsEndpoint from '../../../../../hooks/useProjectsEndpoint'
import useCurrentProject from '../../../../../hooks/useCurrentProject'
import FlexContainer from "@ui/FlexContainer"

type Props = Omit<ModalProps, 'children'>

function AddPageModal({showModal, onRequestClose} : Props){
    const makeRequestAndUpdateState = useProjectsEndpoint()
    const { project } = useCurrentProject()

    const onCreatePageSubmit = async (data: FieldValues) => {
        let url = data.url.replace(/\s/g, '')

        if(!url || !url.includes('/')){
            window.alert('Please enter valid url.')
            return
        }

        if(project.pages[url]){
            window.alert('Page with this url already exists.')
            return
        }

        if(url.includes(project.domainUrl)){
            url = url.replace(project.domainUrl, '')
        }

        await makeRequestAndUpdateState(() => Agent.post<Project>(
            `/api/projects/${project.id}/pages`,
            {pageUrl: url} )
        )
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            url: '/home',
        }
    })

    return (
        <Modal showModal={showModal} onRequestClose={onRequestClose}>
            <div className={styles.addPageModal}>
                <form onSubmit={handleSubmit(onCreatePageSubmit)}>
                    <FlexContainer>
                        <input {...register('url', { required: true })} />
                        {errors.url && <p>Please enter url before saving.</p>}
                        <button type="submit" >Submit</button>
                    </FlexContainer>
                </form>
            </div>
        </Modal>
    )
}

export default AddPageModal
