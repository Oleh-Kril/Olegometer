import { useRouter } from 'next/router'
import {useEffect, useState} from 'react'
import ImageComparison from '../../../modules/ImageComparison'

type Slug = {
    id?: string;
    pageUrl?: string;
    designName?: string;
}

export default function ViewPage(){
    const [slug, setSlug] = useState<Slug>({})
    const router = useRouter()

    useEffect(() => {
        const id = router.query.id as string
        const pageUrl = router.query.pageUrl as string
        const designName = router.query.designName as string

        if ((!pageUrl || !designName) && id) {
            router.push(`/projects/${id}`)
        }

        if(pageUrl && designName && id){
            setSlug({id, pageUrl, designName})
        }
    }, [router])

    const routerBack = () => {
        const id = router.query.id as string
        const pageUrl = router.query.pageUrl as string

        router.push(`/projects/${id}?pageUrl=${pageUrl}`)
    }

    return (
        <div style={{alignSelf: 'flex-start', padding: "0px 10px"}}>
            <button onClick={routerBack}>
                Back to project tree
            </button>
            <h3>Project ID: {slug?.id} Page ID: {slug?.pageUrl} Design ID: {slug?.designName}</h3>
            {
                slug?.pageUrl && slug?.designName && slug?.id
                    ? <ImageComparison
                        pageUrl={slug.pageUrl}
                        designName={slug.designName}
                        projectId={slug.id} />
                    : <></>
            }
        </div>
    )
}
