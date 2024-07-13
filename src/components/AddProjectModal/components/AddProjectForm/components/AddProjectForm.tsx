import styles from '../styles/AddProjectForm.module.scss'
import {FieldValues, useForm} from 'react-hook-form'
import React from 'react'
import Agent from '../../../../../Agent'
import useProjectsEndpoint from '../../../../../hooks/useProjectsEndpoint'
import FlexContainer from "@ui/FlexContainer"
type Props = {

}
export default function AddProjectForm({}: Props){
    const makeRequestAndUpdateState = useProjectsEndpoint()

    const onCreateProjectSubmit = async (data: FieldValues) => {
        if((data.url as string).endsWith('/')){
            data.url = (data.url as string).slice(0, -1)
        }

        const project: Omit<Project, 'id'> = {
            author: '',
            name: data.name,
            domainUrl: data.url,
            figmaToken: data.figmaToken,
            pages: {}
        }

        await makeRequestAndUpdateState( () => Agent.post<Project>('/api/projects', project), 'POST')
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
        <form onSubmit={handleSubmit(onCreateProjectSubmit)}>
            <FlexContainer>
                <input {...register('url', { required: true })} />
                {errors.url && <p>Please enter base domain url of project website before saving.</p>}
                <input {...register('name', { required: true })} />
                {errors.name && <p>Please enter name of project before saving.</p>}
                <input {...register('figmaToken', { required: true })} />
                {errors.figmaToken && <p>Please enter figmaToken of account that has access to view your designs before saving.</p>}
                <button type="submit" >Submit</button>
            </FlexContainer>
        </form>

    )
}
