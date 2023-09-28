import { useProjects } from '../../hooks';
import { ProjectCard } from './ProjectCard';

export const ProjectsList = () => {
   const { projects } = useProjects();

   return (
      <div className="flex flex-row gap-4 max-w-7xl px-10 flex-wrap mx-auto">
         {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
         ))}
      </div>
   );
};
