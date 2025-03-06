import React, {useEffect} from 'react'
import {FieldValues, useForm} from 'react-hook-form'
import styles from '../styles/AddDesignModal.module.scss'
import {RESET} from 'jotai/utils'
import Modal, {ModalProps} from '@ui/Modal'
import useGlobalLoader from '@store/globalLoaderStore'
import useCurrentProject from '@hooks/useCurrentProject'
import FlexContainer from "@ui/FlexContainer"
import useSnackbar from "@hooks/useSnackbar"
import useAddDesign from "@hooks/react-query/projects/useAddDesign"


type Props = Omit<ModalProps, 'children'> & {
    page: Page,
    pageUrl: Url
}

function AddDesignModal({showModal, onRequestClose, page, pageUrl} : Props){
    const [globalLoader, setGlobalLoader] = useGlobalLoader()
    const {project} = useCurrentProject()

    const { mutateAsync: addDesign, error: errorAddDesign, isSuccess: addDesignIsSuccess } = useAddDesign()

    const { snackbar, showError } = useSnackbar()

    useEffect(() => {
        snackbar([
            {
                message: 'Design added successfully',
                severity: 'success',
                condition: addDesignIsSuccess
            },
            {
                message: errorAddDesign?.message ?? 'An error occurred while adding the design',
                severity: 'error',
                condition: !!errorAddDesign
            },
        ])
    }, [ addDesignIsSuccess, errorAddDesign])


    const onCreateDesignSubmit = async (data: FieldValues) => {
        if(page?.designs[data.name]){
            showError('Design with this name already exists.')
            return
        }

        setGlobalLoader({showLoader: true, text: 'Exporting frame from figma to create design...'})

        try {
            if(project){
                await addDesign({projectName: project.name, pageUrl: pageUrl, designDto: {name: data.name, designUrl: data.url}})
            }else{
                showError('Project not found. Please try again or reload current page.')
            }
        }catch (e){
            showError(`Design isn't added. Please try again. ${e}`)
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
                    <FlexContainer>
                        <input {...register('url', { required: true })} />
                        {errors.url && <p>Please enter url before saving.</p>}
                        <input {...register('name', { required: true })} />
                        {errors.name && <p>Please enter name before saving.</p>}
                        <button type="submit" >Submit</button>
                    </FlexContainer>
                </form>
            </div>
        </Modal>
    )
}

export default AddDesignModal
