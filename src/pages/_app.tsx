import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import Header from "../modules/Header"
import Footer from "../modules/Footer"
import ConfirmationModal from "../components/ConfirmationModal"
import Loader from "../components/Loader"
import Layout from "../modules/Layout"
import {Signika_Negative} from 'next/font/google'

const signikaFont = Signika_Negative({ subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  return (
      <main className={signikaFont.className}>
          <UserProvider>
              <Layout>
                  <Header/>
                  <Component {...pageProps} />
                  <Footer/>
              </Layout>
              <ConfirmationModal />
              <Loader />
          </UserProvider>
      </main>
  )
}
