import TreeNode from "../../TreeNode"
import ViewDesignComparisonButton from "./ViewDesignComparisonButton"
import RunScreenshotUpdateButton from "../../../../../components/RunScreenshotUpdateButton"
import {TreeNodeProps} from "../../TreeNode/components/TreeNode"
import styles from '../styles/TreeNodeWithActions.module.scss'
import Agent from "../../../../../Agent";
import {useRouter} from "next/router";
import useProjects from "../../../../../store/projectsStore";
import useConfirmationModal from "../../../../../store/confirmationModalStore";
import {RESET} from "jotai/utils";
import addDesign from "../../AddDesignModal/requests/addDesign"
import useGlobalLoader from "../../../../../store/globalLoaderStore"
import useProjectsEndpoint from "../../../../../hooks/useProjectsEndpoint"
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
