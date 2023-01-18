import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import ReactInputMask from "react-input-mask";

const CustomerEdit = ( props:any ) => {
    return (
        <div className="form--container d-flex flex-column align-items-center">
            <div className="row align-items-start">
                <div className="col">
                    <OverlayTrigger placement="top" overlay={
                        <Tooltip>
                            <span className="required">* Obrigatório</span>
                        </Tooltip>}>
                        <label htmlFor="fullname">Nome completo: <span className="required-icon"><i className="bi bi-asterisk"></i></span></label>
                    </OverlayTrigger>
                    <br />
                    <input
                        value={props.FormData.Fullname}
                        onChange={props.FormHandler}
                        className="md"
                        type="text"
                        id="fullname"
                        name="Fullname"
                        autoComplete="off"
                        maxLength={82}
                        required
                    />
                    <br /><br />
                    <OverlayTrigger placement="top" overlay={
                        <Tooltip>
                            <span className="required">* Obrigatório</span>
                        </Tooltip>}>
                        <label htmlFor="CPF">CPF: <span className="required-icon"><i className="bi bi-asterisk"></i></span></label>
                    </OverlayTrigger>
                    <br />
                    <ReactInputMask
                        mask="999.999.999-99"
                        maskChar={null}
                        value={props.FormData.CPF}
                        onChange={props.FormHandler}
                        id="CPF"
                        name="CPF"
                        autoComplete="off"
                        className="md"
                        required
                    />
                </div>
                <div className="col">
                    <OverlayTrigger placement="top" overlay={
                        <Tooltip>
                            <span className="required">* Obrigatório</span>
                        </Tooltip>}>
                        <label htmlFor="phone">Celular: <span className="required-icon"><i className="bi bi-asterisk"></i></span></label>
                    </OverlayTrigger>
                    <br />
                    <ReactInputMask
                        mask="(99) 99999-9999"
                        maskChar={null}
                        value={props.FormData.Phone}
                        onChange={props.FormHandler}
                        className="md"
                        type="text"
                        id="phone"
                        name="Phone"
                        autoComplete="off"
                        required
                    />
                </div>
            </div>
            {
                props.Found &&
                <span id="found" className="warning--alert mt-3 text-center">
                    <i className="fa-solid fa-triangle-exclamation"></i><br />O cliente de CPF <strong>{props.FormData.CPF}</strong> já foi cadastrado.
                </span>
            }
            {
                props.InvalidCPF &&
                <span id="invalidcpf" className="warning--alert mt-3 text-center">
                    <i className="fa-solid fa-triangle-exclamation"></i><br />O CPF <strong>{props.FormData.CPF}</strong> não é um CPF válido.
                </span>
            }
            {
                props.InvalidPhone &&
                <span id="invalidphone" className="warning--alert mt-3 text-center">
                    <i className="fa-solid fa-triangle-exclamation"></i><br />O celular <strong>{props.FormData.Phone}</strong> não é um celular válido.
                </span>
            }
        </div>
    )
}

export default CustomerEdit;