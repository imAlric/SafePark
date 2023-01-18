import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import $ from 'jquery';
import Cookies from "js-cookie";
import CryptoJS, { AES } from "crypto-js";

//Alerta de sucesso.
import { useToast } from "izitoast-react";
import "../../lib/izitoast/dist/css/iziToast.min.css";

const Cancel = (props:any) => {
    const iduser = parseInt(AES.decrypt(Cookies.get('UID')!, Cookies.get('AESP')!).toString(CryptoJS.enc.Utf8));

    //Controla o modal.
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handlePageUpdate = useCallback((e:any) => {props.onUpdate(e)}, [props.onUpdate]); // eslint-disable-line react-hooks/exhaustive-deps

    //Controla o aviso de erro.
    const Alert = useToast({
        title: "Cancelado!",
        message: "Movimento cancelado com sucesso!",
        layout:2,
        theme: "light",
        color: "red",
        icon: "fa-solid fa-ban",
        position: "topCenter",
        displayMode:2,
        timeout:3000,
    });

    const submitHandler = (e:any) => {
        e.preventDefault();
        $.post("http://"+window.location.hostname+":8000/src/php/movements-crud.php",
        { Action: "cancel", id:props.id, UserID: iduser },
        (response) => {
            var jsonData = JSON.parse(response);
            Alert();
            handlePageUpdate(jsonData);
            handleClose();
        }) 
    }

    return(
        <>
            <Link to="#" onClick={handleShow} className="purple--accent-color position-relative mx-1">
                <i className="fa-solid fa-ban" style={{top:"2px"}}></i>
            </Link>

            <Modal className="modal modal--customer-exit" aria-labelledby="contained-modal-title-vcenter" centered show={show} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title className="mx-auto text-center"><i className="fa-solid fa-triangle-exclamation warning--accent-color"></i><br />Cancelar Movimento</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">Tem certeza que deseja cancelar esta movimentação?</Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-light" onClick={handleClose}>
                    <i className="fa-solid fa-xmark"></i> Não
                    </Button>
                    <Button className="warning--button" onClick={submitHandler}>
                    <i className="fa-solid fa-ban"></i> Sim
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Cancel;