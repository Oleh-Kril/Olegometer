import ProjectCard from './ProjectCard'
import styles from '../styles/ProjectsList.module.scss'
import useProjects from '../../../store/projectsStore'
import {useEffect} from 'react'

export default function ProjectsList(){
    const { projects } = useProjects()

    return (
        <div className={styles.projectsList}>
            {projects.map((project) => <ProjectCard key={project.id} {...project}/>)}
        </div>
    )
}
