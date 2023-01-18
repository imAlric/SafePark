import React from "react";
import Cookies from "js-cookie";
import CryptoJS, { AES } from "crypto-js";
import { Link, useLocation } from "react-router-dom";

const Footer = () => {

    //Recebe o status de login do usuário por Cookies.
    const login = Cookies.get('UID')! && AES.decrypt(Cookies.get('UID')!, Cookies.get('AESP')!).toString(CryptoJS.enc.Utf8);
    //Recebe o nível de permissão do usuário por Cookies.
    const permlevel = Cookies.get('PLVL')! && parseInt(AES.decrypt(Cookies.get('PLVL')!, Cookies.get('AESP')!).toString(CryptoJS.enc.Utf8));
    //Reconhece a página atual do usuário.
    const location = useLocation();

    var Now = new Date();
    var CurrentYear = Now.getFullYear();

    return (
        <footer className="dark-bg">
            <div className="row align-items-center mx-5" style={{ height: "80px" }}>
                <div className="col text-center">
                    <ul className="navbar-nav">
                        <div className="d-flex">
                            <li>
                            <Link className="nav-link" to="/">
                                <span className={location.pathname === "/" ? "purple--accent-color" : "text-white"}>
                                <i className="fa-solid fa-angle-right"></i> home</span>
                            </Link>
                            </li>
                            {
                            login
                            ?
                            <div className="wrapper d-flex">
                                <li>
                                    <Link className="nav-link" to="/movement">
                                        <span className={location.pathname === "/movement" ? "purple--accent-color" : "text-white"}>
                                        <i className="fa-solid fa-angle-right"></i> movimentos</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link className="nav-link" to="/vehicles">
                                        <span className={location.pathname === "/vehicles" ? "purple--accent-color" : "text-white"}>
                                        <i className="fa-solid fa-angle-right"></i> veículos</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link className="nav-link" to="/customers">
                                        <span className={location.pathname === "/customers" ? "purple--accent-color" : "text-white"}>
                                        <i className="fa-solid fa-angle-right"></i> clientes</span>
                                    </Link>
                                </li>
                                {
                                permlevel >= 1 &&
                                <li>
                                    <Link className="nav-link" to="/management">
                                        <span className={location.pathname === "/management" ? "purple--accent-color" : "text-white"}>
                                        <i className="fa-solid fa-angle-right"></i> gerenciamento</span>
                                    </Link>
                                </li>
                                }
                            </div>
                            :
                            <li>
                                <Link className="nav-link" to="/login">
                                    <span className={location.pathname === "/login" ? "purple--accent-color" : "text-white"}>
                                    <i className="fa-solid fa-angle-right"></i> login</span>
                                </Link>
                            </li>
                            }
                        </div>
                    </ul>
                </div>
                <div className="col text-center">
                    <span className="navbar-brand mb-0 h1 text-white" style={{ fontWeight: "bold", fontSize: "20px" }}>SAFE PARK<br /></span><span>Todos os direitos reservados &copy; {CurrentYear}</span>
                </div>
                <div className="col">

                </div>
            </div>
        </footer>
    )
}

export default Footer;