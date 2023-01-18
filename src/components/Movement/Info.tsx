import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import $ from "jquery";

const Info = (props:any) => {
    //Controla o modal.
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true)
        $.get("http://"+window.location.hostname+":8000/src/php/movements-table.php",
        { Action:"id-search", id:props.item.id },
        (response) => {
            var jsonData = JSON.parse(response);
            if(jsonData.success !== 0){
                setMovData(jsonData);
                setLoaded(true);
            }
        });
    };

    //
    const [MovData, setMovData] = useState<any>([]);
    const [Loaded, setLoaded] = useState(false);

    return(
        <>
            <Link to="#" onClick={handleShow} className="purple--accent-color position-relative">
                <i className="fa-solid fa-circle-info" style={{top:"2px"}}></i>
            </Link>

            <Modal className="modal modal--info" aria-labelledby="contained-modal-title-vcenter" centered show={show} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title className="mx-auto text-center">
                        <i className="fa-solid fa-circle-info"></i><br />Detalhamento de Movimento <br />
                        <p className="fs-6 fw-light">Atualmente visualizando movimento: <span className="blue--accent-color"> { '#'+ props.item.id } </span></p>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                    Loaded ?
                        MovData &&
                        MovData.map((item:any, key:any) => {
                            return(
                            <div key={key}>
                                <div className="row align-items-start">
                                    <div className="col d-flex text-center flex-column" style={item.customer && {maxWidth:"300px"}}>
                                        <p className="custom--title"><i className="bi bi-car-front"></i><br /> Dados do Veículo</p>
                                        <div className="d-flex flex-column flex-wrap">
                                            <p className="fs-6 fw-light"><i className="bi bi-card-text"></i> Placa: <span className="blue--accent-color">{ item.plate.slice(0,3)+'-'+item.plate.slice(3,7) }</span></p>
                                            <p className="fs-6 fw-light"><i className="bi bi-car-front"></i> Modelo: <span className="blue--accent-color">{ item.model }</span></p>
                                            <p className="fs-6 fw-light"><i className="bi bi-palette"></i> Cor: <span className="blue--accent-color">{ item.color }</span></p>
                                            <p className="fs-6 fw-light"><i className="bi bi-tags"></i> Tipo: <span className="blue--accent-color">{ item.type }</span></p>
                                            <p className="custom--title"><i className="bi bi-p-square"></i><br /> Setor/Vaga: <span className="blue--accent-color fw-bold">{ item.spot }</span></p>
                                        </div>
                                    </div>
                                    {
                                        item.customer &&
                                        <div className="col d-flex text-center flex-column">
                                            <p className="custom--title"><i className="bi bi-person"></i><br /> Dados do Cliente</p>
                                            <div className="d-flex flex-column flex-wrap">
                                                <p className="fs-6 fw-light"><i className="bi bi-person"></i> Cliente: <span className="blue--accent-color">{ item.customer }</span></p>
                                                <p className="fs-6 fw-light"><i className="bi bi-person-vcard"></i> CPF: <span className="blue--accent-color">{ item.cpf.slice(0, 3) + '.' + item.cpf.slice(3, 6) + '.' + item.cpf.slice(6, 9) + '-' + item.cpf.slice(9, 11) }</span></p>
                                                {
                                                item.company &&
                                                <>
                                                <p className="custom--title"><i className="bi bi-buildings"></i><br /> Dados do Convênio</p>
                                                <div className="d-flex flex-column flex-wrap">
                                                    <p className="fs-6 fw-light"><i className="bi bi-person"></i> Razão social: <span className="blue--accent-color">{ item.company }</span></p>
                                                    <p className="fs-6 fw-light"><i className="bi bi-person-vcard"></i> CNPJ: <span className="blue--accent-color">{ item.cnpj.slice(0,2) + '.' + item.cnpj.slice(2,5) + '.' + item.cnpj.slice(5,8) + '/' + item.cnpj.slice(8,12) + '-' + item.cnpj.slice(12,14) }</span></p>
                                                </div>
                                                </>
                                                }                                        
                                            </div>
                                        </div>
                                    }
                                    </div>
                                    {
                                    (props.item.exitdate || item.totalprice) &&
                                    <div className="row align-items-start">
                                        {
                                        item.totalprice &&
                                        <div className="col d-flex text-center flex-column">
                                            <p className="custom--title"><i className="bi bi-cash-coin"></i><br /> Dados de Pagamento</p>
                                            <div className="d-flex flex-column flex-wrap">
                                                <p className="fs-6 fw-light"><i className="bi bi-cash-coin"></i> Valor Total: <span className="blue--accent-color"> { "R$ "+item.totalprice.replace(/[.]/g, ',') } </span></p>
                                                <p className="fs-6 fw-light"><i className="bi bi-currency-dollar"></i> Valor Pago: <span className="blue--accent-color">{ "R$ "+item.amount.replace(/[.]/g, ',') }</span></p>
                                                {
                                                    item.method === 'cash' &&
                                                    <p className="fs-6 fw-light"><i className="bi bi-coin"></i> Troco: <span className="blue--accent-color">{"R$ "+item.change.replace(/[.]/g, ',') }</span></p>
                                                }
                                                <p className="fs-6 fw-light"><i className="bi bi-wallet2"></i> Método: <span className="blue--accent-color">{ item.method === 'debit-card' ? 'Débito' : item.method === 'credit-card' ? 'Crédito' : item.method === 'pix' ? 'Pix' : item.method === 'cash' ? 'Dinheiro' : '' }</span></p>
                                            </div>
                                        </div>
                                        }
                                        {
                                        props.item.exitdate &&
                                        <div className="col d-flex text-center flex-column">
                                            <p className="custom--title"><i className="bi bi-arrows-move"></i><br /> Check-Out</p>
                                            <p className="fs-6 fw-light"><i className="bi bi-calendar3"></i> Entrada: <br /><span className="blue--accent-color">{ props.item.entrydate + ' ' + props.item.entrytime.slice(0,5) }</span></p>
                                            <p className="fs-6 fw-light"><i className="bi bi-calendar3"></i> Saída: <br /><span className="blue--accent-color">{ props.item.exitdate + ' ' + props.item.exittime.slice(0,5) }</span></p>
                                        </div>
                                        }
                                    </div>
                                    }
                                    {
                                        (props.item.iduser && props.permlevel >= 1) &&
                                        <div className="row align-items-start">
                                            <div className="col d-flex text-center flex-column">
                                            <p className="custom--title"><i className="bi bi-person-badge"></i><br /> Funcionário Responsável: <span className="blue--accent-color">{ props.item.user }</span></p>
                                            {
                                                props.item.idvalet &&
                                                <p className="custom--title"><i className="bi bi-person-badge"></i><br /> Manobrista Responsável: <span className="blue--accent-color">{ props.item.valet }</span></p>
                                            }
                                            </div>
                                        </div>
                                    }
                            </div>
                            )
                        })
                        :
                        <div className="d-flex w-100 justify-content-center align-items-center" style={{ height: "350px" }}>
                            <span className="loader"></span>
                        </div>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" tabIndex={0} variant="outline-light" onClick={handleClose}>
                        <i className="fa-solid fa-arrow-right-from-bracket"></i> Fechar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Info;