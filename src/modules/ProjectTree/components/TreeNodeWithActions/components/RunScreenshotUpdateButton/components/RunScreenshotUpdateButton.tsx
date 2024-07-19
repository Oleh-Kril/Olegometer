import styles from '../styles/RunScreenshotUpdateButton.module.scss'
import {RESET} from 'jotai/utils'
import useGlobalLoader from '@store/globalLoaderStore'
import useCurrentProject from '@hooks/useCurrentProject'
import RunButton from '@ui/RunButton'
import useSnackbar from "@hooks/useSnackbar"
import useMakePageScreenshot from "@hooks/react-query/projects/useMakePageScreenshot"
import {useEffect} from "react"
import useExportDesign from "@hooks/react-query/projects/useExportDesign"


type Props = {
    pageOnly?: boolean,
    designName: string
}

export default function RunScreenshotUpdateButton({pageOnly = false, designName}: Props){
    const [globalLoader, setGlobalLoader] = useGlobalLoader()
    const {project, page, pageUrl} = useCurrentProject(true)

    const isDoubleIcon = !pageOnly

    const { mutateAsync: makePageScreenshot, error: errorMakePageScreenshot, isSuccess: makePageScreenshotIsSuccess } = useMakePageScreenshot()
    const { mutateAsync: exportDesign, error: errorExportDesign, isSuccess: exportDesignIsSuccess } = useExportDesign()

    const { snackbar, showError } = useSnackbar()

    snackbar([
        {
            message: 'Snapshot of website updated successfully',
            severity: 'success',
            condition: makePageScreenshotIsSuccess
        },
        {
            message: errorMakePageScreenshot?.message ?? 'An error occurred while updating snapshot of website',
            severity: 'error',
            condition: !!errorMakePageScreenshot
        },
        {
            message: 'Snapshot of design updated successfully',
            severity: 'success',
            condition: exportDesignIsSuccess
        },
        {
            message: errorExportDesign?.message ?? 'An error occurred while updating snapshot of design',
            severity: 'error',
            condition: !!errorExportDesign
        },
    ])

    async function runScreenshotUpdate(){
        if(page && pageUrl && project){
            const design = page.designs[designName] as Design

            if(!pageOnly && design){
                setGlobalLoader({showLoader: true, text: `Exporting new snapshot of the ${pageUrl || ''} page design from figma`})

                await exportDesign({projectName: project.name, pageUrl, designName})

                setGlobalLoader(RESET)
            }

            setGlobalLoader({showLoader: true, text: `Making new screenshot of the ${pageUrl} in ${design.width} width`})

            await makePageScreenshot({projectName: project.name, pageUrl, designName})

            setGlobalLoader(RESET)
        }else{
            showError("Can't find needed data. Please try again or reload current page.")
        }
    }

    useEffect(() => {
        if(errorMakePageScreenshot){
            setGlobalLoader(RESET)
        }
    }, [errorMakePageScreenshot])
    return (
        <RunButton className={styles.runScreenshotUpdateButton}
            isDoubleIcon={isDoubleIcon}
            onClick={runScreenshotUpdate}/>
    )
}
