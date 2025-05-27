import { Outlet } from 'react-router-dom'
import Navbar from "./Navbar/Navbar"
import Sidebar from "./Sidebar/Sidebar"
import { ToastContainer } from 'react-toastify';

const Layout = () => {
    return (
        <>
            <ToastContainer />
            <Navbar />
            <hr />
            <div className="app-content">
                <Sidebar />
                <div style={{ flex: 1, padding: "1rem" }}>
                    <Outlet />
                </div>
            </div>
        </>
    )
}

export default Layout