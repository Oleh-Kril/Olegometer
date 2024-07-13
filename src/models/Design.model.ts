interface Design {
    width: number;
    height: number;
    designUrl: string;
    dynamicElements: Record<string, DynamicElement>;
    designSnapshotUrl?: string;
    websiteSnapshotUrl?: string;
    designSnapshotLastUpdated?: string;
    websiteSnapshotLastUpdated?: string;
    comparisonResult?: ComparisonResult;
    comparisonLastUpdated?: string;
}
