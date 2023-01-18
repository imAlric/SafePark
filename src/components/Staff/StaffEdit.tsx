import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import ReactInputMask from "react-input-mask";

import { ShowPassword } from "../../assets/ts/showpass";

const StaffEdit = (props: any) => {
    return (
        <div className="form--container d-flex flex-column align-items-center">
            <div className="d-flex flex-column">
            <div className="row align-items-start mx-0 my-2">
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
                </div>
                <div className="col">
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
            </div>
            <div className="row align-items-start my-2 mx-0">
                    <div className="col">
                        <OverlayTrigger placement="top" overlay={
                            <Tooltip>
                                <span className="required">* Obrigatório</span>
                            </Tooltip>}>
                        <label htmlFor="role">Cargo: <span className="required-icon"><i className="bi bi-asterisk"></i></span></label>
                        </OverlayTrigger>
                        <br />
                        <select
                            value={props.FormData.Role}
                            onChange={props.FormHandler}
                            className="md form-select custom--select text-start"
                            id="role"
                            name="Role"
                            required
                        >
                        <option defaultValue="" className="d-none"></option>
                        {
                            props.FormData.Role === 'Manobrista'
                            ?
                            <option value="Manobrista">Manobrista</option>
                            :
                            <option value="Operador de Sistema">Operador de Sistema</option>
                        }
                        </select>
                </div>
            </div>
            {
            (props.FormData.Role && props.FormData.Role !== 'Manobrista') &&
            <div className="row align-items-start mx-0 my-2">
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
                </div>
                <div className="col">
                    <div className="position-relative">
                        <OverlayTrigger placement="top" overlay={
                            <Tooltip>
                                <span className="required">* Obrigatório</span>
                            </Tooltip>}>
                        <label htmlFor="password">Senha: <span className="required-icon"><i className="bi bi-asterisk"></i></span></label>
                        </OverlayTrigger>
                        <br />
                        <input
                            value={props.FormData.Password}
                            onChange={props.FormHandler}
                            className="md"
                            type="password"
                            id="password"
                            name="Password"
                            autoComplete="off"
                            maxLength={12}
                            required
                        />
                        <i onClick={() => ShowPassword("password")} id="showPass" className="bi bi-eye-slash showPass"></i>
                    </div>
                </div>
            </div>
            }
            </div>
            {
                props.Found &&
                <span id="found" className="warning--alert mt-3 text-center">
                    <i className="fa-solid fa-triangle-exclamation"></i><br />O funcionário de CPF <strong>{props.props.FormData.CPF}</strong> já foi cadastrado.
                </span>
            }
            {
                props.InvalidCPF &&
                <span id="invalidcpf" className="warning--alert mt-3 text-center">
                    <i className="fa-solid fa-triangle-exclamation"></i><br />O CPF <strong>{props.props.FormData.CPF}</strong> não é um CPF válido.
                </span>
            }
            {
                props.InvalidPassword &&
                <span id="invalidpassword" className="warning--alert mt-3 text-center">
                    <i className="fa-solid fa-triangle-exclamation"></i><br />A senha precisa ser maior que <strong>4 dígitos</strong>.
                </span>
            }
        </div>
    )
}

export default StaffEdit;