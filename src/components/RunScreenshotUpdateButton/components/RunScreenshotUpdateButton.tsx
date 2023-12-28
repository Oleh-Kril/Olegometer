import RunButton from "../../../ui/RunButton";
import styles from '../styles/RunScreenshotUpdateButton.module.scss'
import useProjects from "../../../store/projectsStore";
import {useRouter} from "next/router";
import Agent from "../../../Agent";
import useProjectsEndpoint from "../../../hooks/useProjectsEndpoint"
import useGlobalLoader from "../../../store/globalLoaderStore"
import {RESET} from "jotai/utils"

type Props = {
    pageOnly?: boolean,
    pageUrl: string,
    designName: string
}

export default function RunScreenshotUpdateButton({pageOnly = false, pageUrl, designName}: Props){
    const {projects, setProjects} = useProjects()
    const isDoubleIcon = !pageOnly
    const router = useRouter()
    const makeRequestAndUpdateState = useProjectsEndpoint()
    const [globalLoader, setGlobalLoader] = useGlobalLoader()

    async function runScreenshotUpdate(){
        const projectId = router.query.id as string
        const project = projects.find(project => project.id === projectId) as Project
        const page = project.pages.find(page => page.url === pageUrl) as Page
        const design = page.designs.find(design => design.name === designName) as Design

        setGlobalLoader({showLoader: true, text: `Making new screenshot of the ${page} in ${design.width} width`})

        await makeRequestAndUpdateState(() =>
            Agent.post(`/api/projects/${projectId}/pages/make-screenshot?url=${pageUrl}`,
                {design, projectDomainUrl: project.domainUrl,})
        )

        setGlobalLoader(RESET)
    }

    return (
        <RunButton className={styles.runScreenshotUpdateButton}
                   isDoubleIcon={isDoubleIcon}
                   onClick={runScreenshotUpdate}/>
    )
}
