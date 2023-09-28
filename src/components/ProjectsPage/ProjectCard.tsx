import React from 'react';
import { Project } from '../../types';
import { Link } from 'react-router-dom';

interface Props {
   project: Project;
}

export const ProjectCard = ({ project }: Props) => {
   return (
      <Link
         to={`/projects/${project._id}`}
         className="bg-white py-2 px-4 rounded-md cursor-pointer hover:bg-red-50 min-w-[200px]"
      >
         <h2 className="text-xl text-gray-800 font-sans font-medium border-b-[1px] border-gray-200 mb-1 py-1">
            {project.header}
         </h2>
         <p className="text-gray-700 text-base font-sans">{project.description}</p>
         <p className="text-right text-gray-400">
            Осталось <span className="font-bold">{project?.tasks_ids?.length}</span> задач
         </p>
      </Link>
   );
};
