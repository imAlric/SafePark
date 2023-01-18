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

import { LengthCheck } from "../../assets/ts/length";

const VehicleAdd = ({ onInsert } : { onInsert: any }) => {
    //ID do usuário.
    const iduser = parseInt(AES.decrypt(Cookies.get('UID')!, Cookies.get('AESP')!).toString(CryptoJS.enc.Utf8));

    //Controla o modal.
    const [show, setShow] = useState(false);
    const handleClose = () => { setShow(false); setError({Found: false, InvalidPlate: false}) };
    const handleShow = () => setShow(true);

    //Envia um callback para a página pai.
    const handlePageUpdate = useCallback((e: any) => { onInsert(e) }, [onInsert]);

    //Controla as informações do formulário.
    const [FormData, setFormData] = useState({
        Model: "", Plate: "", Color: "", Type: ""
    });

    //Controla a checagem de veículo já cadastrado.
    const [Error, setError] = useState({Found: false, InvalidPlate: false});
    const ErrorWarn = () => {
        $('#button--add').addClass('warning--button shake-horizontal--anim');
        $('#button--add').html("<i class='fa-solid fa-circle-xmark'></i> Adicionar");
    };

    //Controla o aviso de sucesso.
    const Alert = useToast({
        title: "Sucesso!",
        message: "Veículo inserido com sucesso!",
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
        setFormData(prevFormData => ({
            ...prevFormData,
            [e.target.name]: e.target.value
        }));
        if(e.target.name === 'Plate') LengthCheck(e.target.value.replace(/[^A-Z0-9]/g, ''), 7, false) ? $('#plate').removeClass('warning--input') : $('#plate').addClass('warning--input');
        (Error.Found || Error.InvalidPlate) && setError({Found:false, InvalidPlate: false});
    };

    //Envia as informações do formulário por AJAX.
    const submitHandler = (e: any) => {
        e.preventDefault();
        if(FormData.Plate && !LengthCheck(FormData.Plate.replace(/[^A-Z0-9]/g, ''), 7, false)){
            setError({ ...Error, InvalidPlate: true })
            ErrorWarn();
            return;
        }
        $.post("http://"+window.location.hostname+":8000/src/php/vehicle-crud.php", {
            FormData: FormData,
            UserID: iduser,
            Action: "create"
        }, (response) => {
            var jsonData = JSON.parse(response);
            if (jsonData.success === 0) {
                ErrorWarn();
                jsonData.found && setError({...Error, Found: true});
            } else {
                Alert();
                handlePageUpdate({ data: jsonData });
                //Reseta as informações do formulário para que o usuário possa inserir novas informações sem apagar
                //as anteriores ou atualizar a página.
                setFormData({
                    Model: "", Plate: "", Color: "", Type: ""
                });
                //Fecha o modal.
                handleClose();
            }
        })
    }

    return (
        <div className="position-relative">
            <Link to="#" onClick={handleShow} className="vehicle--option text-center text-white text-decoration-none">
                <i className="fa-solid fa-circle-plus"></i> Cadastrar Veículos
            </Link>

            <Modal className="modal" aria-labelledby="contained-modal-title-vcenter" centered show={show} onHide={handleClose}>
                <Modal.Header >
                    <Modal.Title className="mx-auto text-center fs-3">
                        <i className="fa-solid fa-car position-relative" style={{ bottom: "-15px" }}></i>
                        <br />Cadastrar Veículo
                        <p className="fs-6 fw-light">Insira um novo veículo no sistema.</p>
                    </Modal.Title>
                </Modal.Header>
                <form onSubmit={submitHandler}>
                    <Modal.Body>
                        <div className="form--container d-flex flex-column align-items-center">
                            <div className="row align-items-start">
                                <div className="col">
                                    <OverlayTrigger placement="top"overlay={
                                        <Tooltip>
                                            Este é o <strong>MODELO</strong> do veículo, onde deve ser informado sua marca e nome. <br />
                                            <span className="text-muted">Ex: Chevrolet Onyx</span> <br />
                                            <span className="required">* Obrigatório</span>
                                        </Tooltip>}>
                                    <label htmlFor="model">Modelo: <span className="required-icon"><i className="bi bi-asterisk"></i></span></label>
                                    </OverlayTrigger>
                                    <br />
                                    <input
                                        value={FormData.Model}
                                        onChange={FormHandler}
                                        className="md"
                                        type="text"
                                        id="model"
                                        name="Model"
                                        autoComplete="off"
                                        maxLength={128}
                                        required
                                    />
                                    <br /><br />
                                    <OverlayTrigger placement="top"overlay={
                                        <Tooltip>
                                            Esta é a <strong>PLACA</strong> do veículo, onde deve ser informado a identificação do veículo. <br />
                                            <span className="required">* Obrigatório</span>
                                        </Tooltip>}>
                                    <label htmlFor="plate">Placa: <span className="required-icon"><i className="bi bi-asterisk"></i></span></label>
                                    </OverlayTrigger>
                                    <br />
                                    <ReactInputMask
                                        mask="aaa-9*99"
                                        maskChar={null}
                                        value={FormData.Plate.toUpperCase()}
                                        onChange={FormHandler}
                                        id="plate"
                                        name="Plate"
                                        autoComplete="off"
                                        className="sm"
                                        required
                                    />
                                </div>
                                <div className="col">
                                    <OverlayTrigger placement="top"overlay={
                                        <Tooltip>
                                            Esta é a <strong>COR</strong> do veículo, onde deve ser informado a pintura visível no veículo.<br />
                                            <span className="required">* Obrigatório</span>
                                        </Tooltip>}>
                                    <label htmlFor="color">Cor: <span className="required-icon"><i className="bi bi-asterisk"></i></span></label>
                                    </OverlayTrigger>
                                    <br />
                                    <input
                                        value={FormData.Color}
                                        onChange={FormHandler}
                                        className="sm"
                                        type="text"
                                        id="color"
                                        name="Color"
                                        autoComplete="off"
                                        maxLength={18}
                                        required
                                    />
                                    <br /><br />
                                    <OverlayTrigger placement="top"overlay={
                                        <Tooltip>
                                            Esta é a <strong>CATEGORIA</strong> do veículo, onde deve ser informado qual o tipo do veículo.<br />
                                            <span className="text-muted">Ex: SUV, Compacto, Sedan...</span> <br />
                                            <span className="required">* Obrigatório</span>
                                        </Tooltip>}>
                                    <label htmlFor="type">Categoria: <span className="required-icon"><i className="bi bi-asterisk"></i></span></label>
                                    </OverlayTrigger>
                                    <br />
                                    <input
                                        value={FormData.Type}
                                        onChange={FormHandler}
                                        className="sm"
                                        type="text"
                                        id="type"
                                        name="Type"
                                        autoComplete="off"
                                        maxLength={18}
                                        required
                                    />
                                </div>
                            </div>
                            {
                                Error.Found &&
                                <span id="found" className="warning--alert mt-3 text-center">
                                    <i className="fa-solid fa-triangle-exclamation"></i><br />O veículo de placa <strong>{FormData.Plate}</strong> já foi cadastrado.
                                </span>
                            }
                            {
                                Error.InvalidPlate &&
                                <span id="invalidplate" className="warning--alert mt-3 text-center">
                                    <i className="fa-solid fa-triangle-exclamation"></i><br />A placa <strong>{FormData.Plate}</strong> não é uma placa válida.
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

export default VehicleAdd;