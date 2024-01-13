interface Design {
    width: number;
    designUrl: string;
    designSnapshotUrl?: string;
    websiteSnapshotUrl?: string;
    dynamicElements?: Record<string, DynamicElement>;
}
