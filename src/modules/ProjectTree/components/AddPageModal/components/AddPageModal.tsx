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
    const { mutateAsync: addPageAsync, error, isSuccess } = useAddPage()

    useEffect(() => {
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
    }, [ isSuccess, error])


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

            await addPageAsync({projectName: project.name, pageUrl: url})

            onRequestClose()
        }
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
