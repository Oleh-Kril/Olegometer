import Xarrow from "react-xarrows"
type Props = {
    start: string,
    end: string
}

export default function TreeNodeArrow(props: Props){
    return (
        <Xarrow
            {...props}
            startAnchor = "right"
            endAnchor = "left"
            showHead = {false}
            dashness = {true}
            strokeWidth={2}
            gridBreak = "50%"
            color="#B2B2B2"
            path="grid"
        />
    )
}
