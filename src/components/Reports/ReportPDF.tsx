import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import $ from "jquery";
import { Page, View, Text, Document, PDFViewer, StyleSheet, Font } from "@react-pdf/renderer";
import { isEmpty } from "underscore";

const ReportPDF = (props:any) => {
    //Controla o modal.
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    const [Loaded, setLoaded] = useState(false);
    const [ReportData, setReportData] = useState([]);

    const handleShow = () => {
        setShow(true);
        setLoaded(false);
        $.post("http://"+window.location.hostname+":8000/src/php/reports-table.php",
        { Action: "report", FormData: props.FormData }, 
        (response) => {
            var jsonData = JSON.parse(response);
            if(jsonData.success !== 0){
                setReportData(jsonData);
                setLoaded(true);
            } else {
                setReportData([]);
                setLoaded(true);
            }
        });
    };

    //Controla o PDF.
    const styles = StyleSheet.create({
        body: {
            paddingTop: 35,
            paddingBottom: 80,
            paddingHorizontal: 35,
        },
        title: {
            fontSize: 24,
            textAlign: 'center',
            fontFamily: 'Oswald',
            fontWeight: 'bold',
        },
        subtitle: {
            fontSize: 18,
            marginBottom: 24,
            fontFamily: 'Courier',
            textAlign: 'center',
            fontWeight: 'light',
        },
        view: {
            margin: 'auto',
            marginBottom: 12,
            maxWidth: 450,
        },
        text: {
            fontSize: 14,
            textAlign: 'justify',
            fontFamily: 'Courier'
        },
        textbold: {
            fontSize: 14,
            textAlign: 'justify',
            fontFamily: 'Courier-Bold',
            fontWeight: 'bold',
        },
        header: {
            fontSize: 12,
            marginBottom: 20,
            textAlign: 'center',
            color: 'grey',
        },
        pageNumber: {
            position: 'absolute',
            fontSize: 12,
            bottom: 30,
            left: 0,
            right: 0,
            textAlign: 'center',
            color: 'grey',
        },
    });

    const ReportDocument = () => {
        let type:any;
        let action:any;
        type = 
        (props.FormData.Type === "movements") ? "Movimentos" :
        (props.FormData.Type === "vehicles") ? "Veículos" :
        (props.FormData.Type === "customers") ? "Clientes" :
        (props.FormData.Type === "companies") ? "Empresas" :
        (props.FormData.Type === "staff") ? "Funcionários" :
        (props.FormData.Type === "parkingspots") ? "Setores/Vagas" : 
        (props.FormData.Type === "monthly") ? "Mensalidades" :
        (props.FormData.Type === "billing") ? "Pagamentos" : "";

        action =
        (props.FormData.Action) === "checkin" ? "Check-In" :
        (props.FormData.Action) === "checkout" ? "Check-Out" :
        (props.FormData.Action) === "create" ? "Criados" :
        (props.FormData.Action) === "update" ? "Atualizados" :
        (props.FormData.Action) === "activate" ? "Ativados" :
        (props.FormData.Action) === "inactivate" ? "Inativados" : 
        (props.FormData.Action) === "cancel" ? "Cancelados" : 
        (props.FormData.Action) === "delete" ? "Excluídos" : 
        (props.FormData.Action) === "finished" ? "Realizados" : 
        (props.FormData.Action) === "pending" ? "Pendentes" : 
        (props.FormData.Action) === "link" ? "Vinculados" : 
        (props.FormData.Action) === "unlink" ? "Desvinculados" : 
        (props.FormData.Action) === "parked" ? "Ocupados" : 
        (props.FormData.Action) === "vacant" ? "Vazios" : ""; 

        return(
            <Document>
                <Page size="A4" style={styles.body}>
                    <View>
                        <Text style={styles.title}>
                            SAFE PARK
                        </Text>
                        <Text style={styles.subtitle}>
                            Relatório de {type} {action}
                        </Text>
                        { ReportData && 
                          ReportData.map((item:any, key:any) => {
                            return(
                                <View style={styles.view} key={key}>
                                    <Text style={styles.textbold}>
                                        { (props.FormData.Type === "parkingspots" ? "Setor/Vaga" : type.slice(0,-1))+" "+( props.FormData.Action === "checkin" || props.FormData.Action === "checkout" ? action : action.slice(0,-1) ) } 
                                    </Text>
                                    <Text style={styles.text}>
                                        ID: { item.id } {"\n"}
                                        { (props.FormData.Type === "movements" ? "Veículo" : props.FormData.Type === "parkingspots" ? "Setor/Vaga" : type.slice(0,-1))+":" } { item.target }{"\n"}
                                        Data/Hora: { item.datetime } {"\n"}
                                        Realizado por: { item.user } 
                                    </Text>
                                </View>
                            )
                          })  
                        }
                    </View>
                    <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                        `${pageNumber} / ${totalPages}`
                    )} fixed />
                </Page>
            </Document>
        );
    };

    Font.register({
        family: 'Oswald',
        src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf'
    });

    return(
        <>
            <Link to="#" onClick={handleShow} className="my-2 custom--link fade-in--anim position-relative">
                <i className="bi bi-upload"></i> Gerar Relatório
            </Link>

            <Modal className="modal modal--customer-exit" aria-labelledby="contained-modal-title-vcenter" centered show={show} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title className="mx-auto text-center">
                        <i className="bi bi-file-pdf"></i><br />Gerar Relatório
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    {
                    Loaded ?
                        !isEmpty(ReportData)
                        ?
                        <PDFViewer style={{borderRadius:"10px", height:"700px", width:"460px"}}>
                            <ReportDocument/>
                        </PDFViewer>
                        :
                        <div className="d-flex align-items-center justify-content-center table-render mt-3">
                            <p className="text-center none--container">
                                <i className='fa-solid fa-triangle-exclamation'></i><br />
                                Não encontramos nenhuma informação com base em seu pedido.
                            </p>
                        </div>
                    :
                    <div className="d-flex w-100 justify-content-center align-items-center table-loader">
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

export default ReportPDF;