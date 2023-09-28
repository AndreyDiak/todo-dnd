import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { commentActions, getAllCommentsByTaskId } from '../redux/commentReducer';
import { AppStateType } from '../redux/store';
import { Comment } from '../types';

import { isEmpty } from '../utils';
import { useComment } from './useComment';
import { useTask } from './useTask';

interface UseComments {
   comments: Comment[];
}

export function useComments(taskId: string): UseComments {
   const dispatch = useDispatch();

   const rawCommentsSelector = useCallback(
      (state: AppStateType) => getAllCommentsByTaskId(state, taskId),
      [taskId],
   );

   const rawComments = useSelector(rawCommentsSelector);

   const { getTaskById } = useTask();

   const { getCommentById } = useComment();

   const getCommentsData = useCallback(() => {
      const task = getTaskById(taskId);
      const comments = task.comments_ids.map((commentId) => getCommentById(commentId));
      dispatch(commentActions.setComments(taskId, comments));
   }, [dispatch, getCommentById, getTaskById, taskId]);

   useEffect(() => {
      if (isEmpty(rawComments)) {
         getCommentsData();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   return useMemo(() => {
      const comments = rawComments.filter((comment) => !comment.isReply && !isEmpty(comment));

      return {
         comments,
      };
   }, [rawComments]);
}
