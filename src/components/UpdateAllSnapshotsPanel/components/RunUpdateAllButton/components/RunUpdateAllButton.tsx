import {RESET} from 'jotai/utils'
import updateAllSnapshots from '../requests/updateAllSnapshots'
import {useUser} from '@auth0/nextjs-auth0/client'
import useProjectsEndpoint from '@hooks/useProjectsEndpoint'
import useGlobalLoader from '@store/globalLoaderStore'
import useCurrentProject from '@hooks/useCurrentProject'
import RunButton from '@ui/RunButton'
import {Tooltip} from "react-tooltip"


type Props = {
    updateDesigns?: boolean,
}

export default function RunUpdateAllButton({updateDesigns = false}: Props){
    const makeRequestAndUpdateState = useProjectsEndpoint()
    const { user} = useUser()
    const [globalLoader, setGlobalLoader] = useGlobalLoader()
    const {project} = useCurrentProject()

    const isDoubleIcon = updateDesigns

    async function runScreenshotUpdate(){
        setGlobalLoader({
            showLoader: true,
            text: updateDesigns
                ? 'Making new snapshots of all pages and making new snapshots of all pages'
                : 'Making new snapshots of all pages'
        })

        await makeRequestAndUpdateState(() => updateAllSnapshots(project, user?.email || undefined, updateDesigns))

        setGlobalLoader(RESET)
    }

    return (
        <>
            <RunButton
                id={`update-all-button-designs-${updateDesigns}`}
                isDoubleIcon={isDoubleIcon}
                onClick={runScreenshotUpdate}/>
            <Tooltip anchorSelect={`#update-all-button-designs-${updateDesigns}`} place="top" delayShow={1000}>
                {updateDesigns ? 'Update all pages + designs' : 'Update all pages'}
            </Tooltip>
        </>
    )
}
