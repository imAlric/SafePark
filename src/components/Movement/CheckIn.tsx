import React, { useEffect, useState, useCallback } from "react";
import ReactInputMask from "react-input-mask";
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import $ from "jquery";
import Cookies from "js-cookie";
import CryptoJS, { AES } from "crypto-js";

//Alerta de sucesso.
import { useToast } from "izitoast-react";
import "../../lib/izitoast/dist/css/iziToast.min.css";

//Objetos e funções.
import Now from "../../assets/ts/datetime";
import { LengthCheck } from "../../assets/ts/length";
import { CPFChecker } from "../../assets/ts/cpf";

const CheckIn = ({onInsert} : {onInsert:any}) => {
    //ID do usuário.
    const iduser = parseInt(AES.decrypt(Cookies.get('UID')!, Cookies.get('AESP')!).toString(CryptoJS.enc.Utf8));

    //Controla o modal.
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
        setError(clearError);
    };
    const handleShow = () => setShow(true);

    //Data e hora atual.
    var DateFunc:any = new Now();
    var CurrentDate = DateFunc.Date();
    var CurrentTime = DateFunc.Time();

    /* Controladores do form ------------------ */
    //Estágio inicial do formulário.
    const clearForm = {
        Model:"", Plate:"", Color:"", Type:"", 
        Customer:"", CPF:"", Company:"",
        Date: CurrentDate, Time: CurrentTime, 
        Sector:"", Spot:"", 
        Valet:""
    }

    //State do formulário.
    const [FormData, setFormData] = useState({
        Model:"", Plate:"", Color:"", Type:"", 
        Customer:"", CPF:"", Company:"",
        Date: CurrentDate, Time: CurrentTime, 
        Sector:"", Spot:"", 
        Valet:""
    });

    //Envia um callback para a página pai.
    const handlePageUpdate = useCallback((e: any) => { onInsert(e) }, [onInsert]);

    //Se o veículo já existe no banco.
    const [Found, setFound] = useState(false);

    //Controlador do formulário.
    const FormHandler = (e:any) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            [e.target.name]: e.target.value
        }));

        //Limpa os erros.
        setError(clearError);

        //Checa se a placa inserida já existe, se existir, auto-completa os inputs.
        /* Início */
        if(e.target.name === 'Plate') 
        if(LengthCheck(e.target.value.replace(/[^A-Za-z0-9]/g, ''), 7, false)){
            $('#plate').removeClass('warning--input');
            $.get("http://"+window.location.hostname+":8000/src/php/vehicle-table.php",
            { Action:"search", Status:"Active", filter:"Plate", search:e.target.value },
            (response:any) => {
                var jsonData = JSON.parse(response);
                if(jsonData.success !== 0){
                    jsonData.map((item:any) => {
                    DateFunc.DiffHours(new Date(CurrentDate+' '+item.entrytime), new Date(CurrentDate+' '+item.expectedexit)) <= 4 && PrioritySectorAlert()
                        return(
                            setFormData(prevFormData => ({
                                ...prevFormData,
                                Model: item.model,
                                Color: item.color,
                                Type: item.type,
                                Customer: item.customer ? item.customer : '',
                                Company: item.company ? item.company : ''
                            }))
                            );
                    })
                    setFound(true);
                }
            })
        } else {
            $('#plate').addClass('warning--input');
            Found && setFormData(prevFormData => ({...prevFormData, Model:"", Color:"", Type:"", Customer:"", CPF:"", Company:""}));
            Found && setFound(false);
        }
        /* Fim */

        //Checa se o CPF é válido.
        if (e.target.name === 'CPF') !CPFChecker(e.target.value) ? $('#CPF').addClass('warning--input') : $('#CPF').removeClass('warning--input');
    }

    //Controlador de envio por AJAX.
    const submitHandler = (e:any) => {
        e.preventDefault();
        /* Checa se há erros. */
        if(FormData.CPF && !CPFChecker(FormData.CPF)){
            setError({...Error, InvalidCPF:true}); return;
        };
        if(FormData.Plate && !LengthCheck(FormData.Plate.replace(/[^A-Za-z0-9]/g, ''), 7, false)){
            setError({...Error, InvalidPlate:true}); return;
        };
        /* Checa se há erros. */

        $.post("http://"+window.location.hostname+":8000/src/php/movements-crud.php",
        { Action: "checkin", FormData, UserID: iduser }, (response) => {
            var jsonData = JSON.parse(response);
            if(jsonData.success !== 0){
                jsonData.notSameCustomer && CPFAlert();
                setFormData(clearForm);
                setError(clearError);
                handleClose();
                handlePageUpdate(jsonData);
            } else {
                jsonData.movementActive && MovActiveAlert();
                jsonData.inactiveVehicle && InactiveVehicleAlert();
                jsonData.noPayment && noPaymentAlert();
                ErrorWarn();
            }
        });
    }
    /* Controladores do form ------------------ */

    /* Controladores de erro. */
    const clearError = ({InvalidCPF:false, InvalidPlate:false});
    const [Error, setError] = useState({InvalidCPF:false, InvalidPlate:false});

    //
    const ErrorWarn = () => {
        $('#button--add').addClass('warning--button shake-horizontal--anim');
        $('#button--add').html("<i class='fa-solid fa-circle-xmark'></i> Confirmar Entrada");
    };

    //Controla o aviso de CPF divergente do banco.
    const CPFAlert = useToast({
        title: "CPF conflitante!",
        message: "O CPF inserido não é o mesmo vinculado ao veículo! Prossiga com cuidado.",
        layout:2,
        theme: "light",
        color: "yellow",
        icon: "fa-solid fa-triangle-exclamation",
        position: "topCenter",
        displayMode:2,
        maxWidth:350,
        pauseOnHover:true,
        timeout:5000,
    });
    //
    const MovActiveAlert = useToast({
        title: "Movimento em andamento!",
        message: "O veículo de placa "+FormData.Plate+" ainda tem uma movimentação ativa!",
        layout:2,
        theme: "light",
        color: "red",
        icon: "fa-solid fa-car-on",
        position: "topCenter",
        displayMode:2,
        maxWidth:350,
        pauseOnHover:true,
        timeout:5000,
    });
    //
    const noPaymentAlert = useToast({
        title: "Pagamento não efetuado!",
        message: "Não foi registrado pagamento da mensalidade por parte do/a cliente/empresa vinculado ao veículo de placa "+FormData.Plate+"!",
        layout:2,
        theme: "light",
        color: "red",
        icon: "fa-solid fa-ban",
        position: "topCenter",
        displayMode:2,
        maxWidth:350,
        pauseOnHover:true,
        timeout:5000,
    });
    //
    const PrioritySectorAlert = useToast({
        title: "Veículo com baixo tempo de estadia!",
        message: "Este veículo é rotativo e tem um baixo tempo de estadia frequente.",
        layout:2,
        theme: "light",
        color: "yellow",
        icon: "fa-solid fa-clock",
        position: "topCenter",
        displayMode:2,
        maxWidth:350,
        pauseOnHover:true,
        timeout:5000,
    });
    //
    const InactiveVehicleAlert = useToast({
        title: "Veículo inativo!",
        message: "O veículo de placa "+FormData.Plate+" está inativo! Ative-o ou contate seu supervisor.",
        layout:2,
        theme: "light",
        color: "red",
        icon: "fa-solid fa-ban",
        position: "topCenter",
        displayMode:2,
        maxWidth:350,
        pauseOnHover:true,
        timeout:5000,
    });
    /* Controladores de erro. */

    /* Banco de dados ------------------ */
    const [Sectors, setSectors] = useState<any>([]);
    const [Spots, setSpots] = useState<any>([]);
    const [Valets, setValets] = useState<any>([]);
    
    //Recebe os dados de setores do banco.
    useEffect(() => {
        $.get("http://"+window.location.hostname+":8000/src/php/sectors-table.php",
        { Action: "sectors" }, (response) => {
            var jsonData = JSON.parse(response);
            if(jsonData.success !== 0){
                setSectors(jsonData);
            }
        })
    }, []);

    //Recebe os dados de vagas do setor selecionado do banco.
    useEffect(() => {
        FormData.Sector && $.get("http://"+window.location.hostname+":8000/src/php/sectors-table.php",
        {Action: "spots-available", idsector: FormData.Sector}, (response) => {
            var jsonData = JSON.parse(response);
            if(jsonData.success !== 0){
                setSpots(jsonData);
            } 
        });
    }, [FormData.Sector]);

    //Recebe os dados de manobristas do banco.
    useEffect(() => {
        $.get("http://"+window.location.hostname+":8000/src/php/staff-table.php", 
        { Action: "search", Status:"Active", filter: "Role", search:"Manobrista" }, (response) => {
            var jsonData = JSON.parse(response);
            if(jsonData.success !== 0){
                setValets(jsonData);
            }
        })
    }, []);
    /* Banco de dados------------------ */

    return(
        <>
        <Link to="#" onClick={handleShow} className="movement--option text-center text-white text-decoration-none">
                <i className="fa-solid fa-arrow-right-to-bracket"></i> Check-In
        </Link>
        <Modal className="modal modal--checkin" centered show={show} onHide={handleClose}>
            <Modal.Header>
                <Modal.Title className="mx-auto text-center"><i className="fa-solid fa-arrows-up-down-left-right"></i><br />Realizar <span className="fw-bold">Check-In</span></Modal.Title>
            </Modal.Header>
            <form onSubmit={submitHandler} method="post">
            <Modal.Body className="text-center form--container">
                <div className="row align-items-start">
                    <span className="custom--title mx-auto mb-3" style={{width:"470px"}}>
                        <i className="bi bi-car-front"></i><br /> Dados do Veículo
                    </span>
                    <div className="col" style={{width:"200px"}}>
                        <div className="d-flex flex-column align-items-start">
                            <label htmlFor="plate">Placa: <span className="required-icon"><i className="bi bi-asterisk"></i></span></label>
                            <ReactInputMask
                            value={FormData.Plate.toUpperCase()}
                            onChange={FormHandler}
                            type="text" 
                            name="Plate"
                            id="plate"
                            className="sm"
                            mask="aaa-9*99"
                            maskChar={null}
                            autoComplete="off"
                            required
                            tabIndex={0}
                            />
                        </div>
                    </div>
                    <div className="col" style={{width:"200px"}}>
                        <div className="d-flex flex-column align-items-start">
                            <label htmlFor="model">Modelo: <span className="required-icon"><i className="bi bi-asterisk"></i></span></label>
                            <input 
                            value={FormData.Model}
                            onChange={FormHandler}
                            readOnly={Found ? true : false}
                            type="text" 
                            name="Model"
                            id="model"
                            className="md"
                            autoComplete="off"
                            required
                            maxLength={128}
                            tabIndex={Found ? -1 : 0}
                            />
                        </div>
                    </div>
                    <div className="col" style={{width:"200px"}}>
                        <div className="d-flex flex-column align-items-start">
                            <label htmlFor="color">Cor: <span className="required-icon"><i className="bi bi-asterisk"></i></span></label>
                            <input 
                            value={FormData.Color}
                            onChange={FormHandler}
                            readOnly={Found ? true : false}
                            type="text" 
                            id="color"
                            name="Color"
                            className="sm"
                            autoComplete="off"
                            required
                            maxLength={18}
                            tabIndex={Found ? -1 : 0}
                            />
                        </div>
                    </div>
                </div>
                <div className="row align-items-start mt-3">
                    <div className="col">
                        <div className="d-flex flex-wrap">
                            <div className="d-flex flex-column me-2 align-items-start">
                                <label htmlFor="type">Tipo: <span className="required-icon"><i className="bi bi-asterisk"></i></span></label>
                                <input
                                value={FormData.Type}
                                onChange={FormHandler}
                                readOnly={Found ? true : false}
                                className="sm"
                                type="text"
                                id="type"
                                name="Type"
                                autoComplete="off"
                                tabIndex={Found ? -1 : 0}
                                maxLength={18}
                                required
                                />
                            </div>
                            {
                            FormData.Customer &&
                            <>
                                <div className="d-flex flex-column fade-in--anim position-relative ms-3 me-2 align-items-start">
                                    <label htmlFor="customer">Cliente: <span className="required-icon"><i className="bi bi-asterisk"></i></span></label>
                                    <input
                                    value={FormData.Customer}
                                    onChange={FormHandler}
                                    className="sm pe-4"
                                    type="text"
                                    id="customer"
                                    name="Customer"
                                    autoComplete="off"
                                    tabIndex={-1}
                                    readOnly
                                    required
                                    />
                                    <i className="bx bx-lock warning--accent-color position-absolute" style={{right:"6px", top:"34px"}}></i>
                                </div>
                            {
                                FormData.Company &&
                            <div className="d-flex flex-column fade-in--anim position-relative ms-3 me-2 align-items-start">
                                <label htmlFor="company">Empresa: <span className="required-icon"><i className="bi bi-asterisk"></i></span></label>
                                <input
                                value={FormData.Company}
                                onChange={FormHandler}
                                className="sm pe-4"
                                type="text"
                                id="company"
                                name="Company"
                                autoComplete="off"
                                tabIndex={-1}
                                readOnly
                                required
                                />
                                <i className="bx bx-lock warning--accent-color position-absolute" style={{right:"6px", top:"34px"}}></i>
                            </div>
                            }
                                <div className={"d-flex flex-column fade-in--anim align-items-start " + (FormData.Company ? "mt-3" : "ms-3 me-2")}>
                                    <label htmlFor="CPF">CPF: </label>
                                    <ReactInputMask
                                    mask="999.999.999-99"
                                    maskChar={null}
                                    value={FormData.CPF}
                                    onChange={FormHandler}
                                    className="sm"
                                    type="text"
                                    id="CPF"
                                    name="CPF"
                                    autoComplete="off"
                                    tabIndex={0}
                                    />
                                </div>
                            </>
                            }
                        </div>
                    </div>
                </div>
                <div className="row align-items-start mt-4">
                    <div className="col" style={{maxWidth:"250px"}}>
                        <p className="custom--title"><i className="bi bi-calendar3 me-1"></i><i className="ms-1 bi bi-clock"></i><br /> Horário de Entrada <span className="required-icon"><i className="bi bi-asterisk"></i></span></p>
                        <div className="d-flex">
                            <div className="position-relative">
                            <input 
                            value={FormData.Date}
                            type="date" 
                            id="date"
                            name="Date" 
                            className="sm me-1 px-0"
                            style={{textIndent:"3px"}}
                            tabIndex={-1} 
                            readOnly
                            required
                            />
                            <i className="bx bx-lock warning--accent-color position-absolute" style={{right:"10px", top:"10px"}}></i>
                            </div>
                            <input 
                            value={FormData.Time}
                            onChange={FormHandler}
                            type="time" 
                            id="time"
                            name="Time" 
                            className="sm ms-1"
                            required
                            />
                        </div>
                    </div>
                    <div className="col" style={{maxWidth:"250px"}}>
                        <p className="custom--title"><i className="fa-regular fa-flag"></i><br /> Setor e Vaga <span className="required-icon"><i className="bi bi-asterisk"></i></span></p>
                        <div className="d-flex justify-content-center">
                            <select 
                            value={FormData.Sector}
                            onChange={FormHandler}
                            name="Sector" 
                            id="sector"
                            className="form-select custom--select sm-x me-1"
                            required
                            >
                            <option defaultValue="" className="d-none"></option>
                            {Sectors.map((item:any, key:any) => {
                                return(<option key={key} value={item.id}>{item.name}</option>)
                            })}
                            </select>
                            {
                            FormData.Sector &&
                            <select 
                            value={FormData.Spot}
                            onChange={FormHandler}
                            name="Spot" 
                            id="spot"
                            className="form-select custom--select sm-x ms-1"
                            required
                            >
                            <option defaultValue="" className="d-none"></option>
                            {Spots.map((item:any, key:any) => {
                                return(<option key={key} value={item.id}>{item.number}</option>)
                            })}
                            </select>
                            }
                        </div>
                    </div>
                </div>
                <div className="row align-items-start mt-4" style={{maxWidth:"250px"}}>
                    <div className="col">
                    <p className="custom--title"><i className="fa-solid fa-person"></i><br /> Manobrista Responsável</p>
                        <div className="d-flex justify-content-center">
                            <select 
                            value={FormData.Valet}
                            onChange={FormHandler}
                            name="Valet" 
                            id="valet"
                            className="form-select w-100 custom--select"
                            >
                            <option defaultValue="" className="d-none"></option>
                            {Valets.map((item:any, key:any) => {
                                return(<option key={key} value={item.id}>{item.fullname}</option>)
                            })}
                            </select>
                        </div>
                    </div>
                </div>
                {
                Error.InvalidCPF &&
                <div className="row mx-1">
                    <span id="invalidcpf" className="warning--alert mt-3 text-center">
                    <i className="fa-solid fa-triangle-exclamation"></i><br />O CPF <strong>{FormData.CPF}</strong> não é um CPF válido.
                    </span>
                </div>
                }
                {
                Error.InvalidPlate &&
                <div className="row mx-1">
                    <span id="invalidplate" className="warning--alert mt-3 text-center">
                        <i className="fa-solid fa-triangle-exclamation"></i><br />A placa <strong>{FormData.Plate}</strong> não é uma placa válida.
                    </span>
                </div>
                }
            </Modal.Body>
            <Modal.Footer>
                <Button type="button" tabIndex={0} variant="outline-light" onClick={handleClose}>
                    <i className="fa-solid fa-ban"></i> Cancelar
                </Button>
                <Button id="button--add" tabIndex={0} type="submit" variant="primary">
                    <i className="fa-solid fa-arrow-right-to-bracket"></i> Confirmar Entrada
                </Button>
            </Modal.Footer>
            </form>
        </Modal>
        </>
    )
}

export default CheckIn;