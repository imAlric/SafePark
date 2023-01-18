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
import Monthly from "../components/Monthly";
import Delete from "../components/Delete";
//Componentes especiais.
import CustomerAdd from "../components/Customer/CustomerAdd";
import CarLink from "../components/Customer/CarLink";

const Customers = () => {
    //Nível de permissão.
    const permlevel = parseInt(AES.decrypt(Cookies.get('PLVL')!, Cookies.get('AESP')!).toString(CryptoJS.enc.Utf8));

    //Controla a renderização da tabela caso ache ou não ache resultados no banco.
    const [TableRender, setTableRender] = useState(true);
    const [Loaded, setLoaded] = useState(false);

    //Controla a atualização da página em caso de pesquisa ou inserir novo cliente.
    //(Atualiza a renderização da tabela em tempo real)
    const [Update, setUpdate] = useState({ data: '' });

    //Controla a pesquisa da tabela.
    const [Search, setSearch] = useState('');
    const [FilterType, setFilterType] = useState('');
    const [FilterStatus, setFilterStatus] = useState('Active');

    //Controla as informações da tabela.
    const [TableData, setTableData] = useState([]);
    const [FilterData, setFilterData] = useState([]);

    //Controla a requisição da tabela após a pesquisa ser feita.
    const SearchHandler = useCallback(debounce(():any => { // eslint-disable-line react-hooks/exhaustive-deps
        $.get("http://"+window.location.hostname+":8000/src/php/customers-table.php", 
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
        $.get("http://"+window.location.hostname+":8000/src/php/customers-table.php", 
        { Action: "table", Limit: Limit, Offset: Offset, Status: FilterStatus }, (response) => {
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
    Table = Search ? FilterData : TableData;

    return (
        <>
            <Navbar />
            <main>
                <div className="main--container customers--container position-relative">
                    <h4 className="text-center mt-4 fw-bold">
                        <i className="fa-solid fa-users"></i><br />CLIENTES
                    </h4>
                    <div className="d-flex justify-content-center align-items-center">
                        <Filter
                            //Opções de filtro.
                            Options={[
                                { option: 'Nome', value: 'Fullname' },
                                { option: 'CPF', value: 'CPF' },
                                { option: 'Celular', value: 'Phone' },
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
                        <CustomerAdd onInsert={setUpdate} />
                    </div>
                        {
                            Loaded ?
                                TableRender ?
                                    !FilterData.length && Search ?
                                        <div className="d-flex align-items-center justify-content-center table-notfound">
                                            <p className="text-center none--container">
                                                <i className="fa-solid fa-magnifying-glass"></i><br />
                                                Nenhum cliente encontrado...
                                            </p>
                                        </div>
                                        :
                                        <div className="d-flex justify-content-center align-items-center my-3 overflow-auto table-border">
                                        <table className="table table-borderless dark-bg text-white table-sm mb-0 mt-3" style={{ width: "40rem" }}>
                                            <thead>
                                                <tr className="default-bg text-center">
                                                    <th scope="col"><i className="bi bi-person"></i> Nome</th>
                                                    <th scope="col"><i className="bi bi-person-vcard"></i> CPF</th>
                                                    <th scope="col"><i className="bi bi-phone"></i> Celular</th>
                                                    <th scope="col"><i className="bi bi-gear"></i> Opções</th>
                                                </tr>
                                            </thead>
                                            <tbody className="table-group-divider">
                                                {
                                                    Table.map((item: any, key) => {
                                                        let cpf = item.cpf.slice(0, 3) + '.' + item.cpf.slice(3, 6) + '.' + item.cpf.slice(6, 9) + '-' + item.cpf.slice(9, 11);
                                                        let phone = '(' + item.phone.slice(0, 2) + ') ' + item.phone.slice(2, 7) + '-' + item.phone.slice(7, 11);
                                                        return (
                                                            <tr key={key}>
                                                                <td> {item.fullname} </td>
                                                                <td> { cpf } { 
                                                                    item.company && 
                                                                    <OverlayTrigger placement="top"
                                                                        overlay={
                                                                            <Tooltip className="custom--tooltip">
                                                                                    <span className="blue--accent-color"><strong> <i className="fa-solid fa-link"></i><br /> CLIENTE VINCULADO</strong></span><br />
                                                                                    { item.company }
                                                                            </Tooltip>
                                                                        }>
                                                                    <i className="ms-1 fa-solid fa-link purple--accent-color"></i> 
                                                                    </OverlayTrigger>
                                                                }
                                                                </td>
                                                                <td> { phone } </td>
                                                                <td className='text-center'>
                                                                    <Status onUpdate={setUpdate} active={item.status} id={ item.id } url='customers-crud.php'/>
                                                                    <Edit onEdit={setUpdate} type='customer' info={{ ID: item.id, Fullname: item.fullname, CPF: cpf, Phone: phone }} url='customers-crud.php' />
                                                                    {
                                                                        !item.company &&
                                                                        <Monthly id={ item.id } idbilling={ item.idbilling } validity = { item.billingval } url='customers-crud.php' onUpdate={setUpdate}/>
                                                                    }
                                                                    <CarLink id={ item.id } current={ item.fullname } />
                                                                    {
                                                                        (permlevel >= 1 && item.status === 'I') &&
                                                                        <Delete id={ item.id } type="cliente" url='customers-crud.php' onUpdate={setUpdate}/>
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
                                            Nenhum cliente registrado.
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

export default Customers;