import styles from '../styles/RunScreenshotUpdateButton.module.scss'
import {RESET} from 'jotai/utils'
import updateDesign from '../requests/updateDesign'
import {useUser} from '@auth0/nextjs-auth0/client'
import useProjectsEndpoint from '@hooks/useProjectsEndpoint'
import useGlobalLoader from '@store/globalLoaderStore'
import useCurrentProject from '@hooks/useCurrentProject'
import Agent from '@/Agent'
import RunButton from '@ui/RunButton'


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

            await makeRequestAndUpdateState(() =>
                Agent.post(`/api/projects/${project.id}/pages/make-screenshot?url=${pageUrl}`,
                    {design, projectDomainUrl: project.domainUrl, designName})
            )

            setGlobalLoader(RESET)

            if(!pageOnly && design){
                setGlobalLoader({showLoader: true, text: `Exporting new snapshot of the ${pageUrl || ''} page design from figma`})

                await makeRequestAndUpdateState(() => updateDesign(project, pageUrl, design, designName, user?.email || undefined))

                setGlobalLoader(RESET)
            }
        }
    }

    return (
        <RunButton className={styles.runScreenshotUpdateButton}
            isDoubleIcon={isDoubleIcon}
            onClick={runScreenshotUpdate}/>
    )
}
