interface Design {
    width: number;
    designUrl: string;
    designSnapshotUrl?: string;
    websiteSnapshotUrl?: string;
    designSnapshotLastUpdated?: string;
    websiteSnapshotLastUpdated?: string;
    dynamicElements?: Record<string, DynamicElement>;
}
