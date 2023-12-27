import RunButton from "../../../../../../../ui/RunButton";
import {useRouter} from "next/router";
import EyeButton from "../../../../../../../ui/EyeButton";

type Props = {
    pageUrl: string,
    designName: string
}

export default function ViewDesignComparisonButton({pageUrl, designName}: Props){
    const router = useRouter()
    const redirectToViewPage = () => {
        const projectId = router.query.id as string
        router.push(`/projects/${projectId}/view?pageUrl=${pageUrl}&designName=${designName}`)
    }
    return (
        <EyeButton onClick={redirectToViewPage} />
    )
}
