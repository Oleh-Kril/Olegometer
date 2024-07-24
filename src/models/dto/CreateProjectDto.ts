interface CreateProjectDto {
    name: string;
    domainUrl: string;
    figmaToken: string;
    users?: Record<string, string>;
}
