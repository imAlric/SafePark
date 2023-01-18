import React, { useState } from "react";
import { Link } from "react-router-dom";
import ReactInputMask from "react-input-mask";
import { Modal, Button } from "react-bootstrap";
import $ from "jquery";
import Cookies from "js-cookie";
import CryptoJS, { AES } from "crypto-js";

//Alerta de sucesso.
import { useToast } from "izitoast-react";
import "../../lib/izitoast/dist/css/iziToast.min.css";

//Funções.
import { LengthCheck } from "../../assets/ts/length";
import { isEmpty } from "underscore";

const CarLink = ( props:any ) => {
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
            setFormData({Plate: ""});
            TableData && setTableData([]);
            setFoundData([]);
        },150);
    };
    const handleShow = () => setShow(true);

    //Controla os avisos de sucesso.
    const SuccessAlert = useToast({
        id:"alert",
        title: "Vinculado!",
        message: "Veículo vinculado com sucesso!",
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
        message: "Veículo desvinculado com sucesso!",
        layout:2,
        theme: "light",
        color: "red",
        icon: "fa-solid fa-link-slash",
        position: "topCenter",
        displayMode: 2,
        maxWidth:350,
        timeout:3000,
    });
    
    var firstname = props.current.split(' ')[0];
    var lastname = props.current.split(' ')[1];
    var current = firstname+' '+(lastname ? lastname : '');

    const [FormData, setFormData] = useState({ Plate: "" });
    const [FoundData, setFoundData] = useState<any>([]);
    const [TableData, setTableData] = useState([]);

    const [TableRender, setTableRender] = useState(false);
    const [Error, setError] = useState({notFound: false, Linked: false, noLinks:false});
    const [Loaded, setLoaded] = useState(true);

    const FormHandler = (e: any) => {
        setFormData((prevFormData: any) => ({
            ...prevFormData,
            [e.target.name]: e.target.value
        }));
        TableData && setTableData([]);
        if(e.target.name === 'Plate'){
            if(LengthCheck(e.target.value.replace(/[^A-Z0-9]/g, ''), 7, false)){
                $('#plate').removeClass('warning--input');
                $("#button-link").removeClass("link--success");
                setTableRender(true);
                setLoaded(false);
                $.get("http://"+window.location.hostname+":8000/src/php/vehicle-table.php", 
                { Action: "link-search", id:props.id, Plate:e.target.value.replace(/[^A-Z0-9]/g, '') }, 
                (response) => {
                    var jsonData = JSON.parse(response);
                    if(jsonData.success !== 0){
                        setTimeout(() => {
                            setError({notFound:false, Linked: false, noLinks:false})
                            setLoaded(true);
                            jsonData.idcustomer != null && setError({...Error, Linked:true});
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
                $('#plate').addClass('warning--input');
                setError({notFound:false, Linked: false, noLinks:false})
                setTableRender(false);
                setFoundData([]);
            }
        }
    };

    const linkHandler = (idcustomer:any, idvehicle:any) => {
        $.post("http://"+window.location.hostname+":8000/src/php/vehicle-crud.php",
        { Action: "link-update", UserID: iduser, idcustomer: idcustomer, idvehicle: idvehicle, idcurrent:props.id },
        (response) => {
            var jsonData = JSON.parse(response);
            if(jsonData.success === 1){
                jsonData.link === 1 && SuccessAlert();
                jsonData.unlink === 1 && DangerAlert();
                $.get("http://"+window.location.hostname+":8000/src/php/vehicle-table.php", 
                { Action: "link-search", id:props.id, Plate:jsonData.plate }, 
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
            $.get("http://"+window.location.hostname+":8000/src/php/vehicle-table.php",
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

    const unlinkHandler = (idvehicle:any) => {
        $.post("http://"+window.location.hostname+":8000/src/php/vehicle-crud.php",
        { Action: "link-unlink", UserID: iduser, idvehicle: idvehicle },
        (response) => {
            var jsonData = JSON.parse(response);
            if(jsonData.success === 1){
                DangerAlert();
                $.get("http://"+window.location.hostname+":8000/src/php/vehicle-table.php",
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
                        <span><i className="fa-solid fa-link"></i><br />Vincular Veículo</span> <br />
                        <p className="fs-6 fw-light">Vincular veículos ao cliente: <span className="blue--accent-color">{ current }</span></p>
                        {
                        !FormData.Plate &&
                        <span className="position-absolute fade-in--anim" style={{left:"-70px", top:"10px"}}>
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
                                <label htmlFor="plate">Pesquisar veículo: <span className="text-muted">{"(placa)"}</span></label>
                                <br />
                                <ReactInputMask
                                mask="aaa-9*99"
                                autoComplete="off"
                                maskChar={null} 
                                className="sm text-center"
                                value={FormData.Plate.toUpperCase()}
                                onChange={FormHandler}
                                name="Plate" 
                                required
                                id="plate"
                                type="text" 
                                />
                                </span>
                                }
                                {
                                TableRender ? 
                                Loaded ?
                                !isEmpty(FoundData) &&
                                <span className="d-flex justify-content-center fade-in--anim">
                                    <div className="vehicle-link--container mt-4">
                                        <div className="my-0 mb-3">
                                            <span className="fw-semibold">Modelo: </span>{FoundData.model}<br />
                                            <span className="fw-semibold">Placa: </span>{FoundData.plate.slice(0,3) + '-' + FoundData.plate.slice(3,7) }<br />
                                            <span className="fw-semibold">Cor: </span>{FoundData.color} <br />
                                            <span className="fw-semibold">Tipo: </span>{FoundData.type}
                                        </div>
                                        <button 
                                        id="button-link" 
                                        className={(FoundData.idcustomer ? "link--warning fade-in--anim" : "link--safe fade-in--anim")} 
                                        type="button" 
                                        onClick={e => linkHandler(FoundData.idcustomer, FoundData.id)}>
                                            { FoundData.idcustomer ? 
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
                                            Este cliente não tem nenhum veículo vinculado.
                                        </span>
                                    </div>
                                }
                                {
                                    Error.notFound &&
                                    <div className="d-flex w-100 justify-content-center align-items-center my-3">
                                        <span className="warning--alert"><i className="fa-solid fa-triangle-exclamation"></i><br />
                                            Nenhum veículo disponível de placa <strong>{ FormData.Plate }</strong> foi encontrado.
                                        </span>
                                    </div>
                                }
                                {
                                    Error.Linked &&
                                    <div className="d-flex w-100 flex-column justify-content-center align-items-center my-3">
                                        <span className="warning--alert"><i className="fa-solid fa-triangle-exclamation"></i><br />
                                            O veículo de placa <strong>{ FormData.Plate }</strong> já está vinculado a este cliente!<br />
                                        </span>
                                        <br />
                                        <span className="text-muted">
                                            Para desvincular, clique em '<i className="fa-solid fa-link-slash"></i> Desvincular' ou desmarque este veículo da lista de veículos vinculados.
                                        </span>
                                    </div>
                                }
                                {
                                (!FormData.Plate && !isEmpty(TableData)) &&
                                <div className="fade-in--anim vehicle-link--container" style={{width:"300px"}}>
                                    <span className="blue--accent-color"><i className="fa-solid fa-list-ul"></i><br />Veículos vinculados a este cliente:</span>
                                    {
                                        TableData.map((item:any, key:any) => {
                                            return(
                                                <div className="d-flex align-items-center text-start text-white mt-2" key={key}>
                                                    <i className="fa-solid fa-link-slash warning--accent-color me-2 fs-6 pointer--hover" onClick={e => unlinkHandler(item.id)}></i> 
                                                    { item.plate.slice(0,3)+"-"+item.plate.slice(3,7) }, { item.model } { item.color } 
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

export default CarLink;