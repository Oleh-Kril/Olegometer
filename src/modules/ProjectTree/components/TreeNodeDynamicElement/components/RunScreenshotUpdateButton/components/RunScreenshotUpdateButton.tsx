import {RESET} from 'jotai/utils'
import {useUser} from '@hooks/useUser'
import useProjectsEndpoint from '@hooks/useProjectsEndpoint'
import useGlobalLoader from '@store/globalLoaderStore'
import useCurrentProject from '@hooks/useCurrentProject'
import RunButton from '@ui/RunButton'
import updateDesignSnapshot from '@requests/project/design/updateDesignSnapshot'
import updatePageSnapshot from '@requests/project/page/updatePageSnapshot'


type Props = {
    pageOnly?: boolean,
    designName: string
}

export default function RunScreenshotUpdateButton({pageOnly = false, designName}: Props){
    const makeRequestAndUpdateState = useProjectsEndpoint()
    const { user} = useUser()
    const [globalLoader, setGlobalLoader] = useGlobalLoader()
    const {project, page, pageUrl} = useCurrentProject(true)

    const isDoubleIcon = !pageOnly

    async function runScreenshotUpdate(){
        if(page && pageUrl){
            const design = page.designs[designName] as Design

            setGlobalLoader({showLoader: true, text: `Making new screenshot of the ${pageUrl} in ${design.width} width`})

            await makeRequestAndUpdateState(() => updatePageSnapshot(project, pageUrl, design, designName))

            setGlobalLoader(RESET)

            if(!pageOnly && design){
                setGlobalLoader({showLoader: true, text: `Exporting new snapshot of the ${pageUrl || ''} page design from figma`})

                await makeRequestAndUpdateState(() => updateDesignSnapshot(project, pageUrl, design, designName, user?.email || undefined))

                setGlobalLoader(RESET)
            }
        }
    }

    return (
        <RunButton
            isDoubleIcon={isDoubleIcon}
            onClick={runScreenshotUpdate}/>
    )
}
