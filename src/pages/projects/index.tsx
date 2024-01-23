import {useState} from 'react'
import ProjectsList from '../../modules/ProjectsList'
import Link from 'next/link'
import AddProjectModal from '../../components/AddProjectModal'

export default function Projects() {
    const [showModal, setShowModal] = useState(false)
    // if (isLoading) return <div>Loading...</div>
    // if (error) return <div>{error.message}</div>

    const handleCreateProject = async () => {
        setShowModal(true)
    }

    return (
        <>
            <div style={{width: '80vw'}}>
                <p>WELCOME TO OLEGOMETER</p>
                <Link href='/'>Logout</Link>

                <h1>Projects Page</h1>

                <button onClick={handleCreateProject}>Create New Project</button>

                <ProjectsList />
            </div>
            <AddProjectModal showModal={showModal} setShowModal={setShowModal}/>
        </>
    )
}

