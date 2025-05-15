import {useState} from 'react'
import ProjectsList from '../../modules/ProjectsList'
import AddProjectModal from '../../components/AddProjectModal'
import FlexContainer from "@ui/FlexContainer"
import useLogout from '@/hooks/react-query/useLogout'

export default function Projects() {
    const [showModal, setShowModal] = useState(false)
    const logoutMutation = useLogout()

    const handleCreateProject = async () => {
        setShowModal(true)
    }

    const handleLogout = () => {
        logoutMutation.mutate()
    }

    return (
        <>
            <FlexContainer style={{width: '80vw'}}>
                <p>WELCOME TO OLEGOMETER</p>
                <button
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                    style={{
                        padding: '8px 15px',
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                >
                    {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
                </button>

                <h1>Projects Page</h1>

                <button onClick={handleCreateProject}>Create New Project</button>

                <ProjectsList style={{width: '100%'}}/>
            </FlexContainer>
            <AddProjectModal showModal={showModal} setShowModal={setShowModal}/>
        </>
    )
}

