import Link from 'next/link'
import {useEffect} from 'react'
import {useRouter} from 'next/router'
import Intro from '../modules/Intro'

export default function Home() {
    const router = useRouter()

    // useEffect(() => {
    //     router.push('/projects')
    // }, [])

    return (
        <div style={{height: '300vh'}}>
            <Intro />
            <div style={{position: 'absolute', top: '55%', left: '50%', color: '#FA4441', fontWeight: 'bold', fontSize: '20px'}}>
                <Link href='/projects'>Login</Link>
            </div>
        </div>
    )
}
