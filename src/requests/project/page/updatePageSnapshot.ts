import Agent from '@/Agent'

export default async function updatePageSnapshot(project: Project, pageUrl: string, design: Design, designName: string){
    return Agent.post<Project>(`/api/projects/${project.id}/pages/make-screenshot?url=${pageUrl}`,
        {design, projectDomainUrl: project.domainUrl, designName})
}
