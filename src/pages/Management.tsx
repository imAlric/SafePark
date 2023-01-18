import React from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import CryptoJS, { AES } from "crypto-js";
import $ from "jquery";

//Componentes fixos.
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Management = () => {
    //Recebe nível de permissão dos cookies.
    const permlevel = Cookies.get('PLVL')! && parseInt(AES.decrypt(Cookies.get('PLVL')!, Cookies.get('AESP')!).toString(CryptoJS.enc.Utf8));
    //Atalhos do teclado.
    (permlevel >= 1) && $(document.body).on('keyup', (e: JQuery.Event) => {
        ((e.shiftKey && e.altKey) && e.which === 70) && (window.location.href = "/staff");
        ((e.shiftKey && e.altKey) && e.which === 83) && (window.location.href = "/sectors");
        ((e.shiftKey && e.altKey) && e.which === 69) && (window.location.href = "/companies");
    });

    return (
        <>
            <Navbar />
            <main>
                <div className="main--container">
                    <h4 className="text-center mt-4 fw-bold">
                        <i className="fa-solid fa-user-shield"></i><br />GERENCIAMENTO
                    </h4>
                    <div className="d-flex align-items-center" style={{height:"300px"}}>
                        <div className="d-flex justify-content-center align-items-center" style={{flexFlow:"wrap",height:"100px"}}>
                            <Link to="/staff" className="custom--link"><i className="fa-solid fa-user-tie"></i> Funcionários</Link>
                            <Link to="/sectors" className="custom--link"><i className="fa-solid fa-square-parking"></i> Setores e Vagas</Link>
                            <Link to="/companies" className="custom--link"><i className="fa-solid fa-building"></i> Empresas</Link>   
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}

export default Management;