import React, { useState } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import Now from "../assets/ts/datetime";
import ReportPDF from "../components/Reports/ReportPDF";

const Reports = () => {
    //Data e hora atual.
    var DateFunc:any = new Now();
    var CurrentDate = DateFunc.Date();
    
    //Controlador do form.
    const [FormData, setFormData] = useState({Type:"", Action:"", StartDate:CurrentDate, EndDate:CurrentDate});

    const FormHandler = (e:any) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            [e.target.name]: e.target.value
        }));
    }

    return(
        <>
        <Navbar/>
            <main>
                <div className="main--container form--container">
                    <h4 className="text-center mt-4 fw-bold">
                        <i className="fa-regular fa-file-lines"></i><br />RELATÓRIOS
                    </h4>
                    <div className="d-flex align-items-center justify-content-center" style={FormData.Action ? {minHeight:"340px", maxHeight:"360px"} : {minHeight:"300px", maxHeight:"360px"}}>
                        <div className="d-flex align-items-center flex-column">
                            <div className="d-flex align-items-center flex-column my-2 fade-in--anim">
                                <label htmlFor="type"><i className="bi bi-tags"></i> Selecione o tipo de relatório...</label>
                                <select 
                                    value={FormData.Type}
                                    onChange={FormHandler}
                                    name="Type" 
                                    id="type" 
                                    className="custom--select form-select text-start md"
                                    required
                                >
                                    <option defaultValue="" className="d-none"></option>
                                    <option value="movements">Movimentos</option>
                                    <option value="billing">Pagamentos</option>
                                    <option value="monthly">Mensalidades</option>
                                    <option value="staff">Funcionários</option>
                                    <option value="customers">Clientes</option>
                                    <option value="companies">Empresas</option>
                                    <option value="vehicles">Veículos</option>
                                    <option value="parkingspots">Setores/Vagas</option>
                                </select>
                            </div>
                            {
                                FormData.Type &&
                                <div className="d-flex flex-column text-start my-2 fade-in--anim">
                                    <label htmlFor="action"><i className="bi bi-hand-index"></i> Ação:</label>
                                    <select
                                    value={FormData.Action}
                                    onChange={FormHandler}
                                    name="Action" 
                                    id="action" 
                                    className="form-select text-start md custom--select"
                                    required
                                >
                                    <option defaultValue="" className="d-none"></option>
                                    {
                                        (FormData.Type !== "monthly" && FormData.Type !== "billing") 
                                        ?
                                        <>
                                            {FormData.Type === "movements" &&
                                                <>
                                                    <option value="checkin">Check-In</option>
                                                    <option value="checkout">Check-Out</option>
                                                </>
                                            }
                                            {FormData.Type === "parkingspots" &&
                                                <>
                                                    <option value="parked">Ocupados</option>
                                                    <option value="vacant">Vazios</option>
                                                </>
                                            }
                                            {(FormData.Type === "customers" || FormData.Type === "vehicles") &&
                                                <>
                                                    <option value="link">Vinculados</option>
                                                    <option value="unlink">Desvinculados</option>
                                                </>
                                            }
                                            { FormData.Type !== "movements" &&<option value="create">Criados</option> }
                                            <option value="update">Atualizados</option>
                                            <option value="activate">Ativados</option>
                                            <option value="inactivate">Inativados</option>
                                            { FormData.Type === "movements" && <option value="cancel">Cancelados</option> }
                                            { FormData.Type !== "movements" && <option value="delete">Excluídos</option> }
                                        </>
                                        :
                                        <>
                                            <option value="finished">Realizados</option>
                                            <option value="pending">Pendentes</option>
                                        </>
                                    }
                                </select>
                                </div>
                            }
                            {
                                FormData.Action &&
                                <div className="d-flex">
                                    <div className="d-flex flex-column text-start my-2 mx-2 fade-in--anim">
                                        <label htmlFor="startdate"><i className="bi bi-clock"></i> Data inicial:</label>
                                        <input 
                                        value={FormData.StartDate}
                                        onChange={(e:any) => {
                                            if(new Date(e.target.value) > new Date(CurrentDate)){
                                                setFormData(prevFormData => ({...prevFormData, StartDate: CurrentDate }))
                                            } else
                                            FormHandler(e);
                                        }}
                                        type="date" 
                                        className="md" 
                                        name="StartDate" 
                                        id="startdate" 
                                        max={CurrentDate}
                                        required
                                        />
                                    </div>
                                    <div className="d-flex flex-column text-start my-2 mx-2 fade-in--anim">
                                        <label htmlFor="enddate"><i className="bi bi-clock"></i> Data final:</label>
                                        <input 
                                        value={FormData.EndDate}
                                        onChange={(e:any) => {
                                            if(new Date(e.target.value) > new Date(CurrentDate)){
                                                setFormData(prevFormData => ({...prevFormData, EndDate: CurrentDate }))
                                            } else
                                            FormHandler(e);
                                        }}
                                        type="date" 
                                        className="md" 
                                        name="EndDate" 
                                        id="enddate" 
                                        max={CurrentDate}
                                        required
                                        />
                                    </div>
                                </div>
                            }
                            {
                                (FormData.StartDate && FormData.EndDate) &&
                                <ReportPDF FormData={FormData} />
                            }
                        </div>
                    </div>
                </div>
            </main>
        <Footer/>
        </>
    )
}

export default Reports;