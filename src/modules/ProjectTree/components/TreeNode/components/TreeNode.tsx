import React, {MouseEventHandler} from "react"
import styles from '../styles/TreeNode.module.scss'

export type TreeNodeProps = {
    name: string
    children?: React.ReactNode[]
    onClick?: MouseEventHandler<HTMLDivElement>
    className?: string
    isOutlined?: boolean
    id?: string
}

export default function TreeNode({name, children, className, isOutlined, ...props}: TreeNodeProps){
    return (
        <div className={`${styles.treeNode} ${className} ${isOutlined && styles.treeNodeOutlined}`} {...props}>
            <p>{name}</p>
            {children}
        </div>
    )
}
