type InsightsType = 'missing' | 'size';

interface Insights {
    message: string;

    type: InsightsType;

    absoluteDiffWidth?: string;

    absoluteDiffHeight?: string;

    diffWidthInPercents?: string;

    diffHeightInPercents?: string;
}
