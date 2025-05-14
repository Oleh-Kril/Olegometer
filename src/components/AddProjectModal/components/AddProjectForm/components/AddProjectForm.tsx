import {FieldValues, useForm} from 'react-hook-form'
import React, {useEffect} from 'react'
import FlexContainer from "@ui/FlexContainer"
import useCreateProject from "@hooks/react-query/projects/useCreateProject"
import useSnackbar from "@hooks/useSnackbar"

type Props = {
    onSuccess: () => void
}

export default function AddProjectForm({onSuccess}: Props){
    const { mutateAsync: createProject, error, isSuccess } = useCreateProject()

    const onCreateProjectSubmit = async (data: FieldValues) => {
        if((data.url as string).endsWith('/')){
            data.url = (data.url as string).slice(0, -1)
        }

        const newProject: CreateProjectDto = {
            name: data.name,
            domainUrl: data.url,
            figmaToken: data.figmaToken,
            users: data.authUserToken ? {user1: data.authUserToken} : undefined
        }

        await createProject(newProject)
        onSuccess()
    }

    const { snackbar }= useSnackbar()

    useEffect(() => {
        snackbar([
            {
                message: 'Project created successfully',
                severity: 'success',
                condition: isSuccess
            },
            {
                message: error?.message ?? 'An error occurred while creating the project',
                severity: 'error',
                condition: !!error
            },
        ])
    }, [ isSuccess, error])


    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm(
        {
            defaultValues: {
                name: 'Google project' + Math.random(),
                url: 'https://google.com',
                figmaToken: 'figd_uyjcLfydp8l7paMM_MXQNi7IqG4Th4eTLGV7O-4v',
                authUserLogin: 'test_user@gmail.com',
                authUserPassword: 'password123'
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
                <input {...register('authUserLogin', { required: false })} />
                <input {...register('authUserPassword', { required: false })} />
                <button type="submit" >Submit</button>
            </FlexContainer>
        </form>

    )
}
