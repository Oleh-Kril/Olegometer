import { Html, Head, Main, NextScript } from 'next/document'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from '@vercel/analytics/react'

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <title>Olegometer</title>
                <link rel="shortcut icon" href="/logo.jpg" />
            </Head>
            <body>
                <Main />
                <div id="modal-root"></div>
                <div id="loader-root"></div>
                <NextScript />
                <SpeedInsights />
                <Analytics />
            </body>
        </Html>
    )
}
