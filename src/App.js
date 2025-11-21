import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';

import './App.css';

const appRouter = createBrowserRouter([
	{
		path: "/",
		element: <SignIn />,
	},
	{
		path: "/dashboard",
		element: <Layout />,
	},
]);

function App() {
  return (
    <RouterProvider router={appRouter}>
      <div>
        <Outlet/>
      </div>
    </RouterProvider>
  );
}

export default App;
