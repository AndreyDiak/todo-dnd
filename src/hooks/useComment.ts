import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { commentActions } from '../redux/commentReducer';
import { Comment, CreateCommentDto, Task } from '../types';
import { useLocalStorage } from './useLocalStorage';

import { v4 as uuidv4 } from 'uuid';
import { taskActions } from '../redux/taskReducer';
import { useProject } from './useProject';
import { isEmpty } from '../utils';

interface UseComment {
   deleteComment(taskId: string, commentId: string): void;
   createComment(taskId: string, data: CreateCommentDto): void;
   getCommentById(commentId: string): Comment;
}

export function useComment(): UseComment {
   const dispatch = useDispatch();

   const { remove, get, create, update } = useLocalStorage();

   const {
      project: { _id: projectId },
   } = useProject();

   const getCommentById = useCallback(
      (commentId: string) => {
         return get<Comment>(`comment-${commentId}`) ?? {};
      },
      [get],
   );

   const updateHeadComment = useCallback(
      (taskId: string, commentId: string, headCommentId: string, type: 'add' | 'remove') => {
         const headComment = getCommentById(headCommentId);

         const newHeadCommentData: Partial<Comment> = {
            replies_ids:
               type === 'add'
                  ? [...headComment.replies_ids, commentId]
                  : headComment.replies_ids.filter((replyId) => replyId != commentId),
         };

         update<Comment>(`comment-${headCommentId}`, newHeadCommentData);

         dispatch(commentActions.updateComment(taskId, headCommentId, newHeadCommentData));
      },
      [dispatch, getCommentById, update],
   );

   const deleteComment = useCallback(
      (taskId: string, commentId: string) => {
         const comment = getCommentById(commentId);

         if (isEmpty(comment)) return;

         // если есть ответы...
         if (comment.replies_ids.length > 0) {
            comment.replies_ids.forEach((replyId) => {
               deleteComment(taskId, replyId);
            });
         }

         // запрашиваем после обхода, чтобы убедится, что у нас уже обновился список comments_ids
         const task = get<Task>(`task-${taskId}`);

         // если есть головной комментарий...
         if (comment.isReply && comment._headCommentId) {
            updateHeadComment(taskId, commentId, comment._headCommentId, 'remove');
         }

         const updatedTaskData: Partial<Task> = {
            comments_ids: task.comments_ids.filter((taskCommentId) => taskCommentId !== commentId),
         };

         console.log({ updatedTaskData });

         // удаляем коммент из хранилищ
         remove(`comment-${commentId}`);
         dispatch(commentActions.removeComment(taskId, commentId));

         // удаляем комментарий из списка комментариев в таске...
         update<Task>(`task-${taskId}`, updatedTaskData);

         dispatch(taskActions.updateTask(projectId, taskId, updatedTaskData));
      },
      [dispatch, get, getCommentById, projectId, remove, update, updateHeadComment],
   );

   const createComment = useCallback(
      (taskId: string, data: CreateCommentDto) => {
         const task = get<Task>(`task-${taskId}`);

         const comment: Comment = {
            _id: uuidv4(),
            createdAt: new Date(),
            replies_ids: [],
            ...data,
         };

         if (data.isReply && data._headCommentId) {
            updateHeadComment(taskId, comment._id, data._headCommentId, 'add');
         }

         const newTaskData: Partial<Task> = {
            comments_ids: [...task.comments_ids, comment._id],
         };

         update<Task>(`task-${taskId}`, newTaskData);

         create<Comment>(`comment-${comment._id}`, comment);

         dispatch(taskActions.updateTask(projectId, taskId, newTaskData));

         dispatch(commentActions.addComment(taskId, comment));
      },
      [create, dispatch, get, projectId, update, updateHeadComment],
   );

   return useMemo(() => {
      return {
         deleteComment,
         getCommentById,
         createComment,
      };
   }, [createComment, deleteComment, getCommentById]);
}
