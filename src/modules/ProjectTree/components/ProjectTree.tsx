import TreeNode from "./TreeNode"
import TreeNodeWithActions from "./TreeNodeWithActions"
import {useState} from "react"
import styles from '../styles/ProjectTree.module.scss'
import AddPageModal from "./AddPageModal"
import TreeNodeArrow from "./TreeNodeArrow"
import AddDesignModal from "./AddDesignModal"

type Props = {
    pages: Page[]
}

export default function ProjectTree({pages} : Props){
    const [activePageIdx,setActivePageIdx] = useState(0)
    const [showAddPageModal, setShowAddPageModal] = useState(false)
    const [showAddDesignModal, setShowAddDesignModal] = useState(false)

    return (
        <div className={styles.projectTree}>
            <div className={styles.treeRoots}>
                {pages.map((page, idx) =>
                    <TreeNode key={idx}
                              id={page.url}
                              name={page.url}
                              onClick={() => setActivePageIdx(idx)}/>
                )}
                <TreeNode isOutlined key={-1} name={'Add page'} onClick={()=>setShowAddPageModal(true)}/>
                <AddPageModal showModal={showAddPageModal}
                              onRequestClose={()=>setShowAddPageModal(false)}
                              key={-2}/>
            </div>
            <div className={styles.treeLeafs}>
                {pages[activePageIdx]?.designs.map((design, idx) =>
                    <>
                        <TreeNodeWithActions key={design.designUrl}
                                             id={design.name}
                                             name={design.name}
                                             pageUrl={pages[activePageIdx].url}/>

                        <TreeNodeArrow start={pages[activePageIdx].url}
                                       end = {design.name}/>
                    </>
                )}
                <TreeNode isOutlined key={-1} name={'Add design'} onClick={()=>setShowAddDesignModal(true)}/>
                <AddDesignModal showModal={showAddDesignModal}
                                onRequestClose={()=>setShowAddDesignModal(false)}
                                page={pages[activePageIdx]}
                                key={-2}/>
            </div>
        </div>
    )
}
