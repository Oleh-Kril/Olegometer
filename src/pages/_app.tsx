import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {useState} from "react"

import Header from '../modules/Header'
import Footer from '../modules/Footer'
import ConfirmationModal from '../components/ConfirmationModal'
import Loader from '../components/Loader'
import Layout from '../modules/Layout'
import {Signika_Negative} from 'next/font/google'
import {SpeedInsights} from '@vercel/speed-insights/next'
import {Analytics} from '@vercel/analytics/react'

const signikaFont = Signika_Negative({ subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
    const [queryClient] = useState(() => new QueryClient())

    return (
        <QueryClientProvider client={queryClient}>
            <main className={signikaFont.className}>
                <Header/>
                <Layout>
                    <Component {...pageProps} />
                    <Footer/>
                </Layout>
                <ConfirmationModal />
                <Loader />
                <SpeedInsights />
                <Analytics />
            </main>
        </QueryClientProvider>
    )
}
