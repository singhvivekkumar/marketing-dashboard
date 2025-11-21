import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';

import './App.css';
import Errorpage from './pages/ErrorPage';
import Home from './pages/Home';

const appRouter = createBrowserRouter([
	{
		path: "/",
		element:<Home/>,
    errorElement: <Errorpage/>,
    children: [
      {
        path: "/",
        element:<div>ram</div>,
        errorElement: <Errorpage/>,
      },
      {
        path: "/",
        element:<div>end</div>,
        errorElement: <Errorpage/>,
      }
    ]
	}
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
