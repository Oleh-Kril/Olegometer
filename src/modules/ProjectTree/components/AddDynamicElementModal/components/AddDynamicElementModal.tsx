import React from 'react'
import {FieldValues, useForm} from 'react-hook-form'
import styles from '../styles/AddDynamicElementModal.module.scss'
import addDynamicElement from '../requests/addDynamicElement'
import {useUser} from '@hooks/useUser'

import {RESET} from 'jotai/utils'
import Modal, {ModalProps} from '@ui/Modal'
import useGlobalLoader from '@store/globalLoaderStore'
import useProjectsEndpoint from '@hooks/useProjectsEndpoint'
import useCurrentProject from '@hooks/useCurrentProject'
import FlexContainer from "@ui/FlexContainer"

type Props = Omit<ModalProps, 'children'> & {
    design: Design,
    designName: string,
}

function AddDynamicElementModal({showModal, onRequestClose, design, designName} : Props){
    const { user, error, isLoading } = useUser()
    const [globalLoader, setGlobalLoader] = useGlobalLoader()
    const makeRequestAndUpdateState = useProjectsEndpoint()
    const {project, pageUrl} = useCurrentProject(true)

    const onCreateDynamicElementSubmit = async (data: FieldValues) => {
        if(design?.dynamicElements[data.name]){
            window.alert('Dynamic element with this name already exists.')
            return
        }

        setGlobalLoader({showLoader: true, text: 'Exporting frame from figma to create dynamic element...'})

        const dynamicElement: DynamicElement = {
            designUrl: data.url,
            // @ts-ignore
            elementToCapture: {
                [data.actionElementSelector]: data.actionElementSelectorValue
            },
            actions: [
                {
                    type: data.actionType,
                    // @ts-ignore
                    element: {
                        [data.actionElementSelector]: data.actionElementSelectorValue
                    }
                }
            ]
        }

        try {
            await makeRequestAndUpdateState(() => addDynamicElement(
                project,
                pageUrl as string,
                designName,
                data.name,
                dynamicElement,
                user?.email ?? undefined))
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
            name: 'modal',
            url: 'https://www.figma.com/file/EH0gHvwosCd7pVbE9NRWey/site.pt2?type=design&node-id=4013-765&mode=design&t=pnV04DI3vl2XIrM5-0',
            elementToSnapshotSelector: 'class' as Selector,
            elementToSnapshotSelectorValue: 'loginModal',
            actionType: 'click',
            actionElementSelector: 'class' as Selector,
            actionElementSelectorValue: 'loginBtn'
        }
    })

    return (
        <Modal showModal={showModal} onRequestClose={onRequestClose}>
            <FlexContainer>
                <form onSubmit={handleSubmit(onCreateDynamicElementSubmit)}>
                    <input {...register('url', { required: true })} />
                    {errors.url && <p>Please enter url before saving.</p>}
                    <input {...register('name', { required: true })} />
                    {errors.name && <p>Please enter name before saving.</p>}
                    <p>Actions</p>
                    <input {...register('actionType', { required: true })} />
                    {errors.actionType && <p>Please choose action type for element to snapshot before saving.</p>}
                    <input {...register('actionElementSelector', { required: true })} />
                    {errors.actionElementSelector && <p>Please enter selector type for action element before saving.</p>}
                    <input {...register('actionElementSelectorValue', { required: true })} />
                    {errors.actionElementSelectorValue && <p>Please enter selector value for action element before saving.</p>}
                    <p>Element to snapshot</p>
                    <input {...register('elementToSnapshotSelector', { required: true })} />
                    {errors.elementToSnapshotSelector && <p>Please enter selector type for element to snapshot before saving.</p>}
                    <input {...register('elementToSnapshotSelectorValue', { required: true })} />
                    {errors.elementToSnapshotSelectorValue && <p>Please enter selector value for element to snapshot before saving.</p>}
                    <button type="submit" >Submit</button>
                </form>
            </FlexContainer>
        </Modal>
    )
}

export default AddDynamicElementModal
