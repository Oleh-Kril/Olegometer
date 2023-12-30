import Link from "next/link"
import {useUser} from "@auth0/nextjs-auth0/client"
import {useEffect} from "react"
import {useRouter} from "next/router"

export default function Home() {
    const { user, error, isLoading } = useUser()
    const router = useRouter()

    useEffect(() => {
        if (user) {
            router.push('/projects')
        }
    }, [user])

    return (
      <div style={{display: "flex", gap: "2rem"}}>
          <Link href='/api/auth/login'>Login</Link>
      </div>
    )
}
