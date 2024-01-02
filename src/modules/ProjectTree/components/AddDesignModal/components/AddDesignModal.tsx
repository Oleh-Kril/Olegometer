import React from 'react'
import Modal from '../../../../../ui/Modal'
import {ModalProps} from '../../../../../ui/Modal'
import {FieldValues, useForm} from 'react-hook-form'
import styles from '../styles/AddPageModal.module.scss'
import addDesign from '../requests/addDesign'
import {useUser} from '@auth0/nextjs-auth0/client'
import useGlobalLoader from '../../../../../store/globalLoaderStore'
import {RESET} from 'jotai/utils'
import useProjectsEndpoint from '../../../../../hooks/useProjectsEndpoint'
import useCurrentProject from '../../../../../hooks/useCurrentProject'

type Props = Omit<ModalProps, 'children'> & {
    page: Page
}

function AddDesignModal({showModal, onRequestClose, page} : Props){
    const { user, error, isLoading } = useUser()
    const [globalLoader, setGlobalLoader] = useGlobalLoader()
    const makeRequestAndUpdateState = useProjectsEndpoint()
    const {project} = useCurrentProject()

    const onCreateDesignSubmit = async (data: FieldValues) => {
        if(page?.designs.find(design => design.name === data.name)){
            window.alert('Design with this name already exists.')
            return
        }

        setGlobalLoader({showLoader: true, text: 'Exporting frame from figma to create design...'})

        try {
            await makeRequestAndUpdateState(() => addDesign(project, page.url, data.url, data.name, user?.email ?? undefined))
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
            url: 'https://www.figma.com/file/EH0gHvwosCd7pVbE9NRWey/site.pt2?type=design&node-id=4806-1296&mode=design&t=sa7Q0gc2ImFJmCXF-0'
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
