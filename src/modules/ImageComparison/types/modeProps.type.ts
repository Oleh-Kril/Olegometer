import {ComparisonMode} from "@modules/ImageComparison/components/ImageComparison"

type ModeProps ={
    image1?: string;
    image2?: string;
    image1LastUpdated?: string;
    image2LastUpdated?: string;
    comparisonResult?: ComparisonResult;
    showComparisonResult?: boolean;
    comparisonMode: ComparisonMode;
}

export default ModeProps
