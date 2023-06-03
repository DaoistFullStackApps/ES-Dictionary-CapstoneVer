import {createBrowserRouter} from "react-router-dom";
import Login from "./views/Login.jsx";
import Dictionary from "./views/Dictionary.jsx";
import Hero from "./views/Hero.jsx";
import Users from "./views/Users.jsx";


const router = createBrowserRouter([
	{
		path: '/login',
		element: <Login />	
	},
	{
		path: '/dictionary',
		element: <Dictionary />	
	},
	{
		path: '/hero',
		element: <Hero />	
	},
	{
		path: '/users',
		element: <Users />	
	},
])

export default router;