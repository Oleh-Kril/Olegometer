import { withPageAuthRequired } from "@auth0/nextjs-auth0/client"
import {useState} from "react"
import {useUser} from "@auth0/nextjs-auth0/client"
import Agent from "../../Agent"
import ProjectsList from "../../modules/ProjectsList"
import Link from "next/link"
import AddProjectModal from "../../components/AddProjectModal"

export default withPageAuthRequired(function Projects() {
    const { user, error, isLoading } = useUser()
    const [showModal, setShowModal] = useState(false)
    if (isLoading) return <div>Loading...</div>
    if (error) return <div>{error.message}</div>

    const [createdProject, setCreatedProject] = useState<Project | null>(null)

    const handleCreateProject = async () => {
        setShowModal(true)
    }

    // const handleDeleteProject = async () => {
    //     if (createdProject) {
    //         try {
    //             await Agent.delete(`/api/projects/${createdProject.name}`);
    //             setCreatedProject(null);
    //         } catch (error) {
    //             console.error('Error deleting project:', error);
    //         }
    //     }
    // };


    return (
        <>
            <div style={{width: '80vw'}}>
                <p>WELCOME TO OLEGOMETER</p>
                <Link href='/api/auth/logout'>Logout</Link>

                <h1>Projects Page</h1>

                <button onClick={handleCreateProject}>Create New Project</button>

                <ProjectsList />
            </div>
            <AddProjectModal showModal={showModal} setShowModal={setShowModal}/>
        </>
    )
})

