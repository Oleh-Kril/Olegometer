import {useRouter} from 'next/router'
import EyeButton from '../../../../../../../ui/EyeButton'

type Props = {
    designName: string
}

export default function ViewDesignComparisonButton({designName}: Props){
    const router = useRouter()
    const redirectToViewPage = () => {
        const projectId = router.query.id as string
        const pageUrl = router.query.pageUrl as string

        router.push(`/projects/${projectId}/view?pageUrl=${pageUrl}&designName=${designName}`)
    }
    return (
        <EyeButton onClick={redirectToViewPage} />
    )
}
