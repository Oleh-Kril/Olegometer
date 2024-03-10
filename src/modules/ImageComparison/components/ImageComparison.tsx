import React, {useEffect, useState} from 'react'
import styles from '../styles/ImageComparison.module.scss'
import OverlayMode from '@modules/ImageComparison/components/OverlayMode'
import SideBySideMode from '@modules/ImageComparison/components/SideBySideMode'
import ModeProps from '../types/modeProps.type'
import useCurrentProject from '@hooks/useCurrentProject'
import Agent from '@/Agent'

type ComparisonMode = 'side-by-side' | 'overlay'

type Props = {
    pageUrl: string;
    designName: string;
    projectId: string;
}

export default function ImageComparison({pageUrl, designName, projectId}: Props){
    const [comparisonMode, setComparisonMode] = useState<ComparisonMode>('side-by-side')
    const [designSnapshot, setDesignSnapshot] = useState<string>('')
    const [websiteSnapshot, setWebsiteSnapshot] = useState<string>('')
    const {design} = useCurrentProject(true, true)

    useEffect(() => {
        if(design){
            if(design.websiteSnapshotUrl){
                Agent.get<string>('/api/s3/get-image?key=' + design.websiteSnapshotUrl).then(snapshot => setWebsiteSnapshot(snapshot))
            }
            if(design.designSnapshotUrl){
                Agent.get<string>('/api/s3/get-image?key=' + design.designSnapshotUrl).then(snapshot => setDesignSnapshot(snapshot))
            }
        }
    }, [design])

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
