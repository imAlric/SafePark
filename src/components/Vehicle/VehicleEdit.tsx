import React from "react";
import ReactInputMask from "react-input-mask";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const VehicleEdit = (props: any) => {

    return (
        <div className="form--container d-flex flex-column align-items-center">
            <div className="row align-items-start">
                <div className="col">
                    <OverlayTrigger placement="top" overlay={
                        <Tooltip>
                            Este é o <strong>MODELO</strong> do veículo, onde deve ser informado sua marca e nome. <br />
                            <span className="text-muted">Ex: Chevrolet Onyx</span> <br />
                            <span className="required">* Obrigatório</span>
                        </Tooltip>}>
                        <label htmlFor="model">Modelo: <span className="required-icon"><i className="bi bi-asterisk"></i></span></label>
                    </OverlayTrigger>
                    <br />
                    <input
                        value={props.FormData.Model}
                        onChange={props.FormHandler}
                        className="md"
                        type="text"
                        id="model"
                        name="Model"
                        autoComplete="off"
                        maxLength={128}
                        required
                    />
                    <br /><br />
                    <OverlayTrigger placement="top" overlay={
                        <Tooltip>
                            Esta é a <strong>PLACA</strong> do veículo, onde deve ser informado a identificação do veículo. <br />
                            <span className="required">* Obrigatório</span>
                        </Tooltip>}>
                        <label htmlFor="plate">Placa: <span className="required-icon"><i className="bi bi-asterisk"></i></span></label>
                    </OverlayTrigger>
                    <br />
                    <ReactInputMask
                        mask="aaa-9*99"
                        maskChar={null}
                        value={props.FormData.Plate.toUpperCase()}
                        onChange={props.FormHandler}
                        id="plate"
                        name="Plate"
                        autoComplete="off"
                        className="sm"
                        required
                    />
                </div>
                <div className="col">
                    <OverlayTrigger placement="top" overlay={
                        <Tooltip>
                            Esta é a <strong>COR</strong> do veículo, onde deve ser informado a pintura visível no veículo.<br />
                            <span className="required">* Obrigatório</span>
                        </Tooltip>}>
                        <label htmlFor="color">Cor: <span className="required-icon"><i className="bi bi-asterisk"></i></span></label>
                    </OverlayTrigger>
                    <br />
                    <input
                        value={props.FormData.Color}
                        onChange={props.FormHandler}
                        className="sm"
                        type="text"
                        id="color"
                        name="Color"
                        autoComplete="off"
                        maxLength={18}
                        required
                    />
                    <br /><br />
                    <OverlayTrigger placement="top" overlay={
                        <Tooltip>
                            Esta é a <strong>CATEGORIA</strong> do veículo, onde deve ser informado qual o tipo do veículo.<br />
                            <span className="text-muted">Ex: SUV, Compacto, Sedan...</span> <br />
                            <span className="required">* Obrigatório</span>
                        </Tooltip>}>
                        <label htmlFor="type">Categoria: <span className="required-icon"><i className="bi bi-asterisk"></i></span></label>
                    </OverlayTrigger>
                    <br />
                    <input
                        value={props.FormData.Type}
                        onChange={props.FormHandler}
                        className="sm"
                        type="text"
                        id="type"
                        name="Type"
                        autoComplete="off"
                        maxLength={18}
                        required
                    />
                </div>
            </div>
            {
                props.Found &&
                <span id="found" className="warning--alert mt-3 text-center">
                    <i className="fa-solid fa-triangle-exclamation"></i><br />O veículo de placa <strong>{props.FormData.Plate}</strong> já foi cadastrado.
                </span>
            }
            {
                props.InvalidPlaque &&
                <span id="invalidplaque" className="warning--alert mt-3 text-center">
                    <i className="fa-solid fa-triangle-exclamation"></i><br />A placa <strong>{props.FormData.Plate}</strong> não é uma placa válida.
                </span>
            }
        </div>
    )

}

export default VehicleEdit;