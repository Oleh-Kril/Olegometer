import {useRouter} from 'next/router'
import useCurrentProject from '@hooks/useCurrentProject'
import ProjectTree from '@modules/ProjectTree'
import UpdateAllSnapshotsPanel from '@components/UpdateAllSnapshotsPanel'

export default function ProjectPage(){
    const router = useRouter()
    const { project } = useCurrentProject()

    return (
        <div>
            <button style={{position: 'absolute', top: '1rem', left: '1rem'}}
                onClick={() => router.push('/projects')}>Back to all projects</button>
            {
                project ?
                    <ProjectTree pages={project?.pages || []}/>
                    :
                    <p>Loading..</p>
            }
            <UpdateAllSnapshotsPanel />
        </div>

    )
}
