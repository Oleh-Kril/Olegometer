import ProjectCard from './ProjectCard'
import styles from '../styles/ProjectsList.module.scss'
import useProjects from '../../../store/projectsStore'

export default function ProjectsList(props: any){
    const { projects, error, isLoading } = useProjects()

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error loading projects</div>

    return (
        <div className={styles.projectsList} {...props}>
            {projects?.map((project) => <ProjectCard key={project.id} {...project}/>)}
        </div>
    )
}
