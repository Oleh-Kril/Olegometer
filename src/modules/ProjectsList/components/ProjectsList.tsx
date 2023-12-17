import ProjectCard from "./ProjectCard"
import styles from '../styles/ProjectsList.module.scss'
import useProjects from "../../../store/projectsStore"

export default function ProjectsList(){
    const projectsList = useProjects()

    return (
        <div className={styles.projectsList}>
            {projectsList.map((project) => <ProjectCard key={project.id} {...project}/>)}
        </div>
    )
}
