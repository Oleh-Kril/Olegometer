import React, {useEffect, useState} from 'react'
import styles from '../styles/ImageComparison.module.scss'
import OverlayMode from '@modules/ImageComparison/components/OverlayMode'
import SideBySideMode from '@modules/ImageComparison/components/SideBySideMode'
import ModeProps from '../types/modeProps.type'
import useCurrentProject from '@hooks/useCurrentProject'
import useGetFile from "@hooks/useGetFile"

type ComparisonMode = 'side-by-side' | 'overlay'

type Props = {
    pageUrl: string;
    designName: string;
    projectId: string;
}

export default function ImageComparison({pageUrl, designName, projectId}: Props){
    const [comparisonMode, setComparisonMode] = useState<ComparisonMode>('side-by-side')
    const {design} = useCurrentProject(true, true)

    const {data: websiteSnapshot} = useGetFile(design?.websiteSnapshotUrl ?? '')
    const {data: designSnapshot} = useGetFile(design?.websiteSnapshotUrl ?? '')

    const modeProps: ModeProps = {
        image1: designSnapshot ? 'data:image/jpeg;base64,' + designSnapshot : '',
        image2: websiteSnapshot ? 'data:image/jpeg;base64,' + websiteSnapshot : '',
        image1LastUpdated: design?.designSnapshotLastUpdated,
        image2LastUpdated: design?.websiteSnapshotLastUpdated,
    }

    return (
        <div className={styles.imageComparison}>
            <button onClick={() => setComparisonMode('side-by-side')}>Side by side</button>
            <button onClick={() => setComparisonMode('overlay')}>Overlay</button>

            {comparisonMode === 'side-by-side'
                ? <SideBySideMode {...modeProps}/>
                : <OverlayMode {...modeProps}/>
            }
        </div>
    )
}
