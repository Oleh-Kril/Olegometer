import { withPageAuthRequired } from "@auth0/nextjs-auth0/client"
import {useState} from "react"
import {useUser} from "@auth0/nextjs-auth0/client"
import Agent from "../../Agent"
import ProjectsList from "../../modules/ProjectsList"

const testProject: Project = {
    name: "Olegometer 2",
    author: "",
    domainUrl: "https://my-website.com",
    figmaToken: "your-figma-token",
    pages: [
        {
            url: "/home",
            designs: [
                {
                    width: 1920,
                    designUrl: "https://figma.com/design1",
                    snapshotUrl: "https://s3.com/snapshot1",
                    name: "Home DesignModel",
                },
            ],
        },
    ],
}

export default withPageAuthRequired(function Projects() {
    const { user, error, isLoading } = useUser()

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>{error.message}</div>

    const [createdProject, setCreatedProject] = useState<Project | null>(null)

    const handleCreateProject = async () => {
        try {
            const createdProject = await Agent.post<Project>('/api/projects', testProject);
            setCreatedProject(createdProject)
        } catch (error) {
            console.error("Error creating project:", error)
        }
    }

    const handleDeleteProject = async () => {
        if (createdProject) {
            try {
                await Agent.delete(`/api/projects/${createdProject.name}`);
                setCreatedProject(null);
            } catch (error) {
                console.error('Error deleting project:', error);
            }
        }
    };


    return (
        <div>
            <p>WELCOME TO OLEGOMETER</p>
            <a href='/api/auth/logout'>Logout</a>

            <h1>Projects Page</h1>

            <button onClick={handleCreateProject}>Create Test Project</button>

            <button onClick={handleDeleteProject}>Delete Project</button>

            {createdProject && (
                <div>
                    <h2>Created Project</h2>
                    <pre>{JSON.stringify(createdProject, null, 2)}</pre>
                </div>
            )}
            <ProjectsList />
        </div>
    )
})

