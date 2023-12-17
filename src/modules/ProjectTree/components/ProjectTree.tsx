import TreeNode from "./TreeNode"
import TreeNodeWithActions from "./TreeNodeWithActions"
import {useState} from "react"
import styles from '../styles/ProjectTree.module.scss'
import Xarrow, {Xwrapper, useXarrow} from "react-xarrows"

type Props = {
    pages: Page[]
}
export default function ProjectTree({pages} : Props){
    const [activePageIdx,setActivePageIdx] = useState(0)

    return (
        <div className={styles.projectTree}>
            <div className={styles.treeRoots}>
                {pages.map((page, idx) =>
                    <TreeNode key={idx}
                              id={page.url}
                              name={page.url}
                              onClick={() => setActivePageIdx(idx)}/>
                )}
                <TreeNode isOutlined key={-1} name={'Add'} onClick={()=>console.log('add')}/>
            </div>
            <div className={styles.treeLeafs}>
                {pages[activePageIdx].designs?.map((design, idx) =>
                    <>
                        <TreeNodeWithActions key={design.designUrl}
                                             id={design.name}
                                             name={design.name}/>
                        <Xarrow
                            key = {idx}
                            start={pages[activePageIdx].url}
                            end = {design.name}
                            startAnchor = "right"
                            endAnchor = "left"
                            showHead = {false}
                            dashness = {true}
                            strokeWidth={2}
                            gridBreak = "50%"
                            color="#B2B2B2"
                            path="grid"
                        />
                    </>
                )}
            </div>
        </div>
    )
}
