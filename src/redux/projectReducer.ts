import { Project } from '../types';
import { AppStateType, InferActionsType } from './store';

const SET_PROJECTS = 'project/SET_PROJECTS';
const ADD_PROJECT = 'project/ADD_PROJECT';
const REMOVE_PROJECT = 'project/REMOVE_PROJECT';
const UPDATE_PROJECT = 'project/UPDATE_PROJECT';

type ProjectsType = Record<string, Project>;

const initialState = {
   projects: {} as ProjectsType,
};

type InitialProjectState = typeof initialState;
type ProjectActionType = InferActionsType<typeof projectActions>;

export const projectReducer = (
   state = initialState,
   action: ProjectActionType,
): InitialProjectState => {
   switch (action.type) {
      case SET_PROJECTS: {
         const { projects } = action;
         return {
            ...state,
            projects: projects.reduce((acc, project) => {
               acc[project._id] = project;
               return acc;
            }, {} as ProjectsType),
         };
      }

      case ADD_PROJECT: {
         const { project } = action;
         return {
            ...state,
            projects: {
               ...state.projects,
               [project._id]: project,
            },
         };
      }

      case REMOVE_PROJECT: {
         const newProjects = { ...state.projects };
         delete newProjects[action.projectId];

         return {
            ...state,
            projects: newProjects,
         };
      }

      case UPDATE_PROJECT: {
         const { projectId, updatedData } = action;

         return {
            ...state,
            projects: {
               ...state.projects,
               [projectId]: {
                  ...state.projects[projectId],
                  ...updatedData,
               },
            },
         };
      }
      default:
         return state;
   }
};

export const projectActions = {
   setProjects: (projects: Project[]) => ({ type: SET_PROJECTS, projects }) as const,
   addProject: (project: Project) => ({ type: ADD_PROJECT, project }) as const,
   removeProject: (projectId: string) => ({ type: REMOVE_PROJECT, projectId }) as const,
   updateProject: (projectId: string, updatedData: Partial<Project>) =>
      ({ type: UPDATE_PROJECT, projectId, updatedData }) as const,
};

export const getAllProjects = (state: AppStateType) => state.project.projects;
export const getProjectById = (state: AppStateType, id: string) => state.project.projects[id];
