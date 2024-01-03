import {useRouter} from 'next/router'
import {RESET} from 'jotai/utils'
import useGlobalLoader from '@store/globalLoaderStore'
import useConfirmationModal from '@store/confirmationModalStore'
import useProjectsEndpoint from '@hooks/useProjectsEndpoint'
import Agent from '@/Agent'

import TreeNode, {TreeNodeProps} from '../../TreeNode/components/TreeNode'
import styles from '../styles/TreeNodeDynamicElement.module.scss'
import useCurrentProject from "@hooks/useCurrentProject"

type Props = Omit<TreeNodeProps, 'chilren'> & {
    pageUrl: string,
    dynamicElement: DynamicElement,
    design: Design
}

export default function TreeNodeDynamicElement(props: Props){
    const router = useRouter()
    const [confirmationModal, setConfirmationModal] = useConfirmationModal()
    const [globalLoader, setGlobalLoader] = useGlobalLoader()
    const makeRequestAndUpdateState = useProjectsEndpoint()
    const {project} = useCurrentProject()

    async function runDynamicSnapshot(){
        const projectId = router.query.id
        setGlobalLoader({showLoader: true, text: 'Running dynamic snapshot...'})

        const base64 = await Agent.post<string>(`/api/projects/${projectId}/pages/capture-dynamic-element?url=${props.pageUrl}`, {
            dynamicElement: props.dynamicElement,
            design: props.design,
            projectDomainUrl: project.domainUrl
        })
        console.log(base64)
        setGlobalLoader(RESET)
        setConfirmationModal(RESET)
    }

    return (
        <TreeNode {...props}
            className={styles.treeNodeWithActions}
            onDeleteClick={() => {}}>
            <div className={styles.buttons}>
                <button onClick={runDynamicSnapshot}>Run</button>
            </div>
        </TreeNode>
    )
}
