import TreeNode from './TreeNode'
import TreeNodeWithActions from './TreeNodeWithActions'
import {useEffect, useState} from 'react'
import styles from '../styles/ProjectTree.module.scss'
import AddPageModal from './AddPageModal'
import TreeNodeArrow from './TreeNodeArrow'
import AddDesignModal from './AddDesignModal'
import {useRouter} from 'next/router'

type Props = {
    pages: Record<Url, Page>
}

export default function ProjectTree({pages} : Props){
    const [activePageUrl,setActivePageUrl] = useState<string | null>(null)
    const [showAddPageModal, setShowAddPageModal] = useState(false)
    const [showAddDesignModal, setShowAddDesignModal] = useState(false)

    const currentPage = pages[activePageUrl ?? '']
    const router = useRouter()
    useEffect(() => {
        getActivePageFromUrl()
    }, [])

    useEffect(() => {
        updateUrlBasedOnActivePage()
    }, [activePageUrl])

    function getActivePageFromUrl(){
        const pageUrl = router.query.pageUrl as string
        if(pageUrl){
            setActivePageUrl(pageUrl)
        }else{
            const firstPageUrl = Object.keys(pages)[0]
            setActivePageUrl(firstPageUrl)
        }
    }

    function updateUrlBasedOnActivePage(){
        if(activePageUrl){
            const pageUrl = router.query.pageUrl as string
            if(pageUrl !== activePageUrl){
                router.push(`/projects/${router.query.id}?pageUrl=${activePageUrl}`, undefined, {shallow: true})
            }
        }
    }

    return (
        <div className={styles.projectTree}>
            <div className={styles.treeRoots}>
                {Object.entries(pages).map(([url]) =>
                    <TreeNode key={url}
                        id={url}
                        name={url}
                        onClick={() => setActivePageUrl(url)}/>
                )}
                <TreeNode isOutlined key={-1} name={'Add page'} onClick={()=>setShowAddPageModal(true)}/>
                <AddPageModal showModal={showAddPageModal}
                    onRequestClose={()=>setShowAddPageModal(false)}
                    key={-2}/>
            </div>
            {activePageUrl && currentPage
                ? <div className={styles.treeLeafs}>
                    {Object.entries(currentPage.designs)?.map(([designName, design]) =>
                        <>
                            <TreeNodeWithActions key={design.designUrl}
                                id={`${activePageUrl}:${designName}`}
                                name={designName}
                                pageUrl={activePageUrl}/>

                            <TreeNodeArrow start={activePageUrl}
                                end = {`${activePageUrl}:${designName}`}/>

                            {/*{design?.dynamicElements ? Object.entries(design.dynamicElements).map(([key, value]) =>{*/}
                            {/*    return <TreeNodeDynamicElement*/}
                            {/*        key={key}*/}
                            {/*        name={key}*/}
                            {/*        pageUrl={pages[activePageIdx].url}*/}
                            {/*        design={design}*/}
                            {/*        dynamicElement={value} />*/}
                            {/*}) : null}*/}
                        </>
                    )}
                    <TreeNode isOutlined key={-1} name={'Add design'} onClick={()=>setShowAddDesignModal(true)}/>
                    <AddDesignModal showModal={showAddDesignModal}
                        onRequestClose={()=>setShowAddDesignModal(false)}
                        page={currentPage}
                        pageUrl={activePageUrl}
                        key={-2}/>
                </div> : null}
        </div>
    )
}
