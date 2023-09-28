import { PageWrapper, ProjectsHeader, ProjectsList } from '../components';

export const ProjectsPage = () => {
   return (
      <PageWrapper>
         <div className="bg-gray-100 w-full h-screen">
            <ProjectsHeader />
            <ProjectsList />
         </div>
      </PageWrapper>
   );
};
