import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import CurrencyInput from "react-currency-input-field";
import Cookies from "js-cookie";
import CryptoJS, { AES } from "crypto-js";
import $ from "jquery";

//Objetos e funções.
import Now from "../../assets/ts/datetime";

const CheckOut = (props:any) => {
    //ID do usuário.
    const iduser = parseInt(AES.decrypt(Cookies.get('UID')!, Cookies.get('AESP')!).toString(CryptoJS.enc.Utf8));

    //Controla o modal.
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true);
    };

    //Envia um callback para a página pai.
    const handlePageUpdate = useCallback((e: any) => { props.onRemove(e) }, [props.onRemove]); // eslint-disable-line react-hooks/exhaustive-deps

    //Alertas de erro.
    const ErrorWarn = () => {
        $('#button--checkout').addClass('warning--button shake-horizontal--anim');
        $('#button--checkout').html("<i class='fa-solid fa-circle-xmark'></i> Confirmar Saída");
    };

    //Data e hora atual.
    var DateFunc:any = new Now();
    var CurrentDate = DateFunc.Date();
    var CurrentTime = DateFunc.Time();

    //Checa se o movimento está ativo.
    var isActive = props.item.status === 'A' ? true : false;
    const Enabled = useState(isActive);

    /* States */
    const clearForm = {Amount: "", Change: 0.00, Date: CurrentDate, Time:CurrentTime, Method:"", Total:0.00};
    const [FormData, setFormData] = useState({Amount: "", Change: 0.00, Date: CurrentDate, Time:CurrentTime, Method:"", Total:0.00});
    /* States */
    
    /* Cálculo de valor total do movimento ------------------ */
    //Define o valor total para Check-Out.
    useEffect(() => {
        if(show && (!props.item.idcustomer && !props.item.idcompany)){
            let Current:any = new Date((CurrentDate + ' ' +FormData.Time.slice(0,5)).toString());
            let PropDate = (props.item.entrydate.replace(/[/]/g, '-'));
            let FormatDate = DateFunc.FormatDateUTC(PropDate);
            let DateFormat:any = new Date((FormatDate+ ' ' +props.item.entrytime.slice(0,5)).toString());

            var diffMs = Math.abs(Current - DateFormat);

            var diffHour = Math.floor(((diffMs/1000)/60)/60);

            var diffMins = (diffHour < 1) && Math.floor(((diffMs/1000)/60));

            /* Menos do que 1 hora */
            (diffHour < 1 && diffMins < 15) && setFormData({...FormData, Total: 5.00}); // Menos que 15 minutos = R$ 5,00.
            (diffHour < 1 && diffMins >= 15) && setFormData({...FormData, Total: 10.00}); // Mais do que 15 minutos = R$ 10,00.

            /* Mais do que 1 hora */
            (diffHour >= 1 && diffHour < 2) && setFormData({...FormData, Total: 15.00}); // Mais do que 1 hora e menos do que 2 horas = R$ 15,00.
            (diffHour >= 2 && diffHour < 24) && setFormData({...FormData, Total: 25.00}); // Mais do que 2 horas e menos do que 24 horas = R$ 25,00.

            /* Mais do que 24 horas */
            (diffHour >= 24) && setFormData({...FormData, Total: 30.00}); // A partir das 24 horas, a cada 1 hora = + R$ 10,00.
            if(diffHour >= 24){
                for(let i = 24; i <= diffHour; i++){
                    setFormData(prevFormData => ({...prevFormData, Total: prevFormData.Total+10.00}));
                }
            }
        }
    }, [show, FormData.Time]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if(FormData.Amount){
            (parseFloat(FormData.Amount) >= FormData.Total) && 
            setFormData({...FormData, Change: (Math.abs((parseFloat(FormData.Amount.replace(/[,]/g, '.')) - FormData.Total)))});
        }
    }, [FormData.Amount]) // eslint-disable-line react-hooks/exhaustive-deps
    /* Cálculo de valor total do movimento ------------------ */

    /* Controladores do form ------------------ */
    const FormHandler = (e:any) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            [e.target.name]: e.target.value
        }));
    }

    const CurrencyHandler = (_value:any) => {
        (parseFloat(_value) < FormData.Total) ? $("#amount").addClass('warning--input') : $("#amount").removeClass('warning--input');
        setFormData(prevFormData => ({
            ...prevFormData,
            Amount: _value
        }))
    }

    const submitHandler = (e:any) => {
        e.preventDefault();
        
        if(!Enabled){ ErrorWarn(); return;}
        if(FormData.Amount !== '' && (parseInt(FormData.Amount.replace(/[,]/, '.')) < FormData.Total)){ ErrorWarn(); return;}

        $.post("http://"+window.location.hostname+":8000/src/php/movements-crud.php",
        { Action: "checkout", UserID: iduser, FormData, id:props.item.id },
        (response) => {
            var jsonData = JSON.parse(response);
            if(jsonData.success !== 0){
                handlePageUpdate(jsonData);
                handleClose();
                setFormData(clearForm);
            }
        })
    }
    /* Controladores do form ------------------ */

    return(
        <>
            <Link to="#" onClick={handleShow} className="success--accent-color position-relative">
                <i className="fa-solid fa-arrow-right-from-bracket" style={{top:"2px"}}></i>
            </Link>

            <Modal className="modal modal--checkout" aria-labelledby="contained-modal-title-vcenter" centered show={show} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title className="mx-auto text-center">
                        <i className="fa-solid fa-arrows-up-down-left-right"></i><br />
                        Realizar <span className="fw-bold">Check-Out</span>
                    </Modal.Title>
                </Modal.Header>
                <form onSubmit={submitHandler}>
                <Modal.Body className="text-center form--container">
                    <div className="row align-items-start">
                        <div className="col">
                        <p className="custom--title"><i className="bi bi-calendar3 me-1"></i><i className="ms-1 bi bi-clock"></i><br /> Horário de Saída <span className="required-icon"><i className="bi bi-asterisk"></i></span></p>
                        <div className="d-flex justify-content-center">
                            <div className="d-flex" style={{width:"225px"}}>
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
                        </div>
                    </div>
                    {
                    (!props.item.idcustomer && !props.item.idcompany) &&
                    <>
                    <div className="row align-items-start mt-3">
                        <div className="col">
                        <p className="custom--title"><i className="bi bi-cash-coin"></i><br /> Pagamento <span className="required-icon"><i className="bi bi-asterisk"></i></span></p>
                            <div className="d-flex justify-content-center">
                                <div className="position-relative">
                                    <div className="d-flex flex-column align-items-start me-2">
                                        <label htmlFor="total">Valor Total:</label>
                                        <input 
                                        value={
                                            FormData.Total.toLocaleString('pt-BR',{
                                                style: 'currency',
                                                currency: 'BRL',
                                            })
                                        }
                                        onChange={FormHandler}
                                        className="sm"
                                        type="text" 
                                        name="Total" 
                                        id="total" 
                                        disabled
                                        readOnly
                                        />
                                        <i className="bx bx-lock warning--accent-color position-absolute" style={{right:"15px", top:"34px"}}></i>
                                    </div>
                                </div>
                                <div className="d-flex flex-column align-items-start ms-2">
                                    <label htmlFor="method">Método: <span className="required-icon"><i className="bi bi-asterisk"></i></span></label>
                                    <select
                                        value={FormData.Method}
                                        onChange={FormHandler} 
                                        name="Method" 
                                        id="method" 
                                        className="form-select sm custom--select ps-2 text-start"
                                        required
                                    >
                                    <option defaultValue="" className="d-none"></option>
                                    <option value="credit-card">Crédito</option>
                                    <option value="debit-card">Débito</option>
                                    <option value="pix">Pix</option>
                                    <option value="cash">Dinheiro</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    {
                    FormData.Method === 'cash' &&
                    <div className="row align-items-start mt-3">
                        <div className="col">
                            <div className="d-flex justify-content-center">
                                <div className="d-flex flex-column align-items-start me-2">
                                    <label htmlFor="amount">Valor Pago:</label>
                                    <CurrencyInput
                                        id="amount" 
                                        name="Amount" 
                                        value={FormData.Amount}
                                        onValueChange={CurrencyHandler}
                                        prefix="R$ "
                                        maxLength={12}
                                        allowDecimals
                                        decimalsLimit={2}
                                        decimalSeparator=","
                                        className="sm"
                                        autoComplete="off"
                                        required
                                        />
                                    </div>
                                    <div className="d-flex flex-column align-items-start ms-2 position-relative">
                                    <label htmlFor="change">Troco:</label>
                                    <input
                                        id="change" 
                                        name="Change" 
                                        value={FormData.Change.toLocaleString('pt-BR',
                                        {style: 'currency', currency: 'BRL'})}
                                        onChange={FormHandler}
                                        className="sm"
                                        autoComplete="off"
                                        disabled
                                        readOnly
                                    />
                                    <i className="bx bx-lock warning--accent-color position-absolute" style={{right:"8px", top:"34px"}}></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    }
                    </>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" tabIndex={0} variant="outline-light" onClick={handleClose}>
                        <i className="fa-solid fa-ban"></i> Cancelar
                    </Button>
                    <Button id="button--checkout" tabIndex={0} type="submit" variant="primary">
                        <i className="fa-solid fa-arrow-right-from-bracket"></i> Confirmar Saída
                    </Button>
                </Modal.Footer>
                </form>
            </Modal>
        </>
    )
}

export default CheckOut;