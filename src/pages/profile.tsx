import { useUser } from '@auth0/nextjs-auth0/client'
import Agent from "@/Agent"

export default function ProfileClient() {
    const { user, error, isLoading } = useUser()

    function onGetProjects(){
        const token = localStorage.getItem("token")
        Agent.get('http://localhost:5000/projects/some-id', {token}).then((res) => {
            console.log("RESPONSE", res)
        })
    }

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>{error.message}</div>

    return (
        user && (
            <div>
                <img src={user.picture as string} alt={user.name as string} />
                <h2>{user.name}</h2>
                <p>{user.email}</p>
                <button onClick={onGetProjects}>Get Projects</button>
            </div>
        )
    )
}
