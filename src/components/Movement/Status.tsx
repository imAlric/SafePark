import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import $ from 'jquery';
import Cookies from "js-cookie";
import CryptoJS, { AES } from "crypto-js";
import { Modal, Button } from "react-bootstrap";

//Alerta de sucesso.
import { useToast } from "izitoast-react";
import "../../lib/izitoast/dist/css/iziToast.min.css";

const Status = (props:any) => {
    const iduser = parseInt(AES.decrypt(Cookies.get('UID')!, Cookies.get('AESP')!).toString(CryptoJS.enc.Utf8));

    //Controla o modal.
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    var isActive = props.active === 'A' ? true : false;
    const [Enabled, setEnabled] = useState(isActive);

    const handlePageUpdate = useCallback((e:any) => {props.onUpdate(e)}, [props.onUpdate]); // eslint-disable-line react-hooks/exhaustive-deps

    //Controla o aviso de erro.
    const Alert = useToast({
        id:"alert",
        title: Enabled ? "Desativado!" : "Ativado!",
        message: Enabled ? "Desativado com sucesso!" : "Ativado com sucesso!",
        layout:2,
        theme: "light",
        color: Enabled ? "red" : "green",
        icon: Enabled ? "fa-solid fa-toggle-off" :"fa-solid fa-toggle-on",
        position: "topCenter",
        displayMode:2,
        maxWidth:250,
        timeout:3000,
    });

    const clearForm = { Motive:"", Description: "" };
    const [FormData, setFormData] = useState({ Motive:"", Description: "" });
    
    const FormHandler = (e: any) => {
        setFormData((prevFormData: any) => ({
            ...prevFormData,
            [e.target.name]: e.target.value
        }));
    }

    const stateHandler = (e:any) => {
        e.preventDefault();
        $.post("http://"+window.location.hostname+":8000/src/php/movements-crud.php",
        { Action: "status", status:(Enabled ? 'A' : 'I'), FormData: FormData,
        UserID: iduser, id:props.id },
        (response) => {
            var jsonData = JSON.parse(response);
            Alert();
            setEnabled(!Enabled);
            handlePageUpdate(jsonData);
        })
    }

    const submitHandler = (e:any) => {
        e.preventDefault();
        setFormData(clearForm);
        stateHandler(e);
        handleClose();
    }

    return(
    <>
    {
        <Link onClick={Enabled ? handleShow : stateHandler} to="#" className="purple--accent-color mx-1 position-relative" style={{top:"2px"}}>
            <i className={ "bi "+(Enabled ? "bi-toggle-on" : "bi-toggle-off text-muted")}></i>
        </Link>
        
    }
        <Modal className="modal modal--status" aria-labelledby="contained-modal-title-vcenter" centered show={show} onHide={handleClose}>
            <Modal.Header>
                <Modal.Title className="mx-auto text-center">
                    <i className="fa-solid fa-triangle-exclamation warning--accent-color"></i> <i className="fa-solid fa-toggle-off warning--accent-color"></i><br /> Desativar Movimento<br />
                    <p className="mx-5 fs-6 fw-lighter">Priorizando integridade, informe o motivo para a inativação do movimento.</p> 
                </Modal.Title>
            </Modal.Header>
            <form onSubmit={submitHandler}>
            <Modal.Body className="d-flex justify-content-center form--container">
                <div className="d-flex flex-column align-items-center">
                    <div className="d-flex flex-column align-items-start">
                        <label htmlFor="motive">Motivo: <span className="required-icon"><i className="bi bi-asterisk"></i></span></label>
                        <select 
                            value={FormData.Motive}
                            onChange={FormHandler}
                            id="motive"
                            name="Motive" 
                            className="form-select custom--select md me-1" 
                            required
                        >
                            <option defaultValue="" className="d-none"></option>
                            <option value="Problema/dano com/ao veículo">Problema/dano com/ao veículo</option>
                            <option value="Dados incongruentes">Dados incongruentes</option>
                            <option value="Fiscalização/Averiguação">Fiscalização/Averiguação</option>
                            <option value="Outro">Outro...</option>
                        </select>
                    </div>
                    <br />
                    <div className="d-flex flex-column align-items-start">
                        <label htmlFor="description">Descrição: <span className="text-muted">{"(opcional)"}</span></label>
                        <textarea 
                        value={FormData.Description}
                        onChange={FormHandler}
                        id="description" 
                        name="Description" 
                        maxLength={128} 
                        rows={5}
                        >
                        </textarea>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button type="button" variant="outline-light" onClick={handleClose}>
                    <i className="fa-solid fa-ban"></i> Cancelar
                </Button>
                <Button type="submit" className="warning--button">
                    <i className="fa-solid fa-toggle-off"></i> Desativar
                </Button>
            </Modal.Footer>
            </form>
        </Modal>
    </>
    )
}

export default Status;