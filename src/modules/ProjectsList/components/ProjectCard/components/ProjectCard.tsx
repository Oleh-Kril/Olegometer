import styles from '../styles/ProjectCard.module.scss'
import {useRouter} from "next/router"

export default function ProjectCard({name, domainUrl, id}: Project){
    const router = useRouter()

    function openProjectPage(){
        router.push('/projects/' + id)
    }

    return (
        <div className={styles.projectCard} onClick={openProjectPage}>
            <h3>{name}</h3>
            <p>{domainUrl}</p>
        </div>
    )
}
