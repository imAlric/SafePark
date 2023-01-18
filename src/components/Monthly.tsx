import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import CurrencyInput from "react-currency-input-field";
import $ from "jquery";
import Now from "../assets/ts/datetime";
import Cookies from "js-cookie";
import CryptoJS, { AES } from "crypto-js";

//Alerta de sucesso.
import { useToast } from "izitoast-react";
import "../lib/izitoast/dist/css/iziToast.min.css";

const Monthly = (props: any) => {
    const iduser = parseInt(AES.decrypt(Cookies.get('UID')!, Cookies.get('AESP')!).toString(CryptoJS.enc.Utf8));

    //Data e hora atual.
    var DateFunc: any = new Now();
    var CurrentDate = DateFunc.Date();
    var CurrentTime = DateFunc.Time();

    //Controla o modal.
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [FormData, setFormData] = useState({ Amount: "", Change: 0.00, Method: "", Total: 120.00 });

    const handlePageUpdate = useCallback((e: any) => { props.onUpdate(e) }, [props.onUpdate]); // eslint-disable-line react-hooks/exhaustive-deps

    //Controla o aviso de erro.
    const Alert = useToast({
        title: "Sucesso!",
        message: "Mensalidade paga com sucesso!",
        layout: 2,
        theme: "light",
        color: "green",
        icon: "fa-solid fa-check",
        position: "topCenter",
        displayMode: 2,
        timeout: 3000,
    });

    const FormHandler = (e: any) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            [e.target.name]: e.target.value
        }));
    }

    const CurrencyHandler = (_value: any) => {
        (parseFloat(_value) < FormData.Total) ? $("#amount").addClass('warning--input') : $("#amount").removeClass('warning--input');
        setFormData(prevFormData => ({
            ...prevFormData,
            Amount: _value
        }))
    }

    useEffect(() => {
        if (FormData.Amount) {
            (parseFloat(FormData.Amount) >= FormData.Total) &&
                setFormData({ ...FormData, Change: (Math.abs((parseFloat(FormData.Amount.replace(/[,]/g, '.')) - FormData.Total))) });
        }
    }, [FormData.Amount]) // eslint-disable-line react-hooks/exhaustive-deps

    const submitHandler = (e: any) => {
        e.preventDefault();
        $.post("http://"+window.location.hostname+":8000/src/php/" + props.url,
            { Action: "billing", idbilling: props.idbilling, id: props.id, FormData, UserID: iduser },
            (response) => {
                var jsonData = JSON.parse(response);
                Alert();
                handlePageUpdate(jsonData);
                handleClose();
            })
    }

    return (
        <>
            <Link to="#" onClick={handleShow} className={"position-relative " + (new Date(CurrentDate + ' ' + CurrentTime) > new Date(props.validity) ? "warning--accent-color" : "purple--accent-color")}>
                <i className="fa-solid fa-file-invoice-dollar" style={{ top: "2px" }}></i>
            </Link>

            <Modal className="modal modal--monthly" aria-labelledby="contained-modal-title-vcenter" centered show={show} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title className="mx-auto text-center">
                        <i className="fa-solid fa-file-invoice-dollar"></i><br />
                        Mensalidade
                        {
                            new Date(CurrentDate + ' ' + CurrentTime) > new Date(props.validity) &&
                            <>
                                <span className="d-flex flex-column fs-6 mt-3 p-2 warning--input custom--title">
                                    <i className="fa-solid fa-exclamation-triangle warning--accent-color"></i>
                                    Não foi reconhecido o pagamento desta mensalidade...
                                </span>
                            </>
                        }
                    </Modal.Title>
                </Modal.Header>
                {
                    (new Date(CurrentDate + ' ' + CurrentTime) < new Date(props.validity) || DateFunc.DiffDays(new Date(CurrentDate + ' ' + CurrentTime),new Date(props.validity)) >= 5)
                        ?
                        <>
                        <Modal.Body className="text-center form--container">
                            <span className="d-flex flex-column fs-6">
                                <i className="fa-solid fa-square-check success--accent-color"></i>
                                Esta mensalidade está paga e com seu prazo em dia!
                            </span>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button type="button" tabIndex={0} variant="outline-light" onClick={handleClose}>
                                <i className="fa-solid fa-arrow-right-from-bracket"></i> Fechar
                            </Button>
                        </Modal.Footer>
                        </>
                        :
                        <>
                            <form onSubmit={submitHandler}>
                                <Modal.Body className="text-center form--container">
                                    <div className="row align-items-start">
                                        <div className="col">
                                            <div className="d-flex justify-content-center">
                                                <div className="d-flex flex-column align-items-start me-2">
                                                    <label htmlFor="total">Valor Total:</label>
                                                    <div className="position-relative">
                                                        <input
                                                            value={
                                                                FormData.Total.toLocaleString('pt-BR', {
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
                                                        <i className="bx bx-lock warning--accent-color position-absolute" style={{ right: "8px", top: "10px" }}></i>
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
                                                    <div className="d-flex flex-column align-items-start ms-2">
                                                        <label htmlFor="change">Troco:</label>
                                                        <div className="position-relative">
                                                            <input
                                                                id="change"
                                                                name="Change"
                                                                value={FormData.Change.toLocaleString('pt-BR',
                                                                    { style: 'currency', currency: 'BRL' })}
                                                                onChange={FormHandler}
                                                                className="sm"
                                                                autoComplete="off"
                                                                disabled
                                                                readOnly
                                                            />
                                                            <i className="bx bx-lock warning--accent-color position-absolute" style={{ right: "8px", top: "10px" }}></i>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="outline-light" onClick={handleClose}>
                                        <i className="fa-solid fa-ban"></i> Cancelar
                                    </Button>
                                    <Button id="button--checkout" tabIndex={0} type="submit" variant="primary">
                                        <i className="fa-solid fa-money-check-dollar"></i> Confirmar Pagamento
                                    </Button>
                                </Modal.Footer>
                            </form>
                        </>
                }
            </Modal>
        </>
    )
}

export default Monthly;