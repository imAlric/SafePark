import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import $ from "jquery";

const SectorCard = ({item} : {item:any}) => {
    //Controla o modal.
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [TableData, setTableData] = useState([]);
    const [Category, setCategory] = useState<any>([]);

    useEffect(() => {
        $.get("http://"+window.location.hostname+":8000/src/php/sectors-table.php", { Action: "spots", idsector: item.id }, 
        (response) => {
            var jsonData = JSON.parse(response);
            if(jsonData.success !== 0){
                setTableData(jsonData);
            }
        })
        $.get("http://"+window.location.hostname+":8000/src/php/sectors-table.php", { Action: "sectorcategory", idcategory: item.idcategory },
        (response) => {
            var jsonData = JSON.parse(response);
            if(jsonData.success !== 0){
                setCategory(jsonData);
            }
        } )
    }, [show]); // eslint-disable-line react-hooks/exhaustive-deps

    return(
        <>
            <Link to="#" className="nav-link sector--card fade-in--anim" onClick={handleShow}> <strong>{item.name}</strong> </Link>

            <Modal className="modal modal--logout" aria-labelledby="contained-modal-title-vcenter" centered show={show} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title className="mx-auto text-center fs-3">
                        <i className="fa-solid fa-square-parking"></i><br />Setor <strong>{ item.name }</strong>
                        <p className="fs-6 fw-light">{ Category.description }</p>
                    </Modal.Title>
                </Modal.Header>
                    <Modal.Body className="text-center">
                            <div className="d-flex flex-wrap ms-auto" style={{maxHeight:"400px", width:"400px"}}>
                            {
                                TableData &&
                                TableData.map((item:any, key:any) => {
                                    return(
                                        <span className="d-flex justify-content-center" key={key}>
                                            <span className="custom--span d-flex justify-content-center">
                                                <p className="me-2"> {item.number}</p> 
                                                { item.status === 'V' ? 
                                                <i className="fa-solid fa-check position-relative text-success" style={{top:"5px"}}></i> :
                                                <i className="fa-solid fa-xmark position-relative text-danger" style={{top:"5px"}}></i>  
                                                }
                                            </span>
                                        </span>
                                    )
                                })
                            }
                        </div>
                    </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-light" onClick={handleClose}>
                    <i className="fa-solid fa-ban"></i> Cancelar
                    </Button>
                    <Button onClick={handleClose}>
                    <i className="fa-solid fa-floppy-disk"></i> Salvar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default SectorCard;