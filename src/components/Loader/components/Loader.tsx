'use client'

import React, {useEffect, useState} from 'react'
import styles from '../styles/Loader.module.scss'
import {createPortal} from 'react-dom'
import useGlobalLoader from '../../../store/globalLoaderStore'
import Image from 'next/image'

const NUM_IMAGES = 10
const INITIAL_OPACITY = 0.4
const FINAL_OPACITY = 1
const INTERVAL_DURATION_MS = 700

interface ImageWithOpacity {
    opacity: number;
    key: number;
}

function Loader(){
    const [mounted, setMounted] = useState(false)
    const [globalLoader, _] = useGlobalLoader()
    const [images, setImages] = useState<ImageWithOpacity[]>(getDefaultImages())
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        setMounted(true)

        let timerId: NodeJS.Timeout
        timerId = setInterval(() => {
            setProgress((prev) => prev + 1)
        }, INTERVAL_DURATION_MS)

        return () => clearInterval(timerId)
    }, [])

    useEffect(() => {
        if(progress < NUM_IMAGES) {
            setImages((prevImages) => {
                const newImages = [...prevImages]
                newImages[progress].opacity = FINAL_OPACITY
                return newImages
            })
        }else{
            setImages(getDefaultImages())
            setProgress(0)
        }
    }, [progress])


    function getDefaultImages(): ImageWithOpacity[]{
        return Array.from({ length: NUM_IMAGES }, (_, index) => ({ opacity: INITIAL_OPACITY, key: index }))
    }

    return mounted ? createPortal((
        <div className={`${styles.loader} ${globalLoader.showLoader ? '' : styles.hidden}`}>
            <div className={styles.imgContainer}>
                {images.map((image) => (
                    <Image
                        width={500}
                        height={500}
                        key={image.key}
                        src="/characters/dude-waiting.webp"
                        alt="dude-waiting"
                        style={{ opacity: image.opacity }}
                    />
                ))}
            </div>

            <p>{globalLoader.text}</p>
        </div>
    ),
    document.getElementById('loader-root') || document.body
    ): null
}

export default Loader
