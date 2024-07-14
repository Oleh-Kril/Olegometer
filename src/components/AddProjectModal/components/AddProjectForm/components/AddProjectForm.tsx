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
        }

        await createProject(newProject)
        onSuccess()
    }

    const snackbar = useSnackbar()

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
