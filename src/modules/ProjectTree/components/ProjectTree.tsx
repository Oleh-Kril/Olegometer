import TreeNode from './TreeNode'
import TreeNodeWithActions from './TreeNodeWithActions'
import {useEffect, useState} from 'react'
import styles from '../styles/ProjectTree.module.scss'
import AddPageModal from './AddPageModal'
import TreeNodeArrow from './TreeNodeArrow'
import AddDesignModal from './AddDesignModal'
import {useRouter} from 'next/router'

type Props = {
    pages: Page[]
}

export default function ProjectTree({pages} : Props){
    const [activePageIdx,setActivePageIdx] = useState<number | null>(null)
    const [showAddPageModal, setShowAddPageModal] = useState(false)
    const [showAddDesignModal, setShowAddDesignModal] = useState(false)
    const router = useRouter()

    useEffect(() => {
        getActivePageFromUrl()
    }, [])

    useEffect(() => {
        updateUrlBasedOnActivePage()
    }, [activePageIdx])

    function getActivePageFromUrl(){
        const pageUrl = router.query.pageUrl as string
        if(pageUrl){
            const pageIdx = pages.findIndex(page => page.url === pageUrl)
            if(pageIdx !== -1){
                setActivePageIdx(pageIdx)
            }
        }else{
            setActivePageIdx(0)
        }
    }

    function updateUrlBasedOnActivePage(){
        if(activePageIdx !== null){
            const pageUrl = router.query.pageUrl as string
            if(pageUrl !== pages[activePageIdx]?.url){
                router.push(`/projects/${router.query.id}?pageUrl=${pages[activePageIdx]?.url}`, undefined, {shallow: true})
            }
        }
    }

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
            {activePageIdx !== null
                ? <div className={styles.treeLeafs}>
                    {pages[activePageIdx]?.designs.map((design, idx) =>
                        <>
                            <TreeNodeWithActions key={design.designUrl}
                                id={`${pages[activePageIdx].url}:${design.name}`}
                                name={design.name}
                                pageUrl={pages[activePageIdx].url}/>

                            <TreeNodeArrow start={pages[activePageIdx].url}
                                end = {`${pages[activePageIdx].url}:${design.name}`}/>
                        </>
                    )}
                    <TreeNode isOutlined key={-1} name={'Add design'} onClick={()=>setShowAddDesignModal(true)}/>
                    <AddDesignModal showModal={showAddDesignModal}
                        onRequestClose={()=>setShowAddDesignModal(false)}
                        page={pages[activePageIdx]}
                        key={-2}/>
                </div> : null}
        </div>
    )
}
