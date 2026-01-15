import { Stack } from '@mui/material'
import Header from '../components/Header'
import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer'

const Layout = () => {
	return (
		<Stack>
			{/* header */}
			<Header/>
			{/* feed */}
			<Outlet/>
			{/* footer */}
			<Footer/>
		</Stack>
	)
}

export default Layout;