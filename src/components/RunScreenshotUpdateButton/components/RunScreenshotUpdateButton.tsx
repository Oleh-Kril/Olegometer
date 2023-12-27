import RunButton from "../../../ui/RunButton";
import styles from '../styles/RunScreenshotUpdateButton.module.scss'
import useProjects from "../../../store/projectsStore";
import {useRouter} from "next/router";
import Agent from "../../../Agent";

type Props = {
    pageOnly?: boolean,
    pageUrl: string,
    designName: string
}

export default function RunScreenshotUpdateButton({pageOnly = false, pageUrl, designName}: Props){
    const {projects, setProjects} = useProjects()
    const isDoubleIcon = !pageOnly
    const router = useRouter()

    async function runScreenshotUpdate(){
        const projectId = router.query.id as string
        const project = projects.find(project => project.id === projectId) as Project
        const page = project.pages.find(page => page.url === pageUrl) as Page
        const design = page.designs.find(design => design.name === designName) as Design

        const updatedProject = await Agent.post(`/api/projects/${projectId}/pages/make-screenshot?url=${pageUrl}`, {
            design,
            projectDomainUrl: project.domainUrl,
        })

        const newProjectsList = projects.map((project) => project.id === projectId ? updatedProject : project) as Project[]

        setProjects(newProjectsList)
    }

    return (
        <RunButton className={styles.runScreenshotUpdateButton}
                   isDoubleIcon={isDoubleIcon}
                   onClick={runScreenshotUpdate}/>
    )
}
