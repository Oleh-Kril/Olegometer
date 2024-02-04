import styles from '../styles/OverlayMode.module.scss'
import React from 'react'
import ModeProps from '@modules/ImageComparison/types/modeProps.type'

export default function OverlayMode({image1, image2, image1LastUpdated, image2LastUpdated}: ModeProps){
    const [isFirstVisible, setIsFirstVisible] = React.useState<boolean>(true)

    const toggleIsFirstVisible = () => setIsFirstVisible(prevState => !prevState)

    return (
        <div className={styles.overlayMode} onClick={toggleIsFirstVisible}>
            <div className={isFirstVisible ? styles.active : styles.hidden}>
                <h3>Design snapshot</h3>
                {image1LastUpdated ? <p>Last updated: {image1LastUpdated}</p> : null}
                {image1LastUpdated
                    ? image1
                        ? <img src={image1} alt="screenshot"/>
                        : <p>Loading...</p>
                    : <p>No website snapshot</p>}
            </div>


            <div className={isFirstVisible ? styles.hidden : styles.active}>
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
