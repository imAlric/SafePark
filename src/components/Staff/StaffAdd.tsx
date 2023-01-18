import React, { useState, useCallback } from "react";
import ReactInputMask from "react-input-mask";
import { Modal, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import CryptoJS, { AES } from "crypto-js";
import $ from "jquery";

//Alerta de sucesso.
import { useToast } from "izitoast-react";
import "../../lib/izitoast/dist/css/iziToast.min.css";

//Funções.
import { CPFChecker } from "../../assets/ts/cpf";
import { LengthCheck } from "../../assets/ts/length";
import { ShowPassword } from "../../assets/ts/showpass";

const StaffAdd = ({ onInsert } : { onInsert: any }) => {
    //ID do usuário.
    const iduser = parseInt(AES.decrypt(Cookies.get('UID')!, Cookies.get('AESP')!).toString(CryptoJS.enc.Utf8));
    
    //Controla o modal.
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
        setError({ Found: false, InvalidCPF: false, InvalidPassword: false })
    };
    const handleShow = () => setShow(true);

    //Envia um callback para a página pai.
    const handlePageUpdate = useCallback((e: any) => { onInsert(e) }, [onInsert]);

    //Controla as informações do formulário.
    const [FormData, setFormData] = useState({
        Fullname: "", Email: "", Password: "", CPF: "", Role: ""
    });

    //Controla a checagem de funcionário já cadastrado ou CPF inválido.
    const [Error, setError] = useState({ Found: false, InvalidCPF: false, InvalidPassword: false });
    const ErrorWarn = () => {
        $('#button--add').addClass('warning--button shake-horizontal--anim');
        $('#button--add').html("<i class='fa-solid fa-circle-xmark'></i> Adicionar");
    };

    //Controla o aviso de sucesso.
    const Alert = useToast({
        title: "Sucesso!",
        message: "Funcionário inserido com sucesso!",
        layout:2,
        theme: "light",
        color: "green",
        icon: "fa-solid fa-check",
        position: "topCenter",
        displayMode:2,
        timeout:3000,
    });

    //Atualiza as informações do formulário quando o usuário digita.
    const FormHandler = (e: any) => {
        setFormData((prevFormData: any) => ({
            ...prevFormData,
            [e.target.name]: e.target.value
        }));

        if (e.target.name === 'CPF') !CPFChecker(e.target.value) ? $('#CPF').addClass('warning--input') : $('#CPF').removeClass('warning--input');

        if (e.target.name === 'Password') LengthCheck(e.target.value, 4, true) ? $('#password').removeClass('warning--input') : $('#password').addClass('warning--input');

        (Error.InvalidCPF || Error.Found || Error.InvalidPassword) && setError({ Found: false, InvalidCPF: false, InvalidPassword: false });
    };

    //Envia as informações do formulário por AJAX.
    const submitHandler = (e: any) => {
        e.preventDefault();

        if (!CPFChecker(FormData.CPF)) {
            setError({ ...Error, InvalidCPF: true });
            ErrorWarn();
            return;
        }

        if (FormData.Password && !LengthCheck(FormData.Password, 4, true)) {
            setError({ ...Error, InvalidPassword: true });
            ErrorWarn();
            return;
        }

        $.post("http://"+window.location.hostname+":8000/src/php/staff-crud.php", {
            FormData: FormData,
            UserID: iduser,
            Action: "create"
        }, (response) => {
            var jsonData = JSON.parse(response);
            if (jsonData.success === 0) {
                ErrorWarn();
                jsonData.found && setError({ ...Error, Found: true });
            } else {
                Alert();
                handlePageUpdate({ data: jsonData });
                //Reseta as informações do formulário para que o usuário possa inserir novas informações sem apagar
                //as anteriores ou atualizar a página.
                setFormData({
                    Email: "", Fullname: "", Password: "", CPF: "", Role: ""
                });
                //Fecha o modal.
                handleClose();
            }
        })
    }
    return (
        <div className="position-relative">
            <Link to="#" onClick={handleShow} className="staff--option text-center text-white text-decoration-none">
                <i className="fa-solid fa-circle-plus"></i> Cadastrar Funcionários
            </Link>

            <Modal className="modal" aria-labelledby="contained-modal-title-vcenter" centered show={show} onHide={handleClose}>
                <Modal.Header >
                    <Modal.Title className="mx-auto text-center fs-3">
                        <i className="fa-solid fa-user-tie position-relative" style={{ bottom: "-15px" }}></i>
                        <br />Cadastrar Funcionário
                        <p className="fs-6 fw-light">Insira um novo funcionário no sistema.</p>
                    </Modal.Title>
                </Modal.Header>
                <form onSubmit={submitHandler}>
                    <Modal.Body>
                        <div className="form--container d-flex align-items-center flex-column">
                            <div className="d-flex flex-column align-items-start mx-0">
                                <div className="row align-items-start mx-0 my-2">
                                    <div className="col">
                                        <OverlayTrigger placement="top" overlay={
                                            <Tooltip>
                                                <span className="required">* Obrigatório</span>
                                            </Tooltip>}>
                                        <label htmlFor="fullname">Nome completo: <span className="required-icon"><i className="bi bi-asterisk"></i></span></label>
                                        </OverlayTrigger>
                                        <br />
                                        <input
                                            value={FormData.Fullname}
                                            onChange={FormHandler}
                                            className="md"
                                            type="text"
                                            id="fullname"
                                            name="Fullname"
                                            autoComplete="off"
                                            maxLength={82}
                                            required
                                        />
                                    </div>
                                    <div className="col">
                                        <OverlayTrigger placement="top" overlay={
                                            <Tooltip>
                                                <span className="required">* Obrigatório</span>
                                            </Tooltip>}>
                                        <label htmlFor="CPF">CPF: <span className="required-icon"><i className="bi bi-asterisk"></i></span></label>
                                        </OverlayTrigger>
                                        <br />
                                        <ReactInputMask
                                            mask="999.999.999-99"
                                            maskChar={null}
                                            value={FormData.CPF}
                                            onChange={FormHandler}
                                            id="CPF"
                                            name="CPF"
                                            autoComplete="off"
                                            className="md"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="row align-items-start my-2 mx-0">
                                        <div className="col">
                                            <OverlayTrigger placement="top" overlay={
                                                <Tooltip>
                                                    <span className="required">* Obrigatório</span>
                                                </Tooltip>}>
                                            <label htmlFor="role">Cargo: <span className="required-icon"><i className="bi bi-asterisk"></i></span></label>
                                            </OverlayTrigger>
                                            <br />
                                            <select
                                                value={FormData.Role}
                                                onChange={FormHandler}
                                                className="md form-select custom--select text-start"
                                                id="role"
                                                name="Role"
                                                required
                                            >
                                            <option defaultValue="" className="d-none"></option>
                                            <option value="Operador de Sistema">Operador de Sistema</option>
                                            <option value="Manobrista">Manobrista</option>
                                            </select>
                                    </div>
                                </div>
                                {
                                (FormData.Role && FormData.Role !== 'Manobrista') &&
                                <div className="row align-items-start mx-0 my-2">
                                    <div className="col">
                                        <OverlayTrigger placement="top" overlay={
                                            <Tooltip>
                                                <span className="required">* Obrigatório</span>
                                            </Tooltip>}>
                                        <label htmlFor="email">E-mail: <span className="required-icon"><i className="bi bi-asterisk"></i></span></label>
                                        </OverlayTrigger>
                                        <br />
                                        <input
                                            value={FormData.Email}
                                            onChange={FormHandler}
                                            className="md"
                                            type="text"
                                            id="email"
                                            name="Email"
                                            autoComplete="off"
                                            maxLength={82}
                                            required
                                        />
                                    </div>
                                    <div className="col">
                                        <div className="position-relative">
                                            <OverlayTrigger placement="top" overlay={
                                                <Tooltip>
                                                    <span className="required">* Obrigatório</span>
                                                </Tooltip>}>
                                            <label htmlFor="password">Senha: <span className="required-icon"><i className="bi bi-asterisk"></i></span></label>
                                            </OverlayTrigger>
                                            <br />
                                            <input
                                                value={FormData.Password}
                                                onChange={FormHandler}
                                                className="md"
                                                type="password"
                                                id="password"
                                                name="Password"
                                                autoComplete="off"
                                                maxLength={12}
                                                required
                                            />
                                            <i onClick={() => ShowPassword("password")} id="showPass" className="bi bi-eye-slash showPass"></i>
                                        </div>
                                    </div>
                                </div>
                                }
                            </div>
                            {
                                Error.Found &&
                                <span id="found" className="warning--alert mt-3 text-center">
                                    <i className="fa-solid fa-triangle-exclamation"></i><br />O funcionário de CPF <strong>{FormData.CPF}</strong> já foi cadastrado.
                                </span>
                            }
                            {
                                Error.InvalidCPF &&
                                <span id="invalidcpf" className="warning--alert mt-3 text-center">
                                    <i className="fa-solid fa-triangle-exclamation"></i><br />O CPF <strong>{FormData.CPF}</strong> não é um CPF válido.
                                </span>
                            }
                            {
                                Error.InvalidPassword &&
                                <span id="invalidpassword" className="warning--alert mt-3 text-center">
                                    <i className="fa-solid fa-triangle-exclamation"></i><br />A senha precisa ser maior que <strong>4 dígitos</strong>.
                                </span>
                            }
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="button" variant="outline-light" onClick={handleClose}>
                            <i className="fa-solid fa-ban"></i> Cancelar
                        </Button>
                        <Button id="button--add" type="submit" variant="primary">
                            <i className="fa-solid fa-circle-plus"></i> Adicionar
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </div>
    )
}

export default StaffAdd;