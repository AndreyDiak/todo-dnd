import React, { useContext, useState } from 'react';
import { ModalContext } from '../../context/modalContext';
import { useProject } from '../../hooks';
import { CreateProjectDto } from '../../types';
import { Button } from '../common';

const PROJECT_DEFAULT_VALUE: CreateProjectDto = {
   description: '',
   header: '',
};

export const CreateProjectModal = React.memo(() => {
   const { createProject } = useProject();

   const { closeModal } = useContext(ModalContext);

   const [project, setProject] = useState<CreateProjectDto>(PROJECT_DEFAULT_VALUE);

   const handleCreate = () => {
      createProject(project);
      setProject(PROJECT_DEFAULT_VALUE);
      closeModal();
   };

   return (
      <div className="flex flex-col space-y-4">
         <input
            type="text"
            placeholder="Project header"
            value={project.header}
            onChange={(e) =>
               setProject((prev) => ({
                  ...prev,
                  header: e.target.value,
               }))
            }
            className="modalInput"
         />
         <input
            type="text"
            placeholder="Project description"
            value={project.description}
            onChange={(e) =>
               setProject((prev) => ({
                  ...prev,
                  description: e.target.value,
               }))
            }
            className="modalInput"
         />
         <Button onClick={handleCreate}>Создать</Button>
      </div>
   );
});

CreateProjectModal.displayName = 'CreateProjectModal';
