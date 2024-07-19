'use client'
import styles from '../styles/Images.module.scss'
import React from 'react'

import ModeProps from '@modules/ImageComparison/types/modeProps.type'
import dynamic from "next/dynamic"
const BoundingBoxCanvas = dynamic(() => import("@modules/ImageComparison/components/Images/components/BoundingBoxCanvas"), {
    ssr: false,
})


export default function Images({
    image1,
    image2,
    image1LastUpdated,
    image2LastUpdated,
    comparisonResult,
    showComparisonResult,
    comparisonMode
}: ModeProps) {
    const designBoundingBoxes = [] as any[]
    const websiteBoundingBoxes = [] as any[]

    const parseBoundingBox = (bboxString: string) => {
        const coords = bboxString.split('-')[0].match(/\d+/g)
        if(!coords) return undefined
        return {
            x: parseInt(coords[1], 10),
            y: parseInt(coords[0], 10),
            width: parseInt(coords[3], 10) - parseInt(coords[1], 10),
            height: parseInt(coords[2], 10) - parseInt(coords[0], 10),
        }
    }

    if (comparisonResult && showComparisonResult) {
        for (const [key, values] of Object.entries(comparisonResult.insights)) {
            const bbox = parseBoundingBox(key)
            if (!bbox) continue
            values.forEach((value: any) => {
                const boundingBox = {
                    ...bbox,
                    type: value.type,
                    message: value.message,
                }
                if (key.includes('-design')) {
                    designBoundingBoxes.push(boundingBox)
                } else if (key.includes('-website')) {
                    websiteBoundingBoxes.push(boundingBox)
                }
            })
        }
    }

    const [isFirstVisible, setIsFirstVisible] = React.useState<boolean>(true)

    const toggleIsFirstVisible = () => setIsFirstVisible(prevState => !prevState)

    return (
        <div className={styles.container}>
            <div className={`${comparisonMode === "overlay" ? styles.overlayMode : styles.sideBySideMode} 
                             ${isFirstVisible ? styles.active : styles.hidden}`}
                 onClick={comparisonMode === "overlay" ? toggleIsFirstVisible : undefined}>
                <h3>Design snapshot</h3>
                {image1LastUpdated ? <p>Last updated: {image1LastUpdated}</p> : null}
                {image1LastUpdated ? (
                    image1 ? (
                        <BoundingBoxCanvas
                            imageUrl={image1}
                            boundingBoxes={designBoundingBoxes}/>
                    ) : (
                        <p>Loading...</p>
                    )
                ) : (
                    <p>No website snapshot</p>
                )}
            </div>
            <div className={`${comparisonMode === "overlay" ? styles.overlayMode : styles.sideBySideMode} 
                             ${isFirstVisible && comparisonMode === "overlay" ? styles.hidden : styles.active}`}
                 onClick={comparisonMode === "overlay" ? toggleIsFirstVisible : undefined}>
                <h3>Website snapshot</h3>
                {image2LastUpdated ? <p>Last updated: {image2LastUpdated}</p> : null}
                {image2LastUpdated ? (
                    image2 ? (
                        <BoundingBoxCanvas
                            imageUrl={image2}
                            boundingBoxes={websiteBoundingBoxes} />
                    ) : (
                        <p>Loading...</p>
                    )
                ) : (
                    <p>No website snapshot</p>
                )}
            </div>
        </div>
    )
}
