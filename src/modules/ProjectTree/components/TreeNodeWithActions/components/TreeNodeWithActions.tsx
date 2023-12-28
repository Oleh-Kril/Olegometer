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
type Props = Omit<TreeNodeProps, 'chilren'> & {
    pageUrl: string,
}

export default function TreeNodeWithActions(props: Props){
    const router = useRouter()
    const { projects, setProjects } = useProjects()
    const [confirmationModal, setConfirmationModal] = useConfirmationModal()
    const [globalLoader, setGlobalLoader] = useGlobalLoader()

    async function deleteDesign(){
        const projectId = router.query.id
        setGlobalLoader({showLoader: true, text: 'Deleting design...'})

        const updatedProject = await Agent.delete(`/api/projects/${projectId}/pages/delete-design?url=${props.pageUrl}&designName=${props.name}`)

        const newProjectsList = projects.map((project) => project.id === projectId ? updatedProject : project) as Project[]

        setProjects(newProjectsList)

        if(updatedProject){
            const newProjectsList = projects.map((project) => project.id === projectId ? updatedProject : project) as Project[]

            setProjects(newProjectsList)
        }

        setGlobalLoader(RESET)
        setConfirmationModal(RESET)
    }

    return (
        <>
            <TreeNode {...props}
                      className={styles.treeNodeWithActions}
                        onDeleteClick={deleteDesign}>
                <div className={styles.buttons}>
                    <RunScreenshotUpdateButton pageOnly
                                               pageUrl={props.pageUrl}
                                               designName={props.name}/>

                    <RunScreenshotUpdateButton pageUrl={props.pageUrl}
                                               designName={props.name}/>

                    <ViewDesignComparisonButton pageUrl={props.pageUrl}
                                                designName={props.name}/>
                </div>
            </TreeNode>
        </>
    )
}
