import {RESET} from 'jotai/utils'
import useGlobalLoader from '@store/globalLoaderStore'
import useCurrentProject from '@hooks/useCurrentProject'
import RunButton from '@ui/RunButton'
import {Tooltip} from 'react-tooltip'
import useSnackbar from "@hooks/useSnackbar"
import useUpdateAllScreenshots from "@hooks/react-query/projects/useUpdateAllScreenshots"
import {useEffect} from "react"

type Props = {
    updateDesigns?: boolean,
}

export default function RunUpdateAllButton({updateDesigns = false}: Props){
    const [globalLoader, setGlobalLoader] = useGlobalLoader()
    const {project} = useCurrentProject()

    const isDoubleIcon = updateDesigns

    const { mutateAsync: updateAllScreenshots, error: errorUpdateAllScreenshots, isSuccess: updateAllScreenshotsIsSucess } = useUpdateAllScreenshots()

    const { snackbar, showError } = useSnackbar()

    useEffect(() => {
        snackbar([
            {
                message: 'All screenshots updated successfully',
                severity: 'success',
                condition: updateAllScreenshotsIsSucess
            },
            {
                message: errorUpdateAllScreenshots?.message ?? 'An error occurred while updating screenshots',
                severity: 'error',
                condition: !!errorUpdateAllScreenshots
            },
        ])
    }, [ updateAllScreenshotsIsSucess, errorUpdateAllScreenshots])


    async function runScreenshotUpdate(){
        if(project){
            setGlobalLoader({
                showLoader: true,
                text: updateDesigns
                    ? 'Making new snapshots of all pages and exporting all design'
                    : 'Making new snapshots of all pages'
            })

            await updateAllScreenshots({projectName: project?.name || '', exportDesigns: updateDesigns})

            setGlobalLoader(RESET)
        }else{
            showError('Project data is missing. Please try again or reload current page.')
        }
    }

    return (
        <>
            <RunButton
                id={`update-all-button-designs-${updateDesigns}`}
                isDoubleIcon={isDoubleIcon}
                onClick={runScreenshotUpdate}/>
            <Tooltip anchorSelect={`#update-all-button-designs-${updateDesigns}`} place="top" delayShow={1000}>
                {updateDesigns ? 'Update all pages + design' : 'Update all pages'}
            </Tooltip>
        </>
    )
}
