import React from "react"
import Modal from "../../../../../ui/Modal"
import {ModalProps} from "../../../../../ui/Modal"
import {FieldValues, useForm} from "react-hook-form"
import styles from '../styles/AddPageModal.module.scss'
import {useRouter} from "next/router"
import useProjects from "../../../../../store/projectsStore"
import addDesign from "../requests/addDesign"
import {useUser} from "@auth0/nextjs-auth0/client"

type Props = Omit<ModalProps, 'children'> & {
    page: Page
}

function AddDesignModal({showModal, onRequestClose, page} : Props){
    const {projects, setProjects} = useProjects()
    const router = useRouter()
    const { user, error, isLoading } = useUser()

    const onCreatePageSubmit = async (data: FieldValues) => {
        const projectId = router.query.id as string

        const updatedProject = await addDesign(projectId, page.url, data.url, data.name, user?.email ?? undefined)

        if(updatedProject){
            const newProjectsList = projects.map((project) => project.id === projectId ? updatedProject : project) as Project[]

            setProjects(newProjectsList)
        }
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
                <form onSubmit={handleSubmit(onCreatePageSubmit)}>
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
