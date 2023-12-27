import React, {useEffect, useState} from "react";
import styles from "../styles/ImageComparison.module.scss";
import useProjects from "../../../store/projectsStore";
import Agent from "../../../Agent";

type Props = {
    pageUrl: string;
    designName: string;
    projectId: string;
}

export default function ImageComparison({pageUrl, designName, projectId}: Props){
    const [designSnapshot, setDesignSnapshot] = useState<string>('');
    const [websiteSnapshot, setWebsiteSnapshot] = useState<string>('');
    const {projects, setProjects} = useProjects();

    useEffect(() => {
        const project = projects?.find(project => project.id === projectId) as Project
        const page = project?.pages.find(page => page.url === pageUrl) as Page
        const design = page?.designs.find(design => design.name === designName) as Design

        if(design){
            Agent.get<string>('/api/s3/get-image?key=' + design.websiteSnapshotUrl).then(snapshot => setWebsiteSnapshot(snapshot))
            Agent.get<string>('/api/s3/get-image?key=' + design.designSnapshotUrl).then(snapshot => setDesignSnapshot(snapshot))
        }
    }, [projects]);

    return (
        <div className={styles.imageComparison}>
            {designSnapshot ? <img src={"data:image/jpeg;base64," + designSnapshot}
                          alt="screenshot"/> : <p>Loading...</p>}
            {websiteSnapshot ? <img src={"data:image/jpeg;base64," + websiteSnapshot}
                                   alt="screenshot"/> : <p>Loading...</p>}
        </div>
    );
}
