import React, {useEffect, useState} from 'react'
import styles from '../styles/ImageComparison.module.scss'
import Agent from '../../../Agent'
import useCurrentProject from '../../../hooks/useCurrentProject'

type Props = {
    pageUrl: string;
    designName: string;
    projectId: string;
}

export default function ImageComparison({pageUrl, designName, projectId}: Props){
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

    return (
        <div className={styles.imageComparison}>
            <div>
                <h3>Design snapshot</h3>
                {design?.designSnapshotLastUpdated ? <p>Last updated: {design.designSnapshotLastUpdated}</p> : null}
                {design?.designSnapshotUrl ? designSnapshot ? <img src={'data:image/jpeg;base64,' + designSnapshot}
                    alt="screenshot"/> : <p>Loading...</p> : <p>No website snapshot</p>}
            </div>
            <div>
                <h3>Website snapshot</h3>
                {design?.websiteSnapshotLastUpdated ? <p>Last updated: {design.websiteSnapshotLastUpdated}</p> : null}
                {design?.websiteSnapshotUrl ? websiteSnapshot ? <img src={'data:image/jpeg;base64,' + websiteSnapshot}
                    alt="screenshot"/> : <p>Loading...</p> : <p>No design snapshot</p>}
            </div>

        </div>
    )
}
