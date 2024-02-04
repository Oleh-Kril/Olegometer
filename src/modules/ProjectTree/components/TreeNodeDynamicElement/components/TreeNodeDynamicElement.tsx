import TreeNode from '../../TreeNode'
import {TreeNodeProps} from '@modules/ProjectTree/components/TreeNode/components/TreeNode'
import useConfirmationModal from '@store/confirmationModalStore'
import {useRouter} from 'next/router'
import useGlobalLoader from '@store/globalLoaderStore'
import useProjectsEndpoint from '@hooks/useProjectsEndpoint'
import Agent from '@/Agent'
import {RESET} from 'jotai/utils'
import styles from '../styles/TreeNodeDynamicElement.module.scss'
import RunScreenshotUpdateButton from './RunScreenshotUpdateButton'
import ViewDesignComparisonButton from './ViewDesignComparisonButton'

type Props = Omit<TreeNodeProps, 'chilren'> & {
    pageUrl: string,
    designName: string,
    dynamicElement: DynamicElement
}

export default function TreeNodeWithActions(props: Props){
    const router = useRouter()
    const [confirmationModal, setConfirmationModal] = useConfirmationModal()
    const [globalLoader, setGlobalLoader] = useGlobalLoader()
    const makeRequestAndUpdateState = useProjectsEndpoint()

    async function deleteDynamicElement(){
        const projectId = router.query.id
        const dynamicElementName = router.query.dynamicElementName
        setGlobalLoader({showLoader: true, text: 'Deleting dynamic element...'})

        await makeRequestAndUpdateState(() => Agent.delete(
            `/api/projects/${projectId}/pages/delete-dynamic-element?url=${props.pageUrl}&designName=${props.name}&dynamicElementName=${dynamicElementName}`)
        )

        setGlobalLoader(RESET)
    }

    async function onDeleteClick(){
        setConfirmationModal({modalTitle: 'Are you sure you want to delete the dynamic element?', onConfirm: deleteDynamicElement, showModal: true})
    }

    return (
        <TreeNode {...props}
            className={styles.treeNodeDynamicElements}
            onDeleteClick={onDeleteClick}>
            <div className={styles.buttons}>
                <RunScreenshotUpdateButton
                    pageOnly
                    designName={props.name}
                />

                <RunScreenshotUpdateButton designName={props.name}/>

                <ViewDesignComparisonButton designName={props.name}/>
            </div>
        </TreeNode>
    )
}
