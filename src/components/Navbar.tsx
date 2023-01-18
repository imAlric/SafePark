import React from "react";
import { Link, useLocation } from 'react-router-dom';
import Cookies from "js-cookie";
import CryptoJS, { AES } from "crypto-js";

//Componente de logout.
import Logout from "./Logout";

const Navbar = () => {
    //Recebe o status de login do usuário por Cookies.
    const login = Cookies.get('UID')! && AES.decrypt(Cookies.get('UID')!, Cookies.get('AESP')!).toString(CryptoJS.enc.Utf8);
    //Recebe o nível de permissão do usuário por Cookies.
    const permlevel = Cookies.get('PLVL')! && parseInt(AES.decrypt(Cookies.get('PLVL')!, Cookies.get('AESP')!).toString(CryptoJS.enc.Utf8));
    //Recebe o nome completo do usuário por Cookies.
    const fullname = Cookies.get('UFN') && AES.decrypt(Cookies.get('UFN')!, Cookies.get('AESP')!).toString(CryptoJS.enc.Utf8);
    //Reconhece a página atual do usuário.
    const location = useLocation();

    return (
        <nav className="navbar dark-bg">
            <div className="container-fluid">
                <Link to="/" className="nav-link">
                    <span className="navbar-brand me-3 h1 text-white" style={{ fontWeight: "bold" }}>SAFE PARK
                    </span>
                </Link>
                <ul className="navbar-nav me-auto">
                    <li className="nav-item">
                        <Link to="/" className="nav-link">
                            <span className="nav-link text-white" aria-current="page">
                                <i className="fa-solid fa-bars me-1"></i> Home
                            </span>
                        </Link>
                    </li>
                </ul>
                <ul className="navbar-nav ms-auto">
                {
                login
                ?
                <li className="nav-item dropdown position-relative">
                    <Link className="nav-link dropdown-toggle text-white" to="" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i className="fa-regular fa-circle-user"></i> {fullname!.split(' ')[0]}
                    </Link>
                    <ul className="dropdown-menu dropdown-menu-dark position-absolute dark-bg">
                        <li>
                            <Link className={location.pathname === "/movement" ? "dropdown-item nav--active" : "dropdown-item"} to="/movement"><i className='bx bx-move'></i> Movimentos</Link>
                        </li>
                        <li>
                            <Link className={location.pathname === "/vehicles" ? "dropdown-item nav--active" : "dropdown-item"}to="/vehicles"><i className='bx bx-car'></i> Veículos</Link>
                        </li>
                        <li>
                            <Link className={location.pathname === "/customers" ? "dropdown-item nav--active" : "dropdown-item"} to="/customers"><i className='bx bx-user'></i> Clientes</Link>
                        </li>
                        {permlevel >=1 && 
                        <>
                        <li>
                            <Link className={location.pathname === "/reports" ? "dropdown-item nav--active" : "dropdown-item"} to="/reports"><i className='bx bx-file'></i> Relatórios</Link>
                        </li>
                        <li>
                            <Link className={location.pathname === "/management" ? "dropdown-item nav--active" : "dropdown-item"} to="/management"><i className='bx bx-shield-quarter'></i> Gerenciamento</Link>
                        </li>
                        </>
                        }
                        {/* {permlevel >=2 && 
                        <li>
                            <Link className={location.pathname === "/admin" ? "dropdown-item nav--active" : "dropdown-item"} to="/admin"><i className='bx bx-line-chart'></i> Painel Admin</Link>
                        </li>
                        } 
                        <li>
                            <Link className={location.pathname === "/profile" ? "dropdown-item nav--active" : "dropdown-item"} to="/profile"><i className='bx bx-user-circle'></i> Perfil</Link>
                        </li> */}
                        <Logout />  
                    </ul>
                </li>
                :
                <li className="nav-item">
                    <Link to="/login" className="nav-link">
                        <span className="nav-link text-white" aria-current="page">
                            <i className="fa-solid fa-arrow-right-to-bracket me-1"></i> Entrar
                        </span>
                    </Link>
                </li>
                }
                </ul>
            </div>
        </nav>
    )
}

export default Navbar;