import React, { useEffect, useState } from "react";
import $ from "jquery";

//Componentes de reuso
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

//Componenetes específicos
import SectorsAdd from "../components/Sector/SectorsAdd";
import SectorCard from "../components/Sector/SectorCard";

const Sectors = () => {
    //Controla a renderização da tabela caso ache ou não ache resultados no banco.
    const [TableRender, setTableRender] = useState(true);
    const [Loaded, setLoaded] = useState(false);

    //(Atualiza a renderização da tabela em tempo real)
    const [Update, setUpdate] = useState({ data: '', message: '', alert: false });

    const [TableData, setTableData] = useState<any>([]);

    useEffect(() => {
        $.get('http://localhost:8000/src/php/sectors-table.php', { Action: "sectors" }, (response) => {
            var jsonData = JSON.parse(response);
            if (jsonData.success !== 0) {
                setTableData(jsonData);
                setTimeout(() => { setLoaded(true) }, 500);
                setTableRender(true);
            } else {
                setLoaded(true); setTableRender(false);
            }
        })
    }, [Update]);

    return (
        <>
            <Navbar />
            <main>
                <div className="main--container sector--container" style={{width:"32rem",height:"580px"}}>
                    <h4 className="text-center mt-4 fw-bold">
                        <i className="fa-solid fa-square-parking"></i><br />SETORES E VAGAS
                    </h4>
                    <div className="position-relative d-flex justify-content-center">
                        <SectorsAdd onInsert={ setUpdate } />
                    </div>
                    <div className="d-flex justify-content-center">
                        <div className="sector-table--container mt-4 fade-in--anim">
                            {
                                Loaded?
                                    TableRender?
                                        TableData.map((item: any, key:any) => {
                                            return (
                                                <SectorCard item={item} key={key}/>
                                            )
                                        })
                                    :
                                    <div className="d-flex align-items-center" style={{ height: "350px" }}>
                                        <p className="text-center none--container">
                                            <i className='fa-solid fa-triangle-exclamation'></i><br />
                                            Nenhum setor registrado.
                                        </p>
                                    </div>
                                :
                                <div className="d-flex w-100 justify-content-center align-items-center" style={{ height: "350px" }}>
                                    <span className="loader"></span>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}

export default Sectors;