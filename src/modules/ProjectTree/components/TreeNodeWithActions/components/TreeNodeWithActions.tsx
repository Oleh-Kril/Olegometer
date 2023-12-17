import TreeNode from "../../TreeNode"
import ViewDesignComparisonButton from "./ViewDesignComparisonButton"
import RunScreenshotUpdateButton from "../../../../../components/RunScreenshotUpdateButton"
import {TreeNodeProps} from "../../TreeNode/components/TreeNode"
import styles from '../styles/TreeNodeWithActions.module.scss'
type Props = Omit<TreeNodeProps, 'chilren'>

export default function TreeNodeWithActions(props: Props){
    return (
        <>
            <TreeNode {...props} className={styles.treeNodeWithActions}>
                <RunScreenshotUpdateButton pageOnly/>
                <RunScreenshotUpdateButton />
                <ViewDesignComparisonButton/>
            </TreeNode>
        </>
    )
}
