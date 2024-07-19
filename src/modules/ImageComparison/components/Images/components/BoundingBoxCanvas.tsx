'use client'
import useImage from "use-image"
import React, {useMemo} from "react"
import {Layer, Rect, Stage, Text} from "react-konva"
import dynamic from "next/dynamic"

const KonvaImage = dynamic(() => import("react-konva").then((mod) => mod.Image), {
    ssr: false,
})

const getColorByType = (type: string) => {
    return type === 'missing' ? 'red' : 'blue'
}

const BoundingBoxCanvas = ({ imageUrl, boundingBoxes, ...props } : any) => {
    const [image] = useImage(imageUrl)
    const styles = useMemo(() => {
        if(!image) return undefined

        return {
            transform: `scale(${window.innerWidth * 0.45 / image.width})`,
            transformOrigin: 'top left',
        }
    }, [image, window.innerWidth])

    return (
        <div style={{ width: '50vw', overflow: 'scroll', position: 'relative' }} {...props}>
            {image && (
                <Stage width={image.width} height={image.height} style={styles} >
                    <Layer>
                        <KonvaImage image={image} />
                        {boundingBoxes.map((bbox: any, index: number) => (
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
                                        if(group) {
                                            const text = group.findOne(`#text-${index}`)
                                            if(text){
                                                text.visible(true)
                                                text.getStage()?.batchDraw()
                                            }
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        const group = e.target.getParent()
                                        if(group) {
                                            const text = group.findOne(`#text-${index}`)
                                            if(text){
                                                text.visible(false)
                                                text.getStage()?.batchDraw()
                                            }
                                        }
                                    }}
                                />
                                <Text
                                    id={`text-${index}`}
                                    x={bbox.x}
                                    y={bbox.y - 20}
                                    text={bbox.message}
                                    fontSize={15}
                                    fill={getColorByType(bbox.type)}
                                    visible={false}
                                />
                            </React.Fragment>
                        ))}
                    </Layer>
                </Stage>
            )}
        </div>
    )
}

export default BoundingBoxCanvas
