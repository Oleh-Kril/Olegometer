import React, {useEffect, useMemo, useState} from 'react'
import styles from '../styles/ImageComparison.module.scss'
import ModeProps from '../types/modeProps.type'
import useCurrentProject from '@hooks/useCurrentProject'
import useGetFile from "@hooks/react-query/useGetFile"
import useAnalyzeImages from "@hooks/react-query/useAnalyzeImages"
import Images from "@modules/ImageComparison/components/Images"
import useSnackbar from "@hooks/useSnackbar"
import useGlobalLoader from "@store/globalLoaderStore"
import {RESET} from 'jotai/utils'

export type ComparisonMode = 'side-by-side' | 'overlay'

type Props = {
    pageUrl: string;
    designName: string;
    projectId: string;
}

export default function ImageComparison({pageUrl, designName, projectId}: Props){
    const [showAnalysis, setShowAnalysis] = useState(false)
    const [comparisonMode, setComparisonMode] = useState<ComparisonMode>('side-by-side')
    const {project, design} = useCurrentProject(true, true)

    const {data: websiteSnapshot} = useGetFile(design?.websiteSnapshotUrl ?? '')
    const {data: designSnapshot} = useGetFile(design?.designSnapshotUrl ?? '')

    const modeProps: ModeProps = useMemo(() => ({
        image1: designSnapshot ? 'data:image/jpeg;base64,' + designSnapshot : '',
        image2: websiteSnapshot ? 'data:image/jpeg;base64,' + websiteSnapshot : '',
        image1LastUpdated: design?.designSnapshotLastUpdated,
        image2LastUpdated: design?.websiteSnapshotLastUpdated,
        showComparisonResult: showAnalysis,
        comparisonResult: design?.comparisonResult,
        comparisonMode,
    }), [designSnapshot, websiteSnapshot, design?.designSnapshotLastUpdated, design?.websiteSnapshotLastUpdated, showAnalysis, design?.comparisonResult, comparisonMode])

    const [globalLoader, setGlobalLoader] = useGlobalLoader()
    const { mutateAsync: analyzeImages, error, isSuccess } = useAnalyzeImages()

    const analyzeButtonHandler = async () => {
        setGlobalLoader({
            showLoader: true,
            text: 'Analyzing images...'
        })

        await analyzeImages({ projectName: project?.name ?? '', pageUrl, designName })

        setGlobalLoader(RESET)
    }

    const { snackbar, showError } = useSnackbar()

    useEffect(() => {
        snackbar([
            {
                message: 'Images analyzed successfully',
                severity: 'success',
                condition: isSuccess
            },
            {
                message: error?.message ?? 'An error occurred while analyzing the images',
                severity: 'error',
                condition: !!error
            },
        ])
    }, [isSuccess, error])

    return (
        <div className={styles.imageComparison}>
            <div className={styles.controlsMenu}>
                <button onClick={() => setComparisonMode('side-by-side')}>Side by side</button>
                <button onClick={() => setComparisonMode('overlay')}>Overlay</button>
                <button onClick={analyzeButtonHandler}>
                    <img src="/icons/stars.svg"
                         alt="stars" />
                    <span>Analyze</span>
                </button>
                {
                    design?.comparisonResult && (showAnalysis ? (
                        <button onClick={() => setShowAnalysis(false)}>
                            X
                            <span>Hide results</span>
                        </button>
                    ) : (
                        <button onClick={() => setShowAnalysis(true)}>
                            <img src="/icons/eye-solid.svg"
                                 alt="eye" />
                            <span>View results</span>
                        </button>
                    ))
                }
            </div>

            <Images {...modeProps}/>
        </div>
    )
}
