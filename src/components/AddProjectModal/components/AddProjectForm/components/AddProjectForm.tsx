import styles from '../styles/AddProjectForm.module.scss'
import {FieldValues, useForm} from "react-hook-form"
import React from "react"
import Agent from "../../../../../Agent"
import useProjectsEndpoint from "../../../../../hooks/useProjectsEndpoint"
type Props = {

}
export default function AddProjectForm({}: Props){
    const makeRequestAndUpdateState = useProjectsEndpoint()

    const onCreateProjectSubmit = async (data: FieldValues) => {
        const project: Omit<Project, 'id'> = {
            author: '',
            name: data.name,
            domainUrl: data.url,
            figmaToken: data.figmaToken,
            pages: []
        }

        await makeRequestAndUpdateState( () => Agent.post<Project>('/api/projects', project), 'POST');
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm(
        {
            defaultValues: {
                name: 'Google project',
                url: 'https://google.com',
                figmaToken: 'secretFirmaToken'
            }
        }
    )

    return (
        <div className={styles.addProjectForm}>
            <form onSubmit={handleSubmit(onCreateProjectSubmit)}>
                <input {...register('url', { required: true })} />
                {errors.url && <p>Please enter base domain url of project website before saving.</p>}
                <input {...register('name', { required: true })} />
                {errors.name && <p>Please enter name of project before saving.</p>}
                <input {...register('figmaToken', { required: true })} />
                {errors.figmaToken && <p>Please enter figmaToken of account that has access to view your designs before saving.</p>}
                <input type="submit" />
            </form>
        </div>
    )
}
