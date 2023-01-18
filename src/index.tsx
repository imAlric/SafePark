import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import $ from "jquery";
import Cookies from "js-cookie";
import CryptoJS, { AES } from "crypto-js";

//Sass
import "../src/assets/sass/style.scss";

//Páginas
import Home from "./pages/Home";
import Login from "./pages/Login";
//Permissão 0
import Movement from "./pages/Movement";
import Vehicles from "./pages/Vehicles";
import Customers from "./pages/Customers";
//Permissão 1
import Management from "./pages/Management";
import Staff from "./pages/Staff";
import Sectors from "./pages/Sectors";
import Companies from "./pages/Companies";
import Reports from "./pages/Reports";
//Páginas de erro.
import NotFound from "./pages/404";

//Identifica o elemento raíz da página.
const root = ReactDOM.createRoot(document.getElementById('root')!);
//Recebe o status de login do usuário por Cookies.
const login = Cookies.get('UID')! && AES.decrypt(Cookies.get('UID')!, Cookies.get('AESP')!).toString(CryptoJS.enc.Utf8);
//Recebe o nível de permissão do usuário por Cookies.
const permlevel = Cookies.get('PLVL')! && parseInt(AES.decrypt(Cookies.get('PLVL')!, Cookies.get('AESP')!).toString(CryptoJS.enc.Utf8));

//Atalhos do teclado.
login && $(document.body).on('keyup', (e: JQuery.Event) => {
    e.preventDefault();
    ((e.shiftKey && e.altKey) && e.which === 77) && (window.location.href = "/movement");
    ((e.shiftKey && e.altKey) && e.which === 86) && (window.location.href = "/vehicles");
    ((e.shiftKey && e.altKey) && e.which === 67) && (window.location.href = "/customers");
    if(permlevel >= 1)
    {
    ((e.shiftKey && e.altKey) && e.which === 82) && (window.location.href = "/reports");
    ((e.shiftKey && e.altKey) && e.which === 71) && (window.location.href = "/management");
    }   
    permlevel >= 2 && 
    ((e.shiftKey && e.altKey) && e.which === 65) && (window.location.href = "/admin");
});

root.render(
    //Controla as rotas e as páginas acessíveis por URL.
    <BrowserRouter>
        <Routes>
            {/* Páginas */}
            <Route path="/" element={ <Home/> } />
            { 
            login ?
            <>
            <Route path="/movement" element={ <Movement/> } />
            <Route path="/vehicles" element={ <Vehicles/> } />
            <Route path="/customers" element={ <Customers/> } />
                { 
                permlevel >= 1 && 
                <>
                    <Route path="/management" element={ <Management/> } />
                    <Route path="/staff" element={ <Staff/> } />
                    <Route path="/sectors" element={ <Sectors/> } />
                    <Route path="/companies" element={ <Companies/> } />
                    <Route path="/reports" element={ <Reports/> } />
                </>
                }
            </> :
            <Route path="/login" element={ <Login/> } />
            }

            {/* Erro 404 */}
            <Route path='*' element={<NotFound />}/>
        </Routes>
    </BrowserRouter>
)