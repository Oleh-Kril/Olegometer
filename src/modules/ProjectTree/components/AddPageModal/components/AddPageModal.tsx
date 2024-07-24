import React, {useEffect} from 'react'
import Modal from '@ui/Modal'
import {ModalProps} from '@ui/Modal'
import {FieldValues, useForm} from 'react-hook-form'
import styles from '../styles/AddPageModal.module.scss'
import useProjectsEndpoint from '@hooks/useProjectsEndpoint'
import useCurrentProject from '@hooks/useCurrentProject'
import FlexContainer from "@ui/FlexContainer"
import useSnackbar from "@hooks/useSnackbar"
import useAddPage from "@hooks/react-query/projects/useAddPage"

type Props = Omit<ModalProps, 'children'>

function AddPageModal({showModal, onRequestClose} : Props){
    const makeRequestAndUpdateState = useProjectsEndpoint()
    const { project } = useCurrentProject()
    const { snackbar, showError } = useSnackbar()
    const { mutate: addPage, error, isSuccess } = useAddPage()

    snackbar([
        {
            message: 'Page added successfully',
            severity: 'success',
            condition: isSuccess
        },
        {
            message: error?.message ?? 'An error occurred while adding the page',
            severity: 'error',
            condition: !!error
        },
    ])

    const onCreatePageSubmit = async (data: FieldValues) => {
        if(project){
            let url = data.url.replace(/\s/g, '')

            if(!url || !url.includes('/')){
                showError('Please enter valid url.')
                return
            }

            if(project.pages[url]){
                showError('Page with this url already exists.')
                return
            }

            if(url.includes(project.domainUrl)){
                url = url.replace(project.domainUrl, '')
            }

            addPage({projectName: project.name, pageUrl: url, avoidAuth: data.avoidAuth, authPage: data.authPage})
        }
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            url: '/home',
            avoidAuth: false,
            authPage: false,
        }
    })

    return (
        <Modal showModal={showModal} onRequestClose={onRequestClose}>
            <div className={styles.addPageModal}>
                <form onSubmit={handleSubmit(onCreatePageSubmit)}>
                    <FlexContainer>
                        <input {...register('url', { required: true })} />
                        {errors.url && <p>Please enter url before saving.</p>}
                        <label>
                            <input {...register('avoidAuth', { required: false })} type={"checkbox"} style={{marginRight: 5}}/>
                            <span>Anonymous page</span>
                        </label>
                        <label>
                            <input {...register('authPage', { required: false })} type={"checkbox"} style={{marginRight: 5}}/>
                            <span>Page that should be used for auth</span>
                        </label>
                        <button type="submit" >Submit</button>
                    </FlexContainer>
                </form>
            </div>
        </Modal>
    )
}

export default AddPageModal
