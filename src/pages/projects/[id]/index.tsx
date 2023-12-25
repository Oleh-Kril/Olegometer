import useProjects from "../../../store/projectsStore"
import {useRouter} from "next/router"
import ProjectTree from "../../../modules/ProjectTree"

export default function ProjectPage(){
    const { projects } = useProjects()
    const router = useRouter()

    const project = projects.find(pj => pj.id === router.query.id)

    return (
        project ?
            <ProjectTree pages={project?.pages || []}/>
            :
            <p>Loading,,</p>
    )
}
