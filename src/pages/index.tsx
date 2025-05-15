import Link from 'next/link'
import {useState, useEffect} from 'react'
import {useRouter} from 'next/router'
import Intro from '../modules/Intro'
import useLogin from '@/hooks/react-query/useLogin'

export default function Home() {
    const router = useRouter()
    const [username, setUsername] = useState('olegometer-user')
    const [password, setPassword] = useState('')
    const loginMutation = useLogin()

    const handleLogin = () => {
        loginMutation.mutate({username, password})
    }

    return (
        <div style={{height: '300vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <Intro />
            <div style={{
                position: 'absolute',
                top: '65%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: '#FA4441',
                fontWeight: 'bold',
                fontSize: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                padding: '20px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                backgroundColor: 'white',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    style={{padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ddd'}}
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    style={{padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ddd'}}
                />
                <button
                    onClick={handleLogin}
                    disabled={loginMutation.isPending}
                    style={{
                        padding: '10px 20px',
                        fontSize: '18px',
                        color: 'white',
                        backgroundColor: '#FA4441',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    {loginMutation.isPending ? 'Logging in...' : 'Login'}
                </button>
            </div>
        </div>
    )
}
