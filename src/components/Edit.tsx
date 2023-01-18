import React, { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import $ from "jquery";
import Cookies from "js-cookie";
import CryptoJS, { AES } from "crypto-js";

//Alerta de sucesso.
import { useToast } from "izitoast-react";
import "../lib/izitoast/dist/css/iziToast.min.css";

//Formulários de cada tabela.
import CompanyEdit from "./Company/CompanyEdit";
import CustomerEdit from "./Customer/CustomerEdit";
import VehicleEdit from "./Vehicle/VehicleEdit";
import StaffEdit from "./Staff/StaffEdit";

//Funções.
import { CPFChecker } from "../assets/ts/cpf";
import { CNPJChecker } from "../assets/ts/cnpj";
import { LengthCheck } from "../assets/ts/length";

const Edit = ( props:any ) => {
    //ID do usuário.
    const iduser = parseInt(AES.decrypt(Cookies.get('UID')!, Cookies.get('AESP')!).toString(CryptoJS.enc.Utf8));

    var type:any, msg:string, firstname:string | undefined, lastname:string | undefined, current:any; var data = {};

    //Controla qual informação está sendo alterada para mostrar no topo do modal e na mensagem de confirmação.
    type = props.type==='vehicle' ? 'Veículos' : props.type==='customer' ? 'Clientes' : props.type==='staff' ? 'Funcionários' : props.type==='company' ? 'Empresas' : null;
    msg = (type ? type.slice(0, -1) : null)+" alterado com sucesso!";

    //Controla o aviso de erro.
    const Alert = useToast({
        title: "Sucesso!",
        message: msg,
        layout:2,
        theme: "light",
        color: "green",
        icon: "fa-solid fa-check",
        position: "topCenter",
        displayMode:2,
        timeout:3000,
    });

    //Se editando funcionários ou clientes, inicialize as variaveis de nome e sobrenome.
    (props.type==='staff' || props.type==='customer') && (firstname = props.info.Fullname.split(' ')[0]) && (lastname = props.info.Fullname.split(' ')[1]);

    current = //Informação atual sendo editada.
    (props.type==='staff' || props.type==='customer') ? 
    firstname+' '+(lastname ? lastname : '') 
    : 
    props.type === 'vehicle' ? 
    props.info.Plate + ', ' + props.info.Model 
    : 
    props.type === 'company'?
    props.info.Fullname
    :
    null;

    data = //Dados atuais sendo editados.
    props.type==='vehicle' ? 
    { 
        id:props.info.ID, Plate:props.info.Plate, Model:props.info.Model, Color:props.info.Color, Type:props.info.Type 
    } : 
    props.type==='customer' ? 
    { 
        id:props.info.ID, Fullname:props.info.Fullname, CPF:props.info.CPF, Phone:props.info.Phone 
    } : 
    props.type === 'staff' ? 
    { 
        id:props.info.ID, Fullname:props.info.Fullname, Email:props.info.Email, Password:"", CPF:props.info.CPF, Role: props.info.Role 
    } : 
    props.type === 'company' ? 
    { 
        id:props.info.ID, Fullname:props.info.Fullname, CNPJ:props.info.CNPJ, Email:props.info.Email, Phone: props.info.Phone 
    } : 
    {};

    //Controla as informações e estados do formulário.
    const[FormData, setFormData] = useState<any>( data );
    const[Done, setDone] = useState(false);

    //Atualizar tabela após edição.
    const handlePageUpdate = useCallback((e:any) => {props.onEdit(e)}, [props.onEdit]); // eslint-disable-line react-hooks/exhaustive-deps

    //Controla a checagem de erro (item já encontrado).
    const[Error, setError] = useState({Found: false, InvalidCPF: false, InvalidCNPJ: false, InvalidPhone: false, InvalidPassword: false, InvalidPlaque: false});
    const ErrorWarn = () => {
        $('#button--edit').addClass('warning--button shake-horizontal--anim');
        $('#button--edit').html("<i class='fa-solid fa-circle-xmark'></i> Salvar");
    };

    //Atualiza as informações do formulário quando o usuário digita.
    const FormHandler = (e:any) => {
        setFormData((prevFormData:any) => ({
            ...prevFormData,
            [e.target.name]: e.target.value
        }));

        if(e.target.name === 'CPF') CPFChecker(e.target.value) ? $('#CPF').removeClass('warning--input') : $('#CPF').addClass('warning--input');

        if (e.target.name === 'CNPJ') CNPJChecker(e.target.value) ? $('#CNPJ').removeClass('warning--input') : $('#CNPJ').addClass('warning--input');

        if(e.target.name === 'Phone') LengthCheck(e.target.value.replace(/\D/g, ''), (props.type === 'company' ? 10 : 11), false) ? $('#phone').removeClass('warning--input') : $('#phone').addClass('warning--input');

        if(e.target.name === 'Password') LengthCheck(e.target.value, 4, true) ? $('#password').removeClass('warning--input') : $('#password').addClass('warning--input');
        
        if(e.target.name === 'Plate') LengthCheck(e.target.value.replace(/[^A-Z0-9]/g, ''), 7, false) ? $('#plate').removeClass('warning--input') : $('#plate').addClass('warning--input');

        (Error.InvalidCPF || Error.InvalidCNPJ || Error.InvalidPassword || Error.InvalidPhone  || Error.Found || Error.InvalidPlaque) 
        && setError({Found: false, InvalidCPF: false, InvalidCNPJ: false, InvalidPhone: false, InvalidPassword: false, InvalidPlaque: false});
    }

    //Envia as informações do formulário por AJAX.
    const submitHandler = (e:any) => {
        e.preventDefault();
            if(FormData.CPF && !CPFChecker(FormData.CPF)){ 
                setError({...Error, InvalidCPF: true})
                ErrorWarn();
                return; 
            }
            if(FormData.CNPJ && !CNPJChecker(FormData.CNPJ)) {
                setError({ ...Error, InvalidCNPJ: true });
                ErrorWarn();
                return;
            }
            if (FormData.Phone && !LengthCheck(FormData.Phone.replace(/[^0-9]/g, ''), (props.type === 'company' ? 10 : 11), false)){
                setError({ ...Error, InvalidPhone: true })
                ErrorWarn();
                return;
            }
            if (FormData.Password && !LengthCheck(FormData.Password, 4, true)){
                setError({ ...Error, InvalidPassword: true })
                ErrorWarn();
                return;
            }
            if(FormData.Plate && !LengthCheck(FormData.Plate.replace(/[^A-Z0-9]/g, ''), 7, false)){
                setError({ ...Error, InvalidPlaque: true })
                ErrorWarn();
                return;
            }
        $.post("http://"+window.location.hostname+":8000/src/php/"+props.url, {
            FormData:FormData,
            UserID: iduser,
            Action: 'edit',
        }, (response) => {
            var jsonData = JSON.parse(response);
            if (jsonData.success === 0){
                ErrorWarn();
                jsonData.found && setError({...Error, Found: true});
            }
            else {
                Alert();
                handlePageUpdate({data:jsonData});
                setDone(true);
                handleClose();
            }
        })
    }

    //Controla o modal.
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false); //Fecha o modal.
        setError({Found: false, InvalidCPF: false, InvalidCNPJ: false, InvalidPhone: false, InvalidPassword: false, InvalidPlaque: false}); //Atualiza o aviso de erro.
        setDone(false);//Reseta inputs do formulário.
    };
    const handleShow = () => setShow(true);;

    //Controla o reset dos inputs do formulário (reseta os inputs sempre que o modal é aberto ou fechado, considerando que uma edição bem sucedida não tenha sido feita).
    useEffect(() => {
        Done === false && setFormData( data );
    },[show]); // eslint-disable-line react-hooks/exhaustive-deps
    
    return(
    <>
        <Link to="#" className="purple--accent-color" onClick={handleShow}><i className='fa-regular fa-pen-to-square'></i></Link>

        <Modal className="modal" aria-labelledby="contained-modal-title-vcenter" centered show={show} onHide={handleClose}>
            <Modal.Header /* closeButton closeVariant="white" */>
                <Modal.Title className="mx-auto text-center fs-3"><i className="fa-regular fa-pen-to-square"></i><br />Editar { type }
                <p className="fs-6 fw-light">Atualmente editando: <span className="blue--accent-color"> { current } </span></p>
                </Modal.Title>
            </Modal.Header>
            <form onSubmit={submitHandler}>
            <Modal.Body>
                {
                    props.type === 'vehicle'
                    &&
                    <VehicleEdit 
                    FormData = { FormData } 
                    FormHandler = { FormHandler } 
                    InvalidPlaque = { Error.InvalidPlaque }
                    Found = { Error.Found }/>
                }
                {
                    props.type === 'customer'
                    &&
                    <CustomerEdit 
                    FormData = { FormData } 
                    FormHandler = { FormHandler } 
                    InvalidCPF = { Error.InvalidCPF } 
                    InvalidPhone = { Error.InvalidPhone }
                    Found = { Error.Found }/>
                }
                {
                    props.type === 'staff'
                    &&
                    <StaffEdit 
                    FormData = { FormData } 
                    FormHandler = { FormHandler } 
                    InvalidCPF = { Error.InvalidCPF }
                    InvalidPassword = { Error.InvalidPassword } 
                    Found = { Error.Found }/>
                }
                {
                    props.type === 'company'
                    &&
                    <CompanyEdit 
                    FormData = { FormData } 
                    FormHandler = { FormHandler } 
                    InvalidCNPJ = { Error.InvalidCNPJ } 
                    InvalidPhone = { Error.InvalidPhone }
                    Found = { Error.Found }/>
                }
            </Modal.Body>
            <Modal.Footer>
                <Button type="button" variant="outline-light" onClick={handleClose}>
                    <i className="fa-solid fa-ban"></i> Cancelar
                </Button>
                <Button id="button--edit" type="submit" variant="primary">
                    <i className="fa-solid fa-floppy-disk"></i> Salvar
                </Button>
            </Modal.Footer>
            </form>
        </Modal>
    </>
    );
}

export default Edit;