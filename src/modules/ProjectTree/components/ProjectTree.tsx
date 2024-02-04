import TreeNode from './TreeNode'
import TreeNodeWithActions from './TreeNodeWithActions'
import {useEffect, useState} from 'react'
import styles from '../styles/ProjectTree.module.scss'
import AddPageModal from './AddPageModal'
import TreeNodeArrow from './TreeNodeArrow'
import AddDesignModal from './AddDesignModal'
import {useRouter} from 'next/router'
import TreeNodeDynamicElement from '@modules/ProjectTree/components/TreeNodeDynamicElement'

type Props = {
    pages: Record<Url, Page>
}

export default function ProjectTree({pages} : Props){
    const [activePageUrl,setActivePageUrl] = useState<string | null>(null)
    const [activeDesignName,setActiveDesignName] = useState<string | null>(null)
    const [showAddPageModal, setShowAddPageModal] = useState(false)
    const [showAddDesignModal, setShowAddDesignModal] = useState(false)

    const currentPage: Page | null = pages[activePageUrl ?? '']
    const currentDesign: Design | null = currentPage && currentPage.designs[activeDesignName ?? '']

    const router = useRouter()
    useEffect(() => {
        getActiveStateFromUrl()
    }, [])

    useEffect(() => {
        updateUrlBasedOnActiveState()
    }, [activePageUrl, activeDesignName])

    function getActiveStateFromUrl(){
        const pageUrl = router.query.pageUrl as (string | undefined)
        const designName = router.query.designName as (string | undefined)

        if(pageUrl){
            setActivePageUrl(pageUrl)
            if(designName){
                setActiveDesignName(designName)
            }
        }
    }

    function updateUrlBasedOnActiveState(){
        if(activePageUrl){
            const pageUrl = router.query.pageUrl as (string | undefined)
            const designName  = router.query.designName as (string | undefined)

            let route = `/projects/${router.query.id}`

            if(activePageUrl){
                route += `?pageUrl=${activePageUrl}`

                if(activeDesignName){
                    route += `&designName=${activeDesignName}`
                }
            }

            if(pageUrl !== activePageUrl || designName !== activeDesignName){
                router.push(route, undefined, {shallow: true})
            }
        }
    }
    const onPageNodeClick = (event: any) => {
        setActivePageUrl(event.target.id)
        setActiveDesignName(null)
    }

    const onDesignNodeClick = (event: any) => {
        const id = event.target.id
        const designName = id.split(':')[1]
        setActiveDesignName(designName)
    }


    return (
        <div className={styles.projectTree}>
            <div className={styles.treeRoots}>
                {Object.entries(pages).map(([url]) =>
                    <TreeNode key={url}
                        id={url}
                        name={url}
                        onClick={onPageNodeClick}/>
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
                                pageUrl={activePageUrl}
                                onClick={onDesignNodeClick}/>

                            <TreeNodeArrow start={activePageUrl}
                                end = {`${activePageUrl}:${designName}`}/>
                        </>
                    )}
                    <TreeNode isOutlined key={-1} name={'Add design'} onClick={()=>setShowAddDesignModal(true)}/>
                    <AddDesignModal showModal={showAddDesignModal}
                        onRequestClose={()=>setShowAddDesignModal(false)}
                        page={currentPage}
                        pageUrl={activePageUrl}
                        key={-2}/>
                </div> : null}
            {/*{activePageUrl && activeDesignName && currentDesign ?*/}
            {/*    <div className={styles.treeLeafs}>*/}
            {/*        {Object.entries(currentDesign.dynamicElements).map(([dynamicElementName, dynamicElement]) =>(*/}
            {/*            <>*/}
            {/*                <TreeNodeDynamicElement*/}
            {/*                    id={`${activePageUrl}:${activeDesignName}:${dynamicElementName}`}*/}
            {/*                    key={dynamicElementName}*/}
            {/*                    name={dynamicElementName}*/}
            {/*                    pageUrl={activePageUrl}*/}
            {/*                    designName={activeDesignName}*/}
            {/*                    dynamicElement={dynamicElement} />*/}

            {/*                <TreeNodeArrow start={`${activePageUrl}:${activeDesignName}`}*/}
            {/*                               end = {`${activePageUrl}:${activeDesignName}:${dynamicElementName}`}/>*/}
            {/*            </>*/}
            {/*        ))}*/}
            {/*        <TreeNode isOutlined key={-1} name={'Add dynamic element'} onClick={()=>setShowAddDesignModal(true)}/>*/}
            {/*    </div> : null}*/}
        </div>
    )
}
