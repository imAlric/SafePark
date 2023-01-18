import React, { useEffect, useState, useCallback } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { debounce } from "underscore";
import $ from 'jquery';
import Cookies from "js-cookie";
import CryptoJS, { AES } from "crypto-js";

//Componentes fixos.
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
//Componentes de reuso.
import Status from "../components/Status";
import Filter from "../components/Filter";
import Edit from "../components/Edit";
import Pagination from "../components/Pagination";
import Delete from "../components/Delete";
//Componentes especiais.
import VehicleAdd from "../components/Vehicle/VehicleAdd";

const Vehicles = () => {
    //Nível de permissão.
    const permlevel = parseInt(AES.decrypt(Cookies.get('PLVL')!, Cookies.get('AESP')!).toString(CryptoJS.enc.Utf8));

    //Controla a renderização da tabela caso ache ou não ache resultados no banco.
    const [TableRender, setTableRender] = useState(true);
    const [Loaded, setLoaded] = useState(false);

    //Controla a atualização da página em caso de pesquisa ou inserir novo veículo.
    //(Atualiza a renderização da tabela em tempo real)
    const [Update, setUpdate] = useState({ data: '', message: '', alert: false });

    //Controla a pesquisa da tabela.
    const [Search, setSearch] = useState('');
    const [FilterType, setFilterType] = useState('');
    const [FilterStatus, setFilterStatus] = useState('Linked');

    //Controla as informações da tabela.
    const [TableData, setTableData] = useState([]);
    const [FilterData, setFilterData] = useState([]);

    //Controla a requisição da tabela após a pesquisa ser feita.
    const SearchHandler = useCallback(debounce(():any => { // eslint-disable-line react-hooks/exhaustive-deps
     $.get("http://"+window.location.hostname+":8000/src/php/vehicle-table.php", 
     { Action: "search", Status: FilterStatus, search: $('#filter').val(), filter: $("#filtertype").val() },
     (response:any) => {
         var jsonData = JSON.parse(response);
         if(jsonData.success !== 0){
                 setFilterData(jsonData);
                 setLoaded(true)
             } else {
                 setLoaded(true)
                 setFilterData([]);
             }
         })
     },400),[]);

    /* Banco de Dados */
    const [Offset, setOffset] = useState(0); //Offset sendo enviado ao banco.
    const [Count, setCount] = useState<any>(0); //Contagem total dos dados do banco.
    const Limit = 20; // Limite de informações por página.
    //Chama o banco de dados e insere a tabela uma única vez na renderização inicial, ou, caso o usuário
    //pesquise algo ou insira um novo cliente.
    useEffect(() => {
        $.get("http://"+window.location.hostname+":8000/src/php/vehicle-table.php", 
        { Action: "table", Status: FilterStatus, Limit: Limit, Offset: Offset }, (response) => {
                var jsonData = JSON.parse(response);
                if (jsonData.success !== 0) {
                    setCount(jsonData[0].count);
                    setTableData(jsonData);
                    setTimeout(() => { setLoaded(true) }, 500);
                    setTableRender(true);
                } else {
                    setLoaded(true); setTableRender(false);
                }
            })
    }, [Update, Offset, FilterStatus]); // eslint-disable-line react-hooks/exhaustive-deps
    /*  */

    //Decide se deve mostrar a tabela completa ou apenas os itens filtrados.
    var Table = [];
    Search ? Table = FilterData : Table = TableData;

    return (
        <>
            <Navbar />
            <main>
                <div className="main--container vehicle--container position-relative">
                    <h4 className="text-center mt-4 fw-bold">
                        <i className="fa-solid fa-car"></i><br /> VEÍCULOS
                    </h4>
                    <div className="d-flex justify-content-center align-items-center">
                        <Filter
                            Options={[
                                { option: 'Placa', value: 'Plate' },
                                { option: 'Modelo', value: 'Model' },
                                { option: 'Cor', value: 'Color' },
                                { option: 'Categoria', value: 'Type' }
                            ]}
                            //Pesquisa.
                            Search={Search} 
                            setSearch={setSearch}
                            SearchHandler = {TableRender && SearchHandler}
                            //Filtro de tipo.
                            FilterType={FilterType} 
                            setFilterType={setFilterType}
                            //Filtro de status.
                            FilterStatus={FilterStatus}
                            setFilterStatus={setFilterStatus}
                            //Carregar pesquisa.
                            setLoaded = { setLoaded }
                        />
                        <VehicleAdd onInsert={setUpdate} />
                    </div>
                        {
                            Loaded ?
                                TableRender ?
                                    !FilterData.length && Search ?
                                        <div className="d-flex align-items-center justify-content-center table-notfound">
                                            <p className="text-center none--container">
                                                <i className="fa-solid fa-magnifying-glass"></i><br />
                                                Nenhum veículo encontrado...
                                            </p>
                                        </div>
                                        :
                                        <div className="d-flex table-border justify-content-center align-items-center my-3 overflow-auto">
                                        <table className="table table-borderless dark-bg text-white table-sm mb-0 mt-3" style={{ width: "40rem" }}>
                                            <thead>
                                                <tr className="default-bg text-center">
                                                    <th scope="col"><i className="bi bi-card-text"></i> Placa</th>
                                                    <th scope="col"><i className="bi bi-car-front"></i> Modelo</th>
                                                    <th scope="col"><i className="bi bi-palette"></i> Cor</th>
                                                    <th scope="col"><i className="bi bi-tags"></i> Categoria</th>
                                                    <th scope="col"><i className="bi bi-gear"></i> Opções</th>
                                                </tr>
                                            </thead>
                                            <tbody className="table-group-divider">
                                                {
                                                    Table.map((item: any, key) => {
                                                        let plate = item.plate.slice(0, 3) + '-' + item.plate.slice(3, 8);
                                                        return (
                                                            <tr key={key}>
                                                                <td style={{ width: '100px' }}>
                                                                    {plate} 
                                                                    { 
                                                                    item.customer && 
                                                                    <OverlayTrigger placement="top"
                                                                    overlay=
                                                                    {
                                                                        <Tooltip className="custom--tooltip">
                                                                                <span className="blue--accent-color"><strong> <i className="fa-solid fa-link"></i><br /> VEÍCULO VINCULADO</strong></span><br />
                                                                                { item.customer }
                                                                        </Tooltip>
                                                                    }>
                                                                    <i className="ms-1 fa-solid fa-link purple--accent-color"></i> 
                                                                    </OverlayTrigger>
                                                                    }
                                                                </td>
                                                                <td> {item.model} </td>
                                                                <td> {item.color} </td>
                                                                <td> {item.type} </td>
                                                                <td className='text-center'>
                                                                    <Status onUpdate={setUpdate} active={item.status} id={ item.id } url='vehicle-crud.php'/>
                                                                    <Edit onEdit={setUpdate} type='vehicle' info={{ ID: item.id, Plate: plate, Model: item.model, Color: item.color, Type: item.type }} url='vehicle-crud.php' />
                                                                    {
                                                                        (permlevel >= 1 && item.status === 'I') &&
                                                                        <Delete id={ item.id } type="veículo" url='vehicle-crud.php' onUpdate={setUpdate}/>
                                                                    }
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                    :
                                    <div className="d-flex align-items-center justify-content-center table-render">
                                        <p className="text-center none--container">
                                            <i className='fa-solid fa-triangle-exclamation'></i><br />
                                            Nenhum veículo registrado.
                                        </p>
                                    </div>
                                :
                                <div className="d-flex w-100 justify-content-center align-items-center table-loader">
                                    <span className="loader"></span>
                                </div>
                        }
                    {
                        (!Search && Loaded && TableRender)
                        &&
                        <Pagination Limit={Limit} Count={Count.count} setOffset={setOffset}/>
                    }
                </div>
            </main>
            <Footer />
        </>
    )
}

export default Vehicles;