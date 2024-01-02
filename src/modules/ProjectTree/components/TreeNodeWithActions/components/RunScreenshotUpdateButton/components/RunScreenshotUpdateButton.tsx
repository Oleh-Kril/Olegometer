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
    const {project, page} = useCurrentProject(true)

    const isDoubleIcon = !pageOnly

    async function runScreenshotUpdate(){
        if(page){
            const design = page.designs.find(design => design.name === designName) as Design

            setGlobalLoader({showLoader: true, text: `Making new screenshot of the ${page.url} in ${design.width} width`})

            await makeRequestAndUpdateState(() =>
                Agent.post(`/api/projects/${project.id}/pages/make-screenshot?url=${page.url}`,
                    {design, projectDomainUrl: project.domainUrl,})
            )

            setGlobalLoader(RESET)

            if(!pageOnly && design){
                setGlobalLoader({showLoader: true, text: `Exporting new snapshot of the ${page?.url || ''} page design from figma`})

                await makeRequestAndUpdateState(() => updateDesign(project, page?.url, design, designName, user?.email || undefined))

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
