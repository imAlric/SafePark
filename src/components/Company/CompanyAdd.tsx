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
import { CNPJChecker } from "../../assets/ts/cnpj";
import { LengthCheck } from "../../assets/ts/length";

const CompanyAdd = ({ onInsert } : { onInsert: any }) => {
    //ID do usuário.
    const iduser = parseInt(AES.decrypt(Cookies.get('UID')!, Cookies.get('AESP')!).toString(CryptoJS.enc.Utf8));

    //Controla o modal.
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
        setError({ Found: false, InvalidCNPJ: false, InvalidPhone: false })
    };
    const handleShow = () => setShow(true);

    //Envia um callback para a página pai.
    const handlePageUpdate = useCallback((e: any) => { onInsert(e) }, [onInsert]);

    //Controla as informações do formulário.
    const [FormData, setFormData] = useState({
        Fullname: "", CNPJ: "", Email: "", Phone: ""
    });

    //Controla a checagem de cliente já cadastrado ou CPF inválido.
    const [Error, setError] = useState({ Found: false, InvalidCNPJ: false, InvalidPhone: false });
    const ErrorWarn = () => {
        $('#button--add').addClass('warning--button shake-horizontal--anim');
        $('#button--add').html("<i class='fa-solid fa-circle-xmark'></i> Adicionar");
    };

    //Controla o aviso de sucesso.
    const Alert = useToast({
        title: "Sucesso!",
        message: "Empresa inserida com sucesso!",
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

        if (e.target.name === 'CNPJ') !CNPJChecker(e.target.value) ? $('#CNPJ').addClass('warning--input') : $('#CNPJ').removeClass('warning--input');

        if (e.target.name === 'Phone') LengthCheck(e.target.value.replace(/[^0-9]/g, ""), 10, false) ? $('#phone').removeClass('warning--input') : $('#phone').addClass('warning--input');

        (Error.InvalidCNPJ || Error.InvalidPhone || Error.Found) && setError({ Found: false, InvalidCNPJ: false, InvalidPhone: false });
    };

    //Envia as informações do formulário por AJAX.
    const submitHandler = (e: any) => {
        e.preventDefault();

        if (!CNPJChecker(FormData.CNPJ)) {
            setError({ ...Error, InvalidCNPJ: true });
            ErrorWarn();
            return;
        }

        if (!LengthCheck(FormData.Phone.replace(/[^0-9]/g, ''), 10, false)) {
            setError({ ...Error, InvalidPhone: true });
            ErrorWarn();
            return;
        }
        
        $.post("http://"+window.location.hostname+":8000/src/php/companies-crud.php", {
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
                handlePageUpdate({ data: jsonData } );
                //Reseta as informações do formulário para que o usuário possa inserir novas informações sem apagar
                //as anteriores ou atualizar a página.
                setFormData({
                    Fullname: "", CNPJ: "", Email: "", Phone: ""
                });
                //Fecha o modal.
                handleClose();
            }
        })
    }

    return (
        <div className="position-relative">
            <Link to="#" onClick={handleShow} className="customer--option text-center text-white text-decoration-none">
                <i className="fa-solid fa-circle-plus"></i> Cadastrar Empresas
            </Link>

            <Modal className="modal" aria-labelledby="contained-modal-title-vcenter" centered show={show} onHide={handleClose}>
                <Modal.Header >
                    <Modal.Title className="mx-auto text-center fs-3">
                        <i className="fa-solid fa-building position-relative" style={{ bottom: "-15px" }}></i>
                        <br />Cadastrar Empresa
                        <p className="fs-6 fw-light">Insira uma nova empresa no sistema.</p>
                    </Modal.Title>
                </Modal.Header>
                <form onSubmit={submitHandler}>
                    <Modal.Body>
                        <div className="form--container d-flex flex-column align-items-center">
                            <div className="row align-items-start">
                                <div className="col">
                                    <OverlayTrigger placement="top" overlay={
                                        <Tooltip>
                                            <span className="required">* Obrigatório</span>
                                        </Tooltip>}>
                                    <label htmlFor="fullname">Razão social: <span className="required-icon"><i className="bi bi-asterisk"></i></span></label>
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
                                    <br /><br />
                                    <OverlayTrigger placement="top" overlay={
                                        <Tooltip>
                                            <span className="required">* Obrigatório</span>
                                        </Tooltip>}>
                                    <label htmlFor="CNPJ">CNPJ: <span className="required-icon"><i className="bi bi-asterisk"></i></span></label>
                                    </OverlayTrigger>
                                    <br />
                                    <ReactInputMask
                                        mask="99.999.999/9991-99"
                                        maskChar={null}
                                        value={FormData.CNPJ}
                                        onChange={FormHandler}
                                        id="CNPJ"
                                        name="CNPJ"
                                        autoComplete="off"
                                        className="md"
                                        required
                                    />
                                </div>
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
                                    <br /><br />
                                    <OverlayTrigger placement="top" overlay={
                                        <Tooltip>
                                            <span className="required">* Obrigatório</span>
                                        </Tooltip>}>
                                    <label htmlFor="phone">Telefone: <span className="required-icon"><i className="bi bi-asterisk"></i></span></label>
                                    </OverlayTrigger>
                                    <br />
                                    <ReactInputMask
                                        mask="(99) 9999-9999"
                                        maskChar={null}
                                        value={FormData.Phone}
                                        onChange={FormHandler}
                                        className="md"
                                        type="text"
                                        id="phone"
                                        name="Phone"
                                        autoComplete="off"
                                        required
                                    />
                                </div>
                            </div>
                            {
                                Error.Found &&
                                <span id="found" className="warning--alert mt-3 text-center">
                                    <i className="fa-solid fa-triangle-exclamation"></i><br />A empresa de CNPJ <strong>{FormData.CNPJ}</strong> já foi cadastrada.
                                </span>
                            }
                            {
                                Error.InvalidCNPJ &&
                                <span id="invalidcnpj" className="warning--alert mt-3 text-center">
                                    <i className="fa-solid fa-triangle-exclamation"></i><br />O CNPJ <strong>{FormData.CNPJ}</strong> não é um CNPJ válido.
                                </span>
                            }
                            {
                                Error.InvalidPhone &&
                                <span id="invalidphone" className="warning--alert mt-3 text-center">
                                    <i className="fa-solid fa-triangle-exclamation"></i><br />O celular <strong>{FormData.Phone}</strong> não é um celular válido.
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

export default CompanyAdd;