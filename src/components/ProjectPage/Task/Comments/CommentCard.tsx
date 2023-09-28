import moment from 'moment';
import React from 'react';
import { useComment } from '../../../../hooks/useComment';
import { Comment } from '../../../../types';

interface Props {
   comment: Comment;
   taskId: string;
   level?: number;
   replyHandler: (comment: Comment) => void;
}

export const CommentCard = React.memo(({ comment, replyHandler, taskId, level = 0 }: Props) => {
   const { getCommentById, deleteComment } = useComment();

   const renderReply = () => {
      if (comment.replies_ids?.length === 0) {
         return null;
      }
      return comment.replies_ids?.map((replyId) => (
         <div key={replyId} className="my-2">
            <CommentCard
               comment={getCommentById(replyId)}
               replyHandler={replyHandler}
               taskId={taskId}
               level={level + 1}
            />
         </div>
      ));
   };

   return (
      <span>
         <div
            className="bg-slate-100 rounded-lg py-1 px-2 md:px-4"
            style={{
               marginLeft: level * 30,
            }}
         >
            <div className="font-normal italic text-sm md:text-base">{comment.text} </div>
            <div className="flex justify-between text-xs md:text-sm font-normal text-black">
               <div>
                  <span
                     onClick={() => {
                        replyHandler(comment);
                     }}
                     className="text-gray-600 mr-2 cursor-pointer hover:text-gray-800"
                  >
                     Ответить
                  </span>
                  <span
                     onClick={() => {
                        deleteComment(taskId, comment._id);
                     }}
                     className="text-red-600 mr-2 cursor-pointer hover:text-red-800"
                  >
                     Удалить
                  </span>
               </div>
               <span>{moment(comment.createdAt).fromNow()}</span>
            </div>
         </div>
         {renderReply()}
      </span>
   );
});

CommentCard.displayName = 'CommentCard';
