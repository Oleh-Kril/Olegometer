import React from 'react'
import {FieldValues, useForm} from 'react-hook-form'
import styles from '../styles/AddPageModal.module.scss'
import addDesign from '../requests/addDesign'
import {useUser} from '@auth0/nextjs-auth0/client'

import {RESET} from 'jotai/utils'
import Modal, {ModalProps} from '@ui/Modal'
import useGlobalLoader from '@store/globalLoaderStore'
import useProjectsEndpoint from '@hooks/useProjectsEndpoint'
import useCurrentProject from '@hooks/useCurrentProject'


type Props = Omit<ModalProps, 'children'> & {
    page: Page,
    pageUrl: Url
}

function AddDesignModal({showModal, onRequestClose, page, pageUrl} : Props){
    const { user, error, isLoading } = useUser()
    const [globalLoader, setGlobalLoader] = useGlobalLoader()
    const makeRequestAndUpdateState = useProjectsEndpoint()
    const {project} = useCurrentProject()

    const onCreateDesignSubmit = async (data: FieldValues) => {
        if(page?.designs[data.name]){
            window.alert('Design with this name already exists.')
            return
        }

        setGlobalLoader({showLoader: true, text: 'Exporting frame from figma to create design...'})

        try {
            await makeRequestAndUpdateState(() => addDesign(project, pageUrl, data.url, data.name, user?.email ?? undefined))
        }catch (e){
            window.alert(`Design isn't added. Please try again. ${e}`)
        }

        setGlobalLoader(RESET)
        onRequestClose()
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: 'desktop design',
            url: 'https://www.figma.com/file/EH0gHvwosCd7pVbE9NRWey/site.pt2?type=design&node-id=4013-765&mode=design&t=pnV04DI3vl2XIrM5-0'
        }
    })

    return (
        <Modal showModal={showModal} onRequestClose={onRequestClose}>
            <div className={styles.addPageModal}>
                <form onSubmit={handleSubmit(onCreateDesignSubmit)}>
                    <input {...register('url', { required: true })} />
                    {errors.url && <p>Please enter url before saving.</p>}
                    <input {...register('name', { required: true })} />
                    {errors.name && <p>Please enter name before saving.</p>}
                    <input type="submit" />
                </form>
            </div>
        </Modal>
    )
}

export default AddDesignModal
