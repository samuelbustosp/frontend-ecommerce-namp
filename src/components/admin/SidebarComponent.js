import { Sidebar } from "flowbite-react";
import { MdFilterList } from "react-icons/md";
import { CgLogOut } from "react-icons/cg";
import { IoMdHelpCircle, IoMdPricetag  } from "react-icons/io";
import { BiSolidCategory } from "react-icons/bi";
import { HiChartPie,HiShoppingBag} from "react-icons/hi";
import logoNav from "./assets/logo-side.png"
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";


const SidebarComponent = ({isOpen}) => {
    const navigate = useNavigate()
    const customTheme = {
        root: {
          base: 'bg-side',
          inner: 'bg-side'
        }
    } 

    const handleLogout = () => {
        localStorage.removeItem("token"); // Elimina el token 
        navigate('/home')
    };
    return ( 
        <div className="h-screen">
            <div className={`transition-all duration-300 ${isOpen ? 'w-64' : 'w-0'} overflow-hidden h-screen bg-side`}>
                <Sidebar theme={customTheme} aria-label="Sidebar with content separator example">
                    <Sidebar.Items>
                        <Sidebar.ItemGroup>
                            <Link to='/home'>
                                <img src={logoNav} alt="Logo navbar" className="w-24 ml-auto mr-auto rounded-xl my-4"></img>
                            </Link>
                        </Sidebar.ItemGroup>
                        <Sidebar.ItemGroup>
                        <Sidebar.Item href="/dashboard" icon={() => <HiChartPie className="text-white w-6 h-5" />} className="text-white hover:bg-black hover:bg-opacity-50">
                            Dashboard
                        </Sidebar.Item>
                        <Sidebar.Item href="/products" icon={() => <HiShoppingBag className="text-white w-6 h-5" />} className="text-white hover:bg-black hover:bg-opacity-50">
                            Productos
                        </Sidebar.Item>
                        <Sidebar.Item href="/categories" icon={() => <BiSolidCategory className="text-white w-6 h-5" />} className="text-white hover:bg-black hover:bg-opacity-50">
                            Categorias
                        </Sidebar.Item>
                        <Sidebar.Item href="/subcategories" icon={() => <MdFilterList className="text-white w-6 h-5" />} className="text-white hover:bg-black hover:bg-opacity-50">
                            Subcategorias
                        </Sidebar.Item>
                        <Sidebar.Item href="/combos" icon={() => <IoMdPricetag className="text-white w-6 h-5" />} className="text-white hover:bg-black hover:bg-opacity-50">
                            Combos
                        </Sidebar.Item>
                        </Sidebar.ItemGroup>
                        <Sidebar.ItemGroup>
                        <Sidebar.Item icon={() => <CgLogOut className="text-white w-6 h-5 cursor-pointer" onClick={handleLogout} />} className="text-white hover:bg-black hover:bg-opacity-50 cursor-pointer" onClick={handleLogout}>
                            Sign Out
                        </Sidebar.Item>
                        <Sidebar.Item href="#" icon={() => <IoMdHelpCircle className="text-white w-6 h-5" />} className="text-white hover:bg-black hover:bg-opacity-50">
                            Help
                        </Sidebar.Item>
                        </Sidebar.ItemGroup>
                    </Sidebar.Items>
                </Sidebar>
            </div>
        </div>
     );
}

SidebarComponent.propTypes = {
    isOpen: PropTypes.func.isRequired,
}
export default SidebarComponent;