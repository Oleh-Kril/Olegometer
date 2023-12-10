import React from "react"

type Props = {
    children?: React.ReactNode[]
}

export default function TreeNode({children}: Props){
    return (
        <>
            <div>TreeNode</div>
            {children}
        </>
    )
}
