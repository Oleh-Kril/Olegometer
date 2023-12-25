import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import Header from "../modules/Header"
import Footer from "../modules/Footer"
import ConfirmationModal from "../components/ConfirmationModal"


export default function App({ Component, pageProps }: AppProps) {
  return (
      <UserProvider>
          <Header/>
          <Component {...pageProps} />
          <Footer/>
          <ConfirmationModal />
      </UserProvider>
  )
}
