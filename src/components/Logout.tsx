import React, { useState } from "react";
import { Modal, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

const LogoutModal = () => {
    //Controla o modal.
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //Controla o logout (Limpa o armezenamento local da máquina e redireciona para a página principal).
    const logout = () => {
        Cookies.remove('UID');
        Cookies.remove('AESP');
        Cookies.remove('PLVL');
        Cookies.remove('UFN');
        window.location.href="/";
    }

    return (
        <>
            <li><Link to="#" className="dropdown-item" onClick={handleShow}><i className='bx bx-log-out' style={{ position: "relative", top: "2px" }}></i> Sair</Link></li>

            <Modal className="modal modal--logout" aria-labelledby="contained-modal-title-vcenter" centered show={show} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title className="mx-auto text-center"><i className="fa-solid fa-triangle-exclamation"></i><br />Desconectar</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center"><i className="fa-regular fa-circle-user"></i><br/>Tem certeza que deseja sair da sua conta atual?</Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-light" onClick={handleClose}>
                    <i className="fa-solid fa-ban"></i> Cancelar
                    </Button>
                    <Button className="warning--button" onClick={logout}>
                    <i className="fa-solid fa-arrow-right-from-bracket"></i> Sair
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default LogoutModal;