import Link from "next/link"
import {useUser} from "@auth0/nextjs-auth0/client"
import {useEffect} from "react"
import {useRouter} from "next/router"
import Intro from "../modules/Intro"

export default function Home() {
    const { user, error, isLoading } = useUser()
    const router = useRouter()

    useEffect(() => {
        if (user) {
            router.push('/projects')
        }
    }, [user])

    return (
        <div style={{height: '300vh'}}>
            <Intro />
            <div style={{position: "absolute", top: "55%", left: '50%', color: "#FA4441", fontWeight: "bold", fontSize: "20px"}}>
                <Link href='/api/auth/login'>Login</Link>
            </div>
        </div>
    )
}
