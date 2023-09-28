import React, { KeyboardEvent, useState } from 'react';
import { useComments, useComment } from '../../../../hooks';
import { Comment } from '../../../../types';
import { CommentCard } from './CommentCard';

interface Props {
   taskId: string;
}

export const CommentsList = React.memo(({ taskId }: Props) => {
   const { comments } = useComments(taskId);
   const { createComment } = useComment();

   const [text, setText] = useState('');
   const [isReplying, setIsReplying] = useState(false);
   const [replyingTo, setReplyingTo] = useState<Comment | null>(null);

   const handerCreate = () => {
      createComment(taskId, {
         text,
         isReply: isReplying,
         _headCommentId: replyingTo ? replyingTo._id : undefined,
      });
      setText('');
      setIsReplying(false);
      setReplyingTo(null);
   };

   const handleCreateClick = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== 'Enter') {
         return;
      }
      handerCreate();
   };

   const replyHandler = (comment: Comment) => {
      setIsReplying(true);
      setReplyingTo(comment);
   };

   const renderComments = () => {
      if (comments.length === 0) {
         return null;
      }

      return (
         <div className="flex flex-col space-y-3 py-2 max-h-[200px] overflow-auto">
            {comments.map((comment) => (
               <CommentCard
                  key={comment._id}
                  comment={comment}
                  replyHandler={replyHandler}
                  taskId={taskId}
               />
            ))}
         </div>
      );
   };

   return (
      <div>
         {renderComments()}
         <div className={`bg-gray-200 rounded-lg ${isReplying ? 'pt-2 px-4' : ''}`}>
            {isReplying && (
               <span className="flex justify-between border-b-[1px] border-gray-300 pb-2">
                  <span>{replyingTo?.text} </span>
                  <span
                     className="cursor-pointer hover:text-gray-800"
                     onClick={() => {
                        setIsReplying(false);
                        setReplyingTo(null);
                     }}
                  >
                     ✕
                  </span>
               </span>
            )}
            <span className="flex items-center justify-between relative">
               <input
                  type="text"
                  name=""
                  id=""
                  className="modalInput w-full"
                  placeholder={isReplying ? 'Ответьте на сообщение...' : 'Напишите комментарий'}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={handleCreateClick}
               />
               <span className="absolute right-2 text-2xl" onClick={handerCreate}>
                  &gt;
               </span>
            </span>
         </div>
      </div>
   );
});

CommentsList.displayName = 'CommentsList';
