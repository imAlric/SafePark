import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import ReactInputMask from "react-input-mask";

const CompanyEdit = (props: any) => {
    return (
        <div className="form--container d-flex flex-column align-items-center">
            <div className="row align-items-start">
                <div className="col">
                    <OverlayTrigger placement="top" overlay={
                        <Tooltip>
                            <span className="required">* Obrigatório</span>
                        </Tooltip>}>
                        <label htmlFor="fullname">Razão social: <span className="required-icon"><i className="bi bi-asterisk"></i></span></label>
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
                        <label htmlFor="CNPJ">CNPJ: <span className="required-icon"><i className="bi bi-asterisk"></i></span></label>
                    </OverlayTrigger>
                    <br />
                    <ReactInputMask
                        mask="99.999.999/9991-99"
                        maskChar={null}
                        value={props.FormData.CNPJ}
                        onChange={props.FormHandler}
                        id="CNPJ"
                        name="CNPJ"
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
                        <label htmlFor="email">E-mail: <span className="required-icon"><i className="bi bi-asterisk"></i></span></label>
                    </OverlayTrigger>
                    <br />
                    <input
                        value={props.FormData.Email}
                        onChange={props.FormHandler}
                        className="md"
                        type="text"
                        id="email"
                        name="Email"
                        autoComplete="off"
                        maxLength={82}
                        required
                    />
                    <br /><br />
                    <OverlayTrigger placement="top" overlay={
                        <Tooltip>
                            <span className="required">* Obrigatório</span>
                        </Tooltip>}>
                        <label htmlFor="phone">Telefone: <span className="required-icon"><i className="bi bi-asterisk"></i></span></label>
                    </OverlayTrigger>
                    <br />
                    <ReactInputMask
                        mask="(99) 9999-9999"
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
                    <i className="fa-solid fa-triangle-exclamation"></i><br />A empresa de CNPJ <strong>{props.FormData.CNPJ}</strong> já foi cadastrada.
                </span>
            }
            {
                props.InvalidCNPJ &&
                <span id="invalidcnpj" className="warning--alert mt-3 text-center">
                    <i className="fa-solid fa-triangle-exclamation"></i><br />O CNPJ <strong>{props.FormData.CNPJ}</strong> não é um CNPJ válido.
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

export default CompanyEdit;