import { useProjects } from '../../hooks';
import { ProjectCard } from './ProjectCard';

export const ProjectsList = () => {
   const { projects } = useProjects();

   if (projects.length === 0) {
      return <h2>Создайте первый проект!</h2>;
   }

   return (
      <div className="flex flex-row flex-1 gap-4 max-w-7xl justify-center sm:justify-start px-4 md:px-10 flex-wrap mx-auto">
         {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
         ))}
      </div>
   );
};
