import styles from '../styles/SideBySideMode.module.scss'
import React from "react"
import ModeProps from "@modules/ImageComparison/types/modeProps.type"

export default function SideBySideMode({image1, image2, image1LastUpdated, image2LastUpdated}: ModeProps){
    return (
        <div className={styles.sideBySideMode}>
            <div>
                <h3>Design snapshot</h3>
                {image1LastUpdated ? <p>Last updated: {image1LastUpdated}</p> : null}
                {image1LastUpdated
                    ? image1
                        ? <img src={image1} alt="screenshot"/>
                        : <p>Loading...</p>
                    : <p>No website snapshot</p>}
            </div>
            <div>
                <h3>Website snapshot</h3>
                {image2LastUpdated ? <p>Last updated: {image2LastUpdated}</p> : null}
                {image2LastUpdated
                    ? image2
                        ? <img src={image2} alt="screenshot"/>
                        : <p>Loading...</p>
                    : <p>No website snapshot</p>}
            </div>
        </div>
    )
}
