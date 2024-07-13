interface ComparisonResult {
    designElementsCount: string;

    websiteElementsCount: string;

    totalTime: string;

    insights: Record<string, Insights[]>

    pairsFound: string;
}
