import { useCallback } from 'react';
import useProjects from "../store/projectsStore"
import {useRouter} from "next/router"

const useCurrentProject = (getPage?: boolean, getDesign?: boolean) => {
    const { projects, setProjects } = useProjects();
    const router = useRouter();

    const getProjectAndData = useCallback(() => {
        const project = projects.find(project => project.id === router.query.id) as Project

        if(getPage){
            const page = project?.pages.find(page => page.url === router.query.pageUrl) as Page

            if(getDesign){
                const design = page?.designs.find(design => design.name === router.query.designName) as Design

                return {project, page, design}
            }

            return {project, page}
        }

        return {project}
    }, [router.query, projects]);

    return getProjectAndData();
};

export default useCurrentProject;
