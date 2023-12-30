import { useRouter } from 'next/router'
import {useEffect, useState} from 'react'
import ImageComparison from "../../../modules/ImageComparison"

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
        <div>
            <button onClick={routerBack}>
                Back to project tree
            </button>
            <h1>Project View Page</h1>
            <p>Project ID: {slug?.id}</p>
            <p>Page ID: {slug?.pageUrl}</p>
            <p>Design ID: {slug?.designName}</p>
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
