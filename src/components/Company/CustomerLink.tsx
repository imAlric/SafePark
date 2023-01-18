import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import ReactInputMask from "react-input-mask";
import { isEmpty } from "underscore";
import Cookies from "js-cookie";
import CryptoJS, { AES } from "crypto-js";
import $ from "jquery";

//Alerta de sucesso.
import { useToast } from "izitoast-react";
import "../../lib/izitoast/dist/css/iziToast.min.css";

import { CPFChecker } from "../../assets/ts/cpf";

const CustomerLink = (props:any) => {
    //ID do usuário.
    const iduser = parseInt(AES.decrypt(Cookies.get('UID')!, Cookies.get('AESP')!).toString(CryptoJS.enc.Utf8));

    //Controla o modal.
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
        setTimeout(() =>{
            setTableRender(false);
            setLoaded(true);
            setError({notFound: false, Linked: false, noLinks:false});
            setFormData({CPF: ""});
            TableData && setTableData([]);
            setFoundData([]);
        },150);
    };
    const handleShow = () => setShow(true);

    //Controla os avisos de sucesso.
    const SuccessAlert = useToast({
        id:"alert",
        title: "Vinculado!",
        message: "Cliente vinculado com sucesso!",
        layout:2,
        theme: "light",
        color: "green",
        icon: "fa-solid fa-link",
        position: "topCenter",
        displayMode: 2,
        maxWidth:350,
        timeout:3000,
    });

    const DangerAlert = useToast({
        id:"alert",
        title: "Desvinculado!",
        message: "Cliente desvinculado com sucesso!",
        layout:2,
        theme: "light",
        color: "red",
        icon: "fa-solid fa-link-slash",
        position: "topCenter",
        displayMode: 2,
        maxWidth:350,
        timeout:3000,
    });

    const [FormData, setFormData] = useState({ CPF:"" });
    const [FoundData, setFoundData] = useState<any>([]);
    const [TableData, setTableData] = useState([]);

    const [TableRender, setTableRender] = useState(false);
    const [Error, setError] = useState({notFound: false, Linked: false, noLinks:false});
    const [Loaded, setLoaded] = useState(true);

    const FormHandler = (e:any) => {
        setFormData((prevFormData: any) => ({
            ...prevFormData,
            [e.target.name]: e.target.value
        }));
        TableData && setTableData([]);
        if(e.target.name === 'CPF'){
            if(CPFChecker(e.target.value.replace(/[^0-9]/g, ''))){
                $('#CPF').removeClass('warning--input');
                $("#button-link").removeClass("link--success");
                setTableRender(true);
                setLoaded(false);
                $.get("http://"+window.location.hostname+":8000/src/php/customers-table.php", 
                { Action: "link-search", id:props.id, CPF:e.target.value.replace(/[^0-9]/g, '') }, 
                (response) => {
                    var jsonData = JSON.parse(response);
                    if(jsonData.success !== 0){
                        setTimeout(() => {
                            setError({notFound:false, Linked: false, noLinks:false})
                            setLoaded(true);
                            jsonData.idcompany != null && setError({...Error, Linked:true});
                            setFoundData(jsonData);
                        },1000);
                    } else {
                        setTimeout(() => {
                            setError({...Error, notFound:true});
                            setTableRender(false)
                            setFoundData([]);
                        },1000);
                    }
                });
            } else {
                $('#CPF').addClass('warning--input');
                setError({notFound:false, Linked: false, noLinks:false})
                setTableRender(false);
                setFoundData([]);
            }
        }
    }
    const linkHandler = (idcompany:any, idcustomer:any) => {
        $.post("http://"+window.location.hostname+":8000/src/php/customers-crud.php",
        { Action: "link-update", UserID: iduser, idcompany: idcompany, idcustomer: idcustomer, idcurrent:props.id },
        (response) => {
            var jsonData = JSON.parse(response);
            if(jsonData.success === 1){
                jsonData.link === 1 && SuccessAlert();
                jsonData.unlink === 1 && DangerAlert();
                $.get("http://"+window.location.hostname+":8000/src/php/customers-table.php", 
                { Action: "link-search", id:props.id, CPF:jsonData.cpf }, 
                (response) => {
                    var jsonData = JSON.parse(response);
                    if(jsonData.success !== 0){
                        setError({notFound:false, Linked: false, noLinks:false})
                        setLoaded(true);
                        setFoundData(jsonData);
                    }
                });
            }
        })
    }

    const listHandler = () => {
        if(!isEmpty(TableData)){
            setTableData([])
        } else { 
            $.get("http://"+window.location.hostname+":8000/src/php/customers-table.php",
            { Action: "link-table", id: props.id },
            (response) => {
                var jsonData = JSON.parse(response);
                if(jsonData.success !== 0){
                    setTableData(jsonData);
                } else {
                    setError({...Error, noLinks:true});
                }
            }) 
        }
    }

    const unlinkHandler = (idcustomer:any) => {
        $.post("http://"+window.location.hostname+":8000/src/php/customers-crud.php",
        { Action: "link-unlink", UserID: iduser, idcustomer: idcustomer },
        (response) => {
            var jsonData = JSON.parse(response);
            if(jsonData.success === 1){
                DangerAlert();
                $.get("http://"+window.location.hostname+":8000/src/php/customers-table.php",
                { Action: "link-table", id: props.id },
                (response) => {
                    var jsonData = JSON.parse(response);
                    if(jsonData.success !== 0){
                        setTableData(jsonData);
                    } else {
                        setTableData([]);
                    }
                }) 
            }
        })
    }

    const submitHandler = (e:any) => {
        e.preventDefault();
    }

    return(
        <>
        <Link to="#" className="purple--accent-color" onClick={handleShow}><i className='fa-solid fa-link'></i></Link>

        <Modal className="modal modal--link" aria-labelledby="contained-modal-title-vcenter" centered show={show} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title className="mx-auto text-center form--container position-relative">
                        <span><i className="fa-solid fa-link"></i><br />Vincular Cliente</span> <br />
                        <p className="fs-6 fw-light">Vincular clientes à empresa: <span className="blue--accent-color">{ props.current }</span></p>
                        {
                        !FormData.CPF &&
                        <span className="position-absolute fade-in--anim" style={{left:"-40px", top:"10px"}}>
                            <button onClick={listHandler} className="fs-6" style={{width:"40px"}}><i className={ isEmpty(TableData) ? "fa-solid fa-list-ul" : "fa-solid fa-xmark" }></i></button>
                        </span>
                        }
                    </Modal.Title>
                </Modal.Header>
                <form onSubmit={submitHandler} method="post">
                <Modal.Body>
                    <div className="form--container d-flex flex-column align-items-center">
                        <div className="row align-items-start">
                            <div className="col text-center">
                                {
                                isEmpty(TableData) &&
                                <span className="fade-in--anim">
                                <label htmlFor="CPF">Pesquisar cliente: <span className="text-muted">{"(CPF)"}</span></label>
                                <br />
                                <ReactInputMask
                                mask="999.999.999-99"
                                autoComplete="off"
                                maskChar={null} 
                                className="sm text-center"
                                value={FormData.CPF}
                                onChange={FormHandler}
                                name="CPF" 
                                id="CPF"
                                required
                                type="text" 
                                />
                                </span>
                                }
                                {
                                TableRender ? 
                                Loaded ?
                                !isEmpty(FoundData) &&
                                <span className="d-flex justify-content-center fade-in--anim">
                                    <div className="customer-link--container mt-4">
                                        <div className="my-0 mb-3">
                                            <span className="fw-semibold">Nome: </span>{FoundData.fullname}<br />
                                            <span className="fw-semibold">CPF: </span>{ FoundData.cpf.slice(0, 3) + '.' + FoundData.cpf.slice(3, 6) + '.' + FoundData.cpf.slice(6, 9) + '-' + FoundData.cpf.slice(9, 11) }<br />
                                            <span className="fw-semibold">Celular: </span>{ '(' + FoundData.phone.slice(0, 2) + ') ' + FoundData.phone.slice(2, 7) + '-' + FoundData.phone.slice(7, 11) } <br />
                                        </div>
                                        <button 
                                        id="button-link" 
                                        className={(FoundData.idcompany ? "link--warning fade-in--anim" : "link--safe fade-in--anim")} 
                                        type="button" 
                                        onClick={e => linkHandler(FoundData.idcompany, FoundData.id)}>
                                            { FoundData.idcompany ? 
                                            <><i className="fa-solid fa-link-slash"></i> Desvincular</> : 
                                            <><i className="fa-solid fa-link"></i> Vincular</> }
                                        </button>
                                    </div>
                                </span>
                                :
                                <div className="fade-in--anim">
                                    <span className="loader mt-4"></span>
                                </div>
                                :
                                <></>
                                }
                                {
                                    Error.noLinks &&
                                    <div className="d-flex w-100 justify-content-center align-items-center my-3 mt-4">
                                        <span className="warning--alert"><i className="fa-solid fa-triangle-exclamation"></i><br />
                                            Esta empresa não tem nenhum cliente vinculado.
                                        </span>
                                    </div>
                                }
                                {
                                    Error.notFound &&
                                    <div className="d-flex w-100 justify-content-center align-items-center my-3">
                                        <span className="warning--alert"><i className="fa-solid fa-triangle-exclamation"></i><br />
                                            Nenhum cliente disponível de CPF <strong>{ FormData.CPF }</strong> foi encontrado.
                                        </span>
                                    </div>
                                }
                                {
                                    Error.Linked &&
                                    <div className="d-flex w-100 flex-column justify-content-center align-items-center my-3">
                                        <span className="warning--alert"><i className="fa-solid fa-triangle-exclamation"></i><br />
                                            O cliente de CPF <strong>{ FormData.CPF }</strong> já está vinculado a esta empresa!<br />
                                        </span>
                                        <br />
                                        <span className="text-muted">
                                            Para desvincular, clique em '<i className="fa-solid fa-link-slash"></i> Desvincular' ou desmarque este cliente da lista de clientes vinculados.
                                        </span>
                                    </div>
                                }
                                {
                                (!FormData.CPF && !isEmpty(TableData)) &&
                                <div className="fade-in--anim vehicle-link--container" style={{width:"300px"}}>
                                    <span className="blue--accent-color"><i className="fa-solid fa-list-ul"></i><br />Clientes vinculados a esta empresa:</span>
                                    {
                                        TableData.map((item:any, key:any) => {
                                            return(
                                                <div className="d-flex align-items-center text-start text-white mt-2" key={key}>
                                                    <i className="fa-solid fa-link-slash warning--accent-color me-2 fs-6 pointer--hover" onClick={e => unlinkHandler(item.id)}></i> 
                                                    { item.fullname  }
                                                    {" - "+item.cpf.slice(0, 3) + '.' + item.cpf.slice(3, 6) + '.' + item.cpf.slice(6, 9) + '-' + item.cpf.slice(9, 11) }
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                }
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" variant="outline-light" onClick={handleClose}>
                        <i className="fa-solid fa-right-from-bracket"></i> Fechar
                    </Button>
                </Modal.Footer>
                </form>
            </Modal>
        </>
    )
}

export default CustomerLink;