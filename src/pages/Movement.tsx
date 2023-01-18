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
import Status from "../components/Movement/Status";
import Filter from "../components/Filter";
import Pagination from "../components/Pagination";
//Componentes especiais.
import CheckIn from "../components/Movement/CheckIn";
import CheckOut from "../components/Movement/CheckOut";
import Cancel from "../components/Movement/Cancel";
import Info from "../components/Movement/Info";

import Now from "../assets/ts/datetime";

const Movement = () => {
    //Nível de permissão.
    const permlevel = parseInt(AES.decrypt(Cookies.get('PLVL')!, Cookies.get('AESP')!).toString(CryptoJS.enc.Utf8));
    const iduser = parseInt(AES.decrypt(Cookies.get('UID')!, Cookies.get('AESP')!).toString(CryptoJS.enc.Utf8));

    //Data e hora atual.
    var DateFunc:any = new Now();
    var CurrentDate = DateFunc.Date();
    var CurrentTime = DateFunc.Time();

    //Controla a renderização da tabela caso ache ou não ache resultados no banco.
    const [TableRender, setTableRender] = useState(true);
    const [Loaded, setLoaded] = useState(false);

    //Controla a atualização da página em caso de pesquisa ou inserir novo movimento.
    //(Atualiza a renderização da tabela em tempo real)
    const [Update, setUpdate] = useState({ data: '' });

    //Controla a pesquisa da tabela.
    const [Search, setSearch] = useState('');
    const [FilterType, setFilterType] = useState('');
    const [FilterStatus, setFilterStatus] = useState('Active');
    const [FormData, setFormData] = useState({StartDate:CurrentDate, EndDate:CurrentDate});
    const FormHandler = (e:any) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            [e.target.name]: e.target.value
        }));
    }

    //Controla as informações da tabela.
    const [TableData, setTableData] = useState([]);
    const [FilterData, setFilterData] = useState([]);

    //Controla a requisição da tabela após a pesquisa ser feita.
    const SearchHandler = useCallback(debounce(():any => { // eslint-disable-line react-hooks/exhaustive-deps
    setLoaded(false);
    $.get("http://"+window.location.hostname+":8000/src/php/movements-table.php", 
    { Action: "search", Status: FilterStatus, StartDate: $('#startdate').val(), EndDate: $('#enddate').val(), 
    UserID:iduser, PermLvl: permlevel,
    search: $('#filter').val(), filter: $("#filtertype").val() },
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
    //pesquise algo ou insira um novo movimento.
    useEffect(() => {
        setLoaded(false);
        $.get("http://"+window.location.hostname+":8000/src/php/movements-table.php", 
        { Action: "table", Status: FilterStatus, StartDate: FormData.StartDate, EndDate: FormData.EndDate, 
        UserID:iduser, PermLvl: permlevel, 
        Limit: Limit, Offset: Offset }, 
        (response) => {
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
    }, [Update, Offset, FilterStatus, FormData.StartDate, FormData.EndDate]); // eslint-disable-line react-hooks/exhaustive-deps
    /* Banco de Dados */

    //Decide se deve mostrar a tabela completa ou apenas os itens filtrados.
    var Table = [];
    Search ? Table = FilterData : Table = TableData;

    return (
        <>
            <Navbar />
            <main>
                <div className="main--container movement--container" style={{width:"60rem"}}>
                    <h4 className="text-center mt-4 fw-bold">
                        <i className="fa-solid fa-arrows-up-down-left-right"></i><br />MOVIMENTOS
                    </h4> 
                    <div className="d-flex justify-content-center align-items-center">
                        <div className="d-flex align-items-center form--container date--range">
                            <div className="d-flex flex-column text-start my-2 mx-2">
                                <input 
                                value={FormData.StartDate}
                                onChange={(e:any) => {
                                    if((new Date(e.target.value) > new Date(CurrentDate)) || !DateFunc.isValidDate(new Date(e.target.value))){
                                        setFormData(prevFormData => ({...prevFormData, StartDate: CurrentDate }))
                                    } else
                                    FormHandler(e);
                                }}
                                type="date" 
                                className="dark-bg sm-x" 
                                name="StartDate" 
                                id="startdate" 
                                max={CurrentDate}
                                required
                                />
                            </div>
                            <i className="fa-solid fa-arrow-right-arrow-left"></i>
                            <div className="d-flex flex-column text-start my-2 mx-2">
                                <input 
                                value={FormData.EndDate}
                                onChange={(e:any) => {
                                    if((new Date(e.target.value) > new Date(CurrentDate)) || !DateFunc.isValidDate(new Date(e.target.value))){
                                        setFormData(prevFormData => ({...prevFormData, EndDate: CurrentDate }))
                                    } else
                                    FormHandler(e);
                                }}
                                type="date" 
                                className="dark-bg sm-x" 
                                name="EndDate" 
                                id="enddate" 
                                max={CurrentDate}
                                required
                                />
                            </div>
                        </div>
                        <Filter
                            Options={[
                                { option: 'Placa', value: 'Plate' },
                                { option: 'Cliente', value: 'Customer' },
                                { option: 'Empresa', value: 'Company' },
                                { option: 'Vaga', value: 'Spot' },
                                { option: 'Manobrista', value: 'Valet' },
                            ]}
                            Type="Movement"
                            //Pesquisa.
                            Search={Search} 
                            setSearch={setSearch}
                            SearchHandler={TableRender && SearchHandler}
                            //Filtro de tipo.
                            FilterType={FilterType} 
                            setFilterType={setFilterType}
                            //Filtro de status.
                            FilterStatus={FilterStatus}
                            setFilterStatus={setFilterStatus}
                            //Carregar pesquisa.
                            setLoaded = { setLoaded }
                        />
                        <CheckIn onInsert={ setUpdate }/>
                    </div>
                        {
                            Loaded ?
                                TableRender ?
                                    !FilterData.length && Search ?
                                        <div className="d-flex align-items-center justify-content-center table-notfound">
                                            <p className="text-center none--container">
                                                <i className="fa-solid fa-magnifying-glass"></i><br />
                                                Nenhum movimento encontrado...
                                            </p>
                                        </div>
                                        :
                                        <div className="d-flex table-border justify-content-center align-items-center my-3 mx-auto overflow-auto" style={{ width: "50rem" }}>
                                        <table className="table table-borderless dark-bg text-white table-sm mb-0 mt-3" style={{ width: "50rem" }}>
                                            <thead>
                                                <tr className="default-bg text-center">
                                                    <th scope="col"><i className="bi bi-card-text"></i> ID</th>
                                                    <th scope="col"><i className="bi bi-p-square"></i> Vaga</th>
                                                    <th scope="col"><i className="bi bi-car-front"></i> Veículo</th>
                                                    <th scope="col"><i className="bi bi-calendar3"></i> Entrada</th>
                                                    <th scope="col"><i className="bi bi-clock"></i> Entrada</th>
                                                    <th scope="col"><i className="bi bi-calendar3"></i> Saída</th>
                                                    <th scope="col"><i className="bi bi-clock"></i> Saída</th>
                                                    <th scope="col"><i className="bi bi-gear"></i> Opções</th>
                                                </tr>
                                            </thead>
                                            <tbody className="table-group-divider">
                                                {
                                                    Table.map((item: any, key:any) => {
                                                        return (
                                                            <tr key={key}>
                                                                <td className="text-center" style={{ width: '50px' }}>{item.id} </td>
                                                                <td className="text-center"> <span className="fw-bold">{item.spot}</span> </td>
                                                                <td className="text-center"> {item.vehicle.slice(0,3)+'-'+item.vehicle.slice(3,7)} </td>
                                                                <td className="text-center"> {DateFunc.FormatDateGMT(item.entrydate)} </td>
                                                                <td className="text-center"> {item.entrytime.slice(0,5)} </td>
                                                                <td className="text-center"> 
                                                                { 
                                                                item.exitdate 
                                                                ? 
                                                                DateFunc.FormatDateGMT(item.exitdate)
                                                                :   
                                                                <>
                                                                {
                                                                    item.expectedexit 
                                                                    ? 
                                                                    <OverlayTrigger placement="top" overlay={
                                                                        <Tooltip>
                                                                            <i className="bi bi-clock blue--accent-color"></i><br />
                                                                            <span className="blue--accent-color">Saída Esperada:</span> <br />{DateFunc.FormatDateTimeGMT(item.expectedexit)}
                                                                        </Tooltip>
                                                                    }>
                                                                        {
                                                                        (new Date(CurrentDate+' '+CurrentTime) > new Date(item.expectedexit))
                                                                        ?
                                                                        <i className="bi bi-clock warning--accent-color"></i>
                                                                        :
                                                                            (DateFunc.DiffMins(new Date(CurrentDate+' '+CurrentTime), new Date(item.expectedexit))) <= 15
                                                                            ?
                                                                            <i className="bi bi-clock text-warning"></i>
                                                                            :
                                                                            <i className="bi bi-clock purple--accent-color"></i>
                                                                        }
                                                                    </OverlayTrigger>
                                                                    : 
                                                                    <OverlayTrigger placement="top" overlay={
                                                                        <Tooltip>
                                                                            <i className="fa-regular fa-clock blue--accent-color"></i><br />
                                                                            Nenhuma previsão de saída disponível...
                                                                        </Tooltip>
                                                                        }>
                                                                        <i className="bi bi-x-square purple--accent-color"></i>
                                                                    </OverlayTrigger>
                                                                }
                                                                </>
                                                                } 
                                                                </td>
                                                                <td className="text-center"> 
                                                                { 
                                                                item.exittime 
                                                                ? 
                                                                item.exittime.slice(0,5) 
                                                                : 
                                                                    item.expectedexit 
                                                                    ? 
                                                                    <OverlayTrigger placement="top" overlay={
                                                                        <Tooltip>
                                                                            <i className="bi bi-clock blue--accent-color"></i><br />
                                                                            <span className="blue--accent-color">Saída Esperada:</span> <br />{DateFunc.FormatDateTimeGMT(item.expectedexit)}
                                                                        </Tooltip>
                                                                    }>
                                                                        {
                                                                        (new Date(CurrentDate+' '+CurrentTime) > new Date(item.expectedexit))
                                                                        ?
                                                                        <i className="bi bi-clock warning--accent-color"></i>
                                                                        :
                                                                            (DateFunc.DiffMins(new Date(CurrentDate+' '+CurrentTime), new Date(item.expectedexit))) <= 15
                                                                            ?
                                                                            <i className="bi bi-clock text-warning"></i>
                                                                            :
                                                                            <i className="bi bi-clock purple--accent-color"></i>
                                                                        }
                                                                    </OverlayTrigger>
                                                                    : 
                                                                    <OverlayTrigger placement="top" overlay={
                                                                        <Tooltip>
                                                                            <i className="fa-regular fa-clock blue--accent-color"></i><br />
                                                                            Nenhuma previsão de saída disponível...
                                                                        </Tooltip>
                                                                        }>
                                                                        <i className="bi bi-x-square purple--accent-color"></i>
                                                                    </OverlayTrigger>
                                                                }
                                                                </td>
                                                                <td className='text-center'>
                                                                    { item.status === 'A' && 
                                                                    <CheckOut item={ item } onRemove={ setUpdate }/> }
                                                                    { 
                                                                    item.status === 'F' 
                                                                    ?
                                                                    <OverlayTrigger placement="top" overlay={
                                                                        <Tooltip>
                                                                            <i className="fa-solid fa-square-check success--accent-color"></i><br />
                                                                            <span>Movimento Finalizado!</span>
                                                                        </Tooltip>
                                                                    }><i className="fa-solid fa-square-check success--accent-color mx-1"></i></OverlayTrigger>
                                                                    :
                                                                    permlevel >= 1 && 
                                                                    <Status onUpdate={setUpdate} active={ item.status } id={ item.id }/> 
                                                                    }
                                                                    {
                                                                    (permlevel >= 1 && (item.status === 'I' || item.status === 'F')) &&
                                                                    <Cancel id={ item.id } onUpdate={setUpdate}/>
                                                                    }
                                                                    <Info item={item} permlevel={permlevel} active={ item.status }/>
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
                                            Nenhum movimento registrado.
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

export default Movement;