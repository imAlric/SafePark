import React, { useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { AES } from "crypto-js";
import $ from "jquery";

//Componentes fixos.
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

//Componentes de reuso
import { ShowPassword } from "../assets/ts/showpass";

const Login = () => {
    //Controla as informações do formulário.
    const [FormData, setFormData] = useState({
        Email: "", Password: ""
    });

    const [Error, setError] = useState<any>({
        Login: false
    })

    //Atualiza as informações do formulário quando o usuário digita.
    const FormHandler = (e: any) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            [e.target.name]: e.target.value
        }))
    }

    //Envia as informações do formulário por AJAX.
    const submitHandler = (e: any) => {
        e.preventDefault();
        $.post("http://"+window.location.hostname+":8000/src/php/login.php", {
            email: FormData.Email,
            password: FormData.Password
        }, (response) => {
            var jsonData = JSON.parse(response);
            if (jsonData.success === 1) {
                Cookies.set('UID', AES.encrypt(JSON.stringify(jsonData.id), jsonData.password).toString(), { expires: 2 });
                Cookies.set('PLVL', AES.encrypt(JSON.stringify(jsonData.permlevel), jsonData.password).toString(), { expires: 2 });
                Cookies.set('UFN', AES.encrypt(JSON.stringify(jsonData.fullname).replace(/"/g, ''), jsonData.password).toString(), { expires: 2 });
                Cookies.set('AESP', jsonData.password, { expires: 2 });
                window.location.href = "/";
            } else {
                setError({Login: true});
                $('input, button').addClass('invalid');
            }
        })
    }

    return (
        <>
            <Navbar />
            <main>
                <form onSubmit={submitHandler}>
                    <div className="container main--container form--container">
                        <h4 className="text-center mt-4" style={{ fontWeight: "bold" }}><i className="fa-regular fa-user"></i><br />LOGIN</h4>
                        <div className="d-flex align-items-center position-relative" style={{ height: "380px" }}>
                            <div className="container">
                                <div className="d-flex flex-column align-items-center">
                                    <label className="text-center" htmlFor="email">
                                        E-mail:
                                    </label>
                                    <input
                                        value={FormData.Email}
                                        onChange={FormHandler}
                                        autoComplete="off"
                                        type="email"
                                        name="Email"
                                        id="email"
                                        required
                                    />
                                    <br />
                                    <label className="text-center" htmlFor="password">
                                        Senha:
                                    </label>
                                    <div className="position-relative">
                                        <input
                                            value={FormData.Password}
                                            onChange={FormHandler}
                                            autoComplete="off"
                                            type="password"
                                            name="Password"
                                            id="password"
                                            maxLength={12}
                                            required
                                        />
                                        <i onClick={() => ShowPassword("password")} id="showPass" className="bi bi-eye-slash showPass"></i>
                                    </div>
                                    <br />
                                    {
                                        Error.Login &&
                                        <div className="warning--alert text-center"><i className='fa-solid fa-triangle-exclamation'></i><br/>E-mail ou senha incorreto(a)!</div>
                                    }
                                    <br />
                                    <div className="d-flex flex-column">
                                        <button style={{ width: "150px" }}>Entrar</button>
                                        <br />
                                        <Link to="/" className="nav-link text-center" style={{ fontSize: "12px", color: "#2D81E3" }}><span>Esqueceu sua senha?</span></Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </main>
            <Footer />
        </>
    )
}

export default Login;