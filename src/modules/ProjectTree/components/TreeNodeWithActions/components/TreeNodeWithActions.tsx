import {useRouter} from 'next/router'
import {RESET} from 'jotai/utils'
import useGlobalLoader from '@store/globalLoaderStore'
import useConfirmationModal from '@store/confirmationModalStore'
import useProjectsEndpoint from '@hooks/useProjectsEndpoint'
import Agent from '@/Agent'

import TreeNode, {TreeNodeProps} from '../../TreeNode/components/TreeNode'
import RunScreenshotUpdateButton from '../components/RunScreenshotUpdateButton'
import ViewDesignComparisonButton from '../components/ViewDesignComparisonButton'
import styles from '../styles/TreeNodeWithActions.module.scss'

type Props = Omit<TreeNodeProps, 'chilren'> & {
    pageUrl: string,
}

export default function TreeNodeWithActions(props: Props){
    const router = useRouter()
    const [confirmationModal, setConfirmationModal] = useConfirmationModal()
    const [globalLoader, setGlobalLoader] = useGlobalLoader()
    const makeRequestAndUpdateState = useProjectsEndpoint()

    async function deleteDesign(){
        const projectId = router.query.id
        setGlobalLoader({showLoader: true, text: 'Deleting design...'})

        await makeRequestAndUpdateState(() => Agent.delete(`/api/projects/${projectId}/pages/delete-design?url=${props.pageUrl}&designName=${props.name}`))

        setGlobalLoader(RESET)
        setConfirmationModal(RESET)
    }

    return (
        <TreeNode {...props}
            className={styles.treeNodeWithActions}
            onDeleteClick={deleteDesign}>
            <div className={styles.buttons}>
                <RunScreenshotUpdateButton pageOnly
                    designName={props.name}/>

                <RunScreenshotUpdateButton designName={props.name}/>

                <ViewDesignComparisonButton designName={props.name}/>
            </div>
        </TreeNode>
    )
}
