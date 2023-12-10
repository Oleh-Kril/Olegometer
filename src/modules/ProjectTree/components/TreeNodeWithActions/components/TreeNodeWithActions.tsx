import TreeNode from "../../TreeNode"
import ViewDesignComparisonButton from "./ViewDesignComparisonButton"
import RunScreenshotUpdateButton from "../../../../../components/RunScreenshotUpdateButton"

export default function TreeNodeWithActions(){
    return (
        <>
            <TreeNode>
                <RunScreenshotUpdateButton pageOnly/>
                <RunScreenshotUpdateButton />
                <ViewDesignComparisonButton/>
            </TreeNode>
        </>
    )
}
