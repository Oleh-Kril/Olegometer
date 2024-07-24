'use client'

import useImage from "use-image"
import React, { useMemo } from "react"
import { Layer, Rect, Stage, Text } from "react-konva"
import dynamic from "next/dynamic"
import styles from '../styles/BoundingBoxCanvas.module.scss'

const KonvaImage = dynamic(() => import("react-konva").then((mod) => mod.Image), {
    ssr: false,
})

const getColorByType = (type: string) => {
    return type === 'missing' ? 'red' : 'blue'
}

const BoundingBoxCanvas = ({ imageUrl, boundingBoxes, comparisonMode, ...props } : any) => {
    const [image] = useImage(imageUrl)
    const stylesForScale = useMemo(() => {
        if (!image) return undefined

        return {
            transform: `scale(${(window.innerWidth * (comparisonMode === "overlay" ? 0.8 : 0.5)) / image.width})`,
            transformOrigin: 'top left',
            marginLeft: comparisonMode === "overlay" ? window.innerWidth * 0.05 : undefined,
        }
    }, [image, window.innerWidth, comparisonMode])

    return (
        <div style={{ width: comparisonMode === "overlay" ? '100vw' : '50vw' }} className={styles.container} {...props}>
            {image && (
                <Stage width={image.width} height={image.height} style={stylesForScale} >
                    <Layer>
                        <KonvaImage image={image} />
                        {boundingBoxes.map((bbox: any, index: number) => {
                            const textId = `text-${index}`
                            const textLabelId = `rect-${index}`

                            return (
                                <React.Fragment key={index}>
                                    <Rect
                                        x={bbox.x}
                                        y={bbox.y}
                                        width={bbox.width}
                                        height={bbox.height}
                                        stroke={getColorByType(bbox.type)}
                                        strokeWidth={2}
                                        onMouseEnter={(e) => {
                                            const group = e.target.getParent()
                                            if (group) {
                                                const text = group.findOne(`#${textId}`)
                                                const label = group.findOne(`#${textLabelId}`)
                                                if (label && text) {
                                                    label.visible(true)
                                                    text.visible(true)
                                                    text.getStage()?.batchDraw()
                                                }
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            const group = e.target.getParent()
                                            if (group) {
                                                const text = group.findOne(`#${textId}`)
                                                const label = group.findOne(`#${textLabelId}`)
                                                if (label && text) {
                                                    label.visible(false)
                                                    text.visible(false)
                                                    text.getStage()?.batchDraw()
                                                }
                                            }
                                        }}
                                    />
                                    <Rect
                                        id={textLabelId}
                                        x={bbox.x - 5}
                                        y={bbox.y - 25}
                                        width={20}
                                        height={20}
                                        fill="white"
                                        stroke="black"
                                        strokeWidth={1}
                                        cornerRadius={5}
                                        visible={false}
                                        zIndex={999}
                                    />
                                    <Text
                                        id={textId}
                                        x={bbox.x - 5}
                                        y={bbox.y - 25}
                                        text={bbox.message}
                                        fontSize={15}
                                        fill={getColorByType(bbox.type)}
                                        visible={false}
                                        zIndex={999}
                                        ref={(node) => {
                                            if (node) {
                                                const textWidth = node.width()
                                                const rectX = bbox.x + textWidth > image.width ? image.width - textWidth - 10 : bbox.x - 5
                                                const rectY = bbox.y - 25 < 0 ? bbox.y + 25 : bbox.y - 25
                                                node.moveToTop()
                                                node.position({ x: rectX + 5, y: rectY + 5 }) // Adjust for padding
                                                const rect = node.getParent()?.findOne(`#rect-${index}`)
                                                if (rect) {
                                                    rect.width(textWidth + 10)
                                                    rect.position({ x: rectX, y: rectY })
                                                    node.getStage()?.batchDraw()
                                                }
                                            }
                                        }}
                                    />
                                </React.Fragment>
                            )
                        })}
                    </Layer>
                </Stage>
            )}
        </div>
    )
}

export default BoundingBoxCanvas
