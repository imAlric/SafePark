import React, { useState, useCallback, useEffect } from "react";
import ReactInputMask from "react-input-mask";
import { Modal, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import CryptoJS, { AES } from "crypto-js";
import $ from "jquery";

//Alerta de sucesso.
import { useToast } from "izitoast-react";
import "../../lib/izitoast/dist/css/iziToast.min.css";

const SectorsAdd = ( { onInsert } : { onInsert:any }  ) => {
    //ID do usuário.
    const iduser = parseInt(AES.decrypt(Cookies.get('UID')!, Cookies.get('AESP')!).toString(CryptoJS.enc.Utf8));

    //Controla o modal.
    const [show, setShow] = useState(false);

    const handleClose = () => { setShow(false); setFound(false) };

    const handleShow = () => setShow(true);

    //Controla os erros.
    const [Found, setFound] = useState(false);
    const ErrorWarn = () => {
        $('#button--add').addClass('warning--button shake-horizontal--anim');
        $('#button--add').html("<i class='fa-solid fa-circle-xmark'></i> Adicionar");
    };

    //Controla o aviso de sucesso.
    const Alert = useToast({
        title: "Sucesso!",
        message: "Setor inserido com sucesso!",
        layout:2,
        theme: "light",
        color: "green",
        icon: "fa-solid fa-check",
        position: "topCenter",
        displayMode:2,
        timeout:3000,
    });

    //Controla as informações do formulário.
    const [FormData, setFormData] = useState({
        Name: "", Category: '', Quantity:""
    });

    //Envia um callback para a página pai.
    const handlePageUpdate = useCallback((e: any) => { onInsert(e) }, [onInsert]);

    //Atualiza as informações do formulário quando o usuário digita.
    const FormHandler = (e: any) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            [e.target.name]: e.target.value
        }));
        if(e.target.name === 'Quantity' && (e.target.value > 12 || e.target.value <= 0)) e.target.value = null;
        Found && setFound(false)
    };

    const [Options, setOptions] = useState([]);

    //Envia as informações do formulário por AJAX.
    const submitHandler = (e: any) => {
        e.preventDefault();
        $.post("http://"+window.location.hostname+":8000/src/php/sectors-crud.php", {
            FormData: FormData,
            UserID: iduser,
            Action: "create"
        }, (response) => {
            var jsonData = JSON.parse(response);
            if (jsonData.success === 0) {
                ErrorWarn();
                jsonData.found && setFound(true);
            } else {
                Alert();
                handlePageUpdate({ data: jsonData });
                //Reseta as informações do formulário para que o usuário possa inserir novas informações sem apagar
                //as anteriores ou atualizar a página.
                setFormData({
                    Name: "", Category: '', Quantity:""
                });
                //Fecha o modal.
                handleClose();
            }
        })
    }

    useEffect(() => {
        $.get("http://"+window.location.hostname+":8000/src/php/sectors-table.php", {Action:"categories"},
        (response) => {
            var jsonData = JSON.parse(response);
            if(jsonData.success !== 0){
                setOptions(jsonData);
            }
        });
    }, []);

    return(
        <div className="position-relative">
            <Link to="#" onClick={handleShow} className="sector--option text-center text-white text-decoration-none">
                <i className="fa-solid fa-circle-plus"></i> Cadastrar Setores
            </Link>

            <Modal className="modal" aria-labelledby="contained-modal-title-vcenter" centered show={show} onHide={handleClose}>
                <Modal.Header >
                    <Modal.Title className="mx-auto text-center fs-3">
                        <i className="fa-solid fa-square-parking position-relative" style={{ bottom: "-15px" }}></i>
                        <br />Cadastrar Setores
                        <p className="fs-6 fw-light">Insira um novo setor no sistema.</p>
                    </Modal.Title>
                </Modal.Header>
                <form onSubmit={submitHandler}>
                    <Modal.Body>
                        <div className="form--container d-flex flex-column align-items-center">
                            <div className="row align-items-start">
                                <div className="col">
                                        <label htmlFor="name">ID: 
                                            <OverlayTrigger placement="top"overlay={
                                                <Tooltip>
                                                    Este é o <strong>IDENTIFICADOR DO SETOR</strong>, deve ser utilizado uma letra {'(A-Z)'}. <br />
                                                    <span className="required">* Obrigatório</span>
                                                </Tooltip>}>
                                                <i className="fa-regular fa-circle-question i--tooltip"></i>  
                                            </OverlayTrigger>
                                            <span className="required-icon"><i className="bi bi-asterisk"></i></span>
                                        </label>
                                    <br />
                                    <ReactInputMask
                                        value={FormData.Name.toUpperCase()}
                                        onChange={FormHandler}
                                        mask="a"
                                        maskChar={null}
                                        className="sm-x"
                                        type="text"
                                        id="name"
                                        name="Name"
                                        autoComplete="off"
                                        required
                                    />  
                                    <br /><br />
                                        <label htmlFor="spots"> Vagas: 
                                            <OverlayTrigger placement="top"overlay={
                                                <Tooltip>
                                                    Esta é a <strong>QUANTIDADE</strong> de vagas do setor, deve ser colocado um valor de 1-12. <br />
                                                    <span className="required">* Obrigatório</span>
                                                </Tooltip>}>
                                                <i className="fa-regular fa-circle-question i--tooltip"></i>  
                                            </OverlayTrigger>
                                            <span className="required-icon"><i className="bi bi-asterisk"></i></span>
                                        </label>
                                    <br />
                                    <input 
                                        value={FormData.Quantity}
                                        onChange={FormHandler}
                                        className="sm-x"
                                        min={1}
                                        max={12}
                                        type="number" 
                                        id="quantity"
                                        name="Quantity"
                                        required
                                    />     
                                </div>
                                <div className="col">
                                    <label htmlFor="category">Categoria: 
                                        <OverlayTrigger placement="top"overlay={
                                            <Tooltip>
                                                Esta é a <strong>CATEGORIA</strong> do setor, identificando qual tipo de veículo irá ocupar as vagas deste setor. <br />
                                                <span className="required">* Obrigatório</span>
                                            </Tooltip>}>
                                            <i className="fa-regular fa-circle-question i--tooltip"></i> 
                                        </OverlayTrigger>
                                    <span className="required-icon"><i className="bi bi-asterisk"></i></span>
                                    </label>
                                    <br />
                                    <select
                                        value={FormData.Category}
                                        onChange={FormHandler}
                                        id="category"
                                        name="Category"
                                        className="form-select custom--select sm"
                                        required
                                    >
                                    <option defaultValue="" className="d-none"></option>
                                    { 
                                    Options.map((item: any, key:any) => {
                                        return(
                                        <option key={key} value={item.id}>
                                            {item.name}
                                        </option>
                                        )
                                        })
                                    }
                                    </select>
                                </div>
                            </div>
                            {
                                Found &&
                                <span id="found" className="warning--alert mt-3 text-center">
                                    <i className="fa-solid fa-triangle-exclamation"></i><br />O setor de identificação <strong>{FormData.Name.toUpperCase()}</strong> já foi cadastrado.
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

export default SectorsAdd;