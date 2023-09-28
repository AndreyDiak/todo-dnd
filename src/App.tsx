import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ProjectPage, ProjectsPage } from './pages';

import store from './redux/store';

const router = createBrowserRouter([
   {
      path: '/',
      element: <ProjectsPage />,
   },
   {
      path: '/projects/:projectId',
      element: <ProjectPage />,
   },
]);

function App() {
   return (
      <Provider store={store}>
         <RouterProvider router={router} />
      </Provider>
   );
}

export default App;
