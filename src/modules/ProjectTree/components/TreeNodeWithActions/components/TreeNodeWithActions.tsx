import {useRouter} from 'next/router'
import {RESET} from 'jotai/utils'
import useGlobalLoader from '@store/globalLoaderStore'
import useConfirmationModal from '@store/confirmationModalStore'
import TreeNode, {TreeNodeProps} from '../../TreeNode/components/TreeNode'
import RunScreenshotUpdateButton from '../components/RunScreenshotUpdateButton'
import ViewDesignComparisonButton from '../components/ViewDesignComparisonButton'
import styles from '../styles/TreeNodeWithActions.module.scss'
import useSnackbar from "@hooks/useSnackbar"
import useCurrentProject from "@hooks/useCurrentProject"
import useDeleteDesign from "@hooks/react-query/projects/useDeleteDesign"

type Props = Omit<TreeNodeProps, 'chilren'> & {
    pageUrl: string,
}

export default function TreeNodeWithActions(props: Props){
    const router = useRouter()
    const [confirmationModal, setConfirmationModal] = useConfirmationModal()
    const [globalLoader, setGlobalLoader] = useGlobalLoader()
    const { project } = useCurrentProject()

    const { mutateAsync: deleteDesign, error, isSuccess } = useDeleteDesign()

    const { snackbar, showError } = useSnackbar()

    snackbar([
        {
            message: 'Page deleted successfully',
            severity: 'success',
            condition: isSuccess
        },
        {
            message: error?.message ?? 'An error occurred while deleting the page',
            severity: 'error',
            condition: !!error
        },
    ])

    async function handleDeleteDesign(){
        if(!project){
            showError('Project not found. Please try again or reload current page.')
            return
        }
        await deleteDesign({projectName: project.name, pageUrl: props.pageUrl, designName: props.name})

        setConfirmationModal(RESET)
    }

    return (
        <TreeNode {...props}
            className={styles.treeNodeWithActions}
            onDeleteClick={handleDeleteDesign}>
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
