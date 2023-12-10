// pages/screenshot.js
import React, { useEffect } from "react"
import axios from "axios"
import uploadImageToS3 from "../requests/S3/uploadImageToS3"

const ScreenshotComponent = ({ url="https://react.aidept.com.ua", width=1920} : {url: string, width: number}) => {
    useEffect(() => {
        const exportFigmaFrame = async ()=> {
            await axios.get(`/api/export-figma-frame`)
        }

        exportFigmaFrame()

        const getWebPageScreenshot = async ()=> {
            const response =  await axios.get(`/api/make-screenshot?url=${url}&width=${width}`)
            const { base64 } =  response.data
            console.log(base64)
        }
        // getWebPageScreenshot();
    }, [])

    return (
        <div>
            {/* Your component UI goes here */}
            <p>Loading competed</p>
        </div>
    )
}

export default ScreenshotComponent
