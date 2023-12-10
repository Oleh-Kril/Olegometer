// pages/screenshot.js
import React, { useEffect } from "react"
import axios from "axios"
import puppeteer from "puppeteer"

const ScreenshotComponent = ({ url="https://react.aidept.com.ua", width=1920} : {url: string, width: number}) => {
    useEffect(() => {
        const fileKey = 'EH0gHvwosCd7pVbE9NRWey'; // Replace with your Figma file key
        const personalAccessToken = 'figd_Y-DxXmFE8pxumKus5eq_5Py9ju_VpbwDZEQB19-g';
        const imageId = '4082-841'
        async function captureFigmaFrame() {
            try {
                // Make a request to the Figma API to render images
                const response = await axios.get(`https://api.figma.com/v1/images/${fileKey}?ids=${imageId}&scale=2&format=jpg`, {
                    headers: {
                        'X-FIGMA-TOKEN': personalAccessToken,
                    },
                });

                const { images } = response.data;

                const url = images[imageId.replace('-', ':')]

                axios({
                    url,
                    method: 'GET',
                    responseType: 'arraybuffer', // Specify 'arraybuffer' for binary data
                })
                    .then(response => {
                        // Convert the array buffer to a base64-encoded string
                        const base64Image = Buffer.from(response.data, 'binary').toString('base64');
                        console.log(base64Image);
                    })
                    .catch(error => {
                        console.error('Failed to download file:', error.message);
                    });
            } catch (error) {
                console.error('Error fetching Figma images:', error);
            }
        }

        captureFigmaFrame();

        const getWebPageScreenshot = async ()=> {
            const response =  await axios.get(`/api/make-screenshot?url=${url}&width=${width}`)
            const { base64 } =  response.data
            console.log(base64)
        }
        getWebPageScreenshot();
    }, [])

    return (
        <div>
            {/* Your component UI goes here */}
            <p>Loading competed</p>
        </div>
    )
}

export default ScreenshotComponent
