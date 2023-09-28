import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProjects, projectActions } from "../redux/projectReducer";
import { Project } from "../types";
import { isEmpty } from './../utils/isEmpty';
import { useLocalStorage } from "./useLocalStorage";

interface UseProjects {
   projects: Project[];
}

export function useProjects(): UseProjects {
   const rawProjects = useSelector(getAllProjects);
   const dispatch = useDispatch();

   const { get } = useLocalStorage();

   const getProjectsData = useCallback(() => {
      const projects_ids = get<Project[]>('projects') ?? [];
      const projects = projects_ids.map((id) => get(`project-${id}`) as Project);
      dispatch(projectActions.setProjects(projects));
   }, [dispatch, get])

   useEffect(() => {
      if (isEmpty(rawProjects)) {
         getProjectsData()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   return useMemo(() => {

      const projects = Object.values(rawProjects);

      return {
         projects,

      }
   }, [rawProjects])
}