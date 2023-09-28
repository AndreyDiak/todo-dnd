import { Comment, UpdateCommentDto } from '../types';
import { AppStateType, InferActionsType } from './store';

const SET_COMMENTS = 'comment/SET_COMMENTS';
const ADD_COMMENT = 'comment/ADD_COMMENT';
const UPDATE_COMMENT = 'comment/UPDATE_COMMENT';
const REMOVE_COMMENT = 'comment/REMOVE_COMMENT';

type CommentType = Record<string, Comment[]>;

const initialState = {
   comments: {} as CommentType,
};

type InitialCommentState = typeof initialState;
type CommentActionType = InferActionsType<typeof commentActions>;

export const commentReducer = (
   state = initialState,
   action: CommentActionType,
): InitialCommentState => {
   switch (action.type) {
      case SET_COMMENTS: {
         const { taskId, comments } = action;
         return {
            ...state,
            comments: {
               ...state.comments,
               [taskId]: comments,
            },
         };
      }

      case ADD_COMMENT: {
         const { taskId, comment } = action;
         return {
            ...state,
            comments: {
               ...state.comments,
               [taskId]: [...state.comments[taskId], comment],
            },
         };
      }
      case UPDATE_COMMENT: {
         const { taskId, commentId, data } = action;
         return {
            ...state,
            comments: {
               ...state.comments,
               [taskId]: state.comments[taskId].map((comment) => {
                  if (comment._id === commentId) {
                     return {
                        ...comment,
                        ...data,
                     };
                  }
                  return comment;
               }),
            },
         };
      }
      case REMOVE_COMMENT: {
         const { taskId, commentId } = action;
         return {
            ...state,
            comments: {
               [taskId]: state.comments[taskId].filter((comment) => comment._id !== commentId),
            },
         };
      }

      default:
         return state;
   }
};

export const commentActions = {
   setComments: (taskId: string, comments: Comment[]) =>
      ({ type: SET_COMMENTS, taskId, comments }) as const,

   addComment: (taskId: string, comment: Comment) =>
      ({ type: ADD_COMMENT, taskId, comment }) as const,

   updateComment: (taskId: string, commentId: string, data: UpdateCommentDto) =>
      ({ type: UPDATE_COMMENT, taskId, commentId, data }) as const,

   removeComment: (taskId: string, commentId: string) =>
      ({ type: REMOVE_COMMENT, taskId, commentId }) as const,
};

export const getAllCommentsByTaskId = (state: AppStateType, taskId: string) =>
   state.comment.comments[taskId] ?? [];

// export const getTaskById = (state: AppStateType, projectId: string, taskId: string) =>
//    getAllTasksByProjectId(state, projectId)[taskId];

// export const getFilter = (state: AppStateType) => state.task.filter;
