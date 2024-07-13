'use client'
import styles from '../styles/SideBySideMode.module.scss'
import React, {useEffect, useMemo} from 'react'
import { Stage, Layer, Image as KonvaImage, Rect, Text } from 'react-konva'
import useImage from 'use-image'
import ModeProps from '@modules/ImageComparison/types/modeProps.type'

const getColorByType = (type: string) => {
    return type === 'missing' ? 'red' : 'blue'
}

const BoundingBoxCanvas = ({ imageUrl, boundingBoxes } : any) => {
    const [image] = useImage(imageUrl)
    const styles = useMemo(() => {
        if(!image) return undefined

        return {
            transform: `scale(${window.innerWidth * 0.45 / image.width})`,
            transformOrigin: 'top left',
        }
    }, [image, window.innerWidth])

    return (
        <div style={{ width: '50vw', overflow: 'scroll', position: 'relative' }}>
            {image && (
                <Stage width={image.width} height={image.height} style={styles}>
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

export default function SideBySideMode({ image1, image2, image1LastUpdated, image2LastUpdated, comparisonResult, showComparisonResult }: ModeProps) {
    const designBoundingBoxes = [] as any[]
    const websiteBoundingBoxes = [] as any[]

    const parseBoundingBox = (bboxString: string) => {
        const coords = bboxString.split('-')[0].match(/\d+/g)
        if(!coords) return undefined
        return {
            x: parseInt(coords[1], 10),
            y: parseInt(coords[0], 10),
            width: parseInt(coords[3], 10) - parseInt(coords[1], 10),
            height: parseInt(coords[2], 10) - parseInt(coords[0], 10),
        }
    }

    if (comparisonResult && showComparisonResult) {
        for (const [key, values] of Object.entries(comparisonResult.insights)) {
            const bbox = parseBoundingBox(key)
            if (!bbox) continue
            values.forEach((value: any) => {
                const boundingBox = {
                    ...bbox,
                    type: value.type,
                    message: value.message,
                }
                if (key.includes('-design')) {
                    designBoundingBoxes.push(boundingBox)
                } else if (key.includes('-website')) {
                    websiteBoundingBoxes.push(boundingBox)
                }
            })
        }
    }

    return (
        <div className={styles.sideBySideMode}>
            <div className={styles.column}>
                <h3>Design snapshot</h3>
                {image1LastUpdated ? <p>Last updated: {image1LastUpdated}</p> : null}
                {image1LastUpdated ? (
                    image1 ? (
                        <BoundingBoxCanvas imageUrl={image1} boundingBoxes={designBoundingBoxes} />
                    ) : (
                        <p>Loading...</p>
                    )
                ) : (
                    <p>No website snapshot</p>
                )}
            </div>
            <div className={styles.column}>
                <h3>Website snapshot</h3>
                {image2LastUpdated ? <p>Last updated: {image2LastUpdated}</p> : null}
                {image2LastUpdated ? (
                    image2 ? (
                        <BoundingBoxCanvas imageUrl={image2} boundingBoxes={websiteBoundingBoxes} />
                    ) : (
                        <p>Loading...</p>
                    )
                ) : (
                    <p>No website snapshot</p>
                )}
            </div>
        </div>
    )
}
