import useProjects from "../../../store/projectsStore"
import {useRouter} from "next/router"
import {useEffect, useState} from "react"
import ProjectTree from "../../../modules/ProjectTree"

export default function ProjectPage(){
    const [project, setProject] = useState<Project>()
    const projectsList = useProjects()
    const router = useRouter()

    useEffect(() => {
        const id = router.query.id as string
        const projectFromList = projectsList.find(pj => pj.id === id)

        if(projectFromList) {
            setProject(projectFromList)
        }
    }, [projectsList])

    return (
        project
            ?
            <ProjectTree pages={project.pages}/>
            :
            <p>Loading</p>
    )
}
