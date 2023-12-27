// pages/screenshot.js
import React, {useEffect, useState} from "react"
import axios from "axios"
import uploadImageToS3 from "../requests/S3/uploadImageToS3"
import Agent from "../Agent"
import getImageFromS3 from "../requests/S3/getImageFromS3"
import {GetStaticProps} from "next"
import useProjects from "../store/projectsStore";

const ScreenshotComponent = ({ url="https://streetcode.com.ua/catalog", width=1920} : {url?: string, width?: number}) => {
    const [image, setImage] = useState(null)

    useEffect(() => {
        // Agent.get(`/api/export-figma-frame`)

        const getWebPageScreenshot = async ()=> {
            const { base64 } =  await Agent.get(`/api/make-screenshot?url=${url}&width=${width}`)
            setImage(base64)
        }

        getWebPageScreenshot();

        const getS3Image = async ()=> {
            const base64 =  await Agent.get('/api/get-s3-image') as string

            setImage(base64)
        }

        // getS3Image()
    }, [])

    return (
        <div>
            {image ? <img src={'data:image/jpeg;base64,' + image}
                          alt='screenshot'/> : <p>Loading...</p>}

        </div>
    )
}
export default ScreenshotComponent
