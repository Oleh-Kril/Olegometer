// pages/projects/[id]/view.jsx
import { useRouter } from 'next/router'
import {useEffect, useState} from 'react'
import ImageComparison from "../../../modules/ImageComparison"

type Slug = {
    id?: string;
    pageId?: string;
    designId?: string;
}

export default function ViewPage(){
    const [slug, setSlug] = useState<Slug>({})
    const router = useRouter()

    useEffect(() => {
        const id = router.query.id as string
        const pageId = router.query.pageId as string
        const designId = router.query.designId as string

        if ((!pageId || !designId) && id) {
            router.push(`/projects/${id}`)
        }

        if(pageId && designId && id){
            setSlug({id, pageId, designId})
        }
    }, [router])

    if (!slug?.pageId || !slug?.designId) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <h1>Project View Page</h1>
            <p>Project ID: {slug?.id}</p>
            <p>Page ID: {slug?.pageId}</p>
            <p>Design ID: {slug?.designId}</p>
            {
                slug?.pageId && slug?.designId && slug?.id
                    ? <ImageComparison
                        pageId={slug.pageId}
                        designId={slug.designId}
                        projectId={slug.id} />
                    : <></>
            }

        </div>
    )
}
