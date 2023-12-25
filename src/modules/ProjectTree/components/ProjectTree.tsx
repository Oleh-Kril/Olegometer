import TreeNode from "./TreeNode"
import TreeNodeWithActions from "./TreeNodeWithActions"
import {useState} from "react"
import styles from '../styles/ProjectTree.module.scss'
import AddPageModal from "./AddPageModal"
import TreeNodeArrow from "./TreeNodeArrow"

type Props = {
    pages: Page[]
}

export default function ProjectTree({pages} : Props){
    const [activePageIdx,setActivePageIdx] = useState(0)
    const [showModal, setShowModal] = useState(false)

    return (
        <div className={styles.projectTree}>
            <div className={styles.treeRoots}>
                {pages.map((page, idx) =>
                    <TreeNode key={idx}
                              id={page.url}
                              name={page.url}
                              onClick={() => setActivePageIdx(idx)}/>
                )}
                <TreeNode isOutlined key={-1} name={'Add'} onClick={()=>setShowModal(true)}/>
            </div>
            <div className={styles.treeLeafs}>
                {pages[activePageIdx]?.designs.map((design, idx) =>
                    <>
                        <TreeNodeWithActions key={design.designUrl}
                                             id={design.name}
                                             name={design.name}/>

                        <TreeNodeArrow start={pages[activePageIdx].url}
                                       end = {design.name}/>
                    </>
                )}
            </div>

            <AddPageModal showModal={showModal} onRequestClose={()=>setShowModal(false)}/>
        </div>
    )
}
