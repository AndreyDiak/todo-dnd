import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getProjectById, projectActions } from '../redux/projectReducer';
import { AppStateType } from '../redux/store';
import { useCallback, useEffect, useMemo } from 'react';
import { isEmpty } from '../utils/isEmpty';
import { useLocalStorage } from './useLocalStorage';
import { CreateProjectDto, Project } from '../types';

import { v4 as uuidv4 } from 'uuid';

interface UseProject {
   project: Project;
   deleteProject(): void;
   createProject(data: CreateProjectDto): void;
}

export function useProject(): UseProject {
   const { projectId } = useParams() as { projectId: string };

   const dispatch = useDispatch();
   const rawProject = useSelector((state: AppStateType) => getProjectById(state, projectId));

   const { get, create, remove, removeFromList, updateList } = useLocalStorage();

   const getProjectData = useCallback(() => {
      const project = get(`project-${projectId}`) as Project;

      if (isEmpty(project)) return;

      dispatch(projectActions.addProject(project));
   }, [dispatch, get, projectId]);

   const deleteProject = useCallback(() => {
      // TODO возможно нельзя удалить проект пока в нем есть таски??
      if (rawProject?.tasks_ids?.length > 0) {
         rawProject.tasks_ids.forEach((taskId) => {
            remove(`task-${taskId}`);
         });
      }
      // удаляем сам проект
      remove(`project-${projectId}`);
      // удаляем проект из списка проектов
      removeFromList('projects', projectId);
      // удаляем из redux
      dispatch(projectActions.removeProject(projectId));
   }, [dispatch, projectId, rawProject, remove, removeFromList]);

   const createProject = useCallback(
      (data: CreateProjectDto) => {
         const { description, header } = data;

         const project: Project = {
            _id: uuidv4(),
            description,
            header,
            totalTasks: 0,
            tasks_ids: [],
         };

         updateList('projects', project._id);
         create(`project-${project._id}`, project);

         dispatch(projectActions.addProject(project));
      },
      [create, dispatch, updateList],
   );

   useEffect(() => {
      if (isEmpty(rawProject)) {
         getProjectData();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   return useMemo(() => {
      return {
         project: rawProject ?? {},
         deleteProject,
         createProject,
      };
   }, [createProject, deleteProject, rawProject]);
}
