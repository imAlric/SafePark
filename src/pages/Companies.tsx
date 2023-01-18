import React, { useEffect, useState, useCallback } from "react";
import { debounce } from "underscore";
import $ from 'jquery';

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
import CustomerLink from "../components/Company/CustomerLink";
import CompanyAdd from "../components/Company/CompanyAdd";

const Companies = () => {
    //Controla a renderização da tabela caso ache ou não ache resultados no banco.
    const [TableRender, setTableRender] = useState(true);
    const [Loaded, setLoaded] = useState(false);

    //Controla a atualização da página em caso de pesquisa ou inserir novo funcionário.
    //(Atualiza a renderização da tabela em tempo real)
    const [Update, setUpdate] = useState({ data: '', message: '', alert: false });

    //Controla a pesquisa da tabela.
    const [Search, setSearch] = useState('');
    const [FilterType, setFilterType] = useState('');

    //Controla as informações da tabela.
    const [TableData, setTableData] = useState([]);
    const [FilterData, setFilterData] = useState([]);
    const [FilterStatus, setFilterStatus] = useState('Active');

    //Controla a requisição da tabela após a pesquisa ser feita.
    const SearchHandler = useCallback(debounce(():any => { // eslint-disable-line react-hooks/exhaustive-deps
        $.get("http://"+window.location.hostname+":8000/src/php/companies-table.php", 
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
        $.get("http://"+window.location.hostname+":8000/src/php/companies-table.php", 
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
                <div className="main--container staff--container position-relative">
                    <h4 className="text-center mt-4 fw-bold">
                        <i className="fa-solid fa-building"></i><br />EMPRESAS
                    </h4>
                    <div className="d-flex justify-content-center align-items-center">
                        <Filter
                            Options={[
                                { option: 'Razão Social', value: 'Fullname' },
                                { option: 'CNPJ', value: 'CNPJ' },
                                { option: 'Email', value: 'Email' },
                                { option: 'Telefone', value: 'Phone' },
                            ]}
                            Type="Company"
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
                        <CompanyAdd onInsert={setUpdate} />
                    </div>
                        {
                            Loaded ?
                                TableRender ?
                                    !FilterData.length && Search ?
                                        <div className="d-flex align-items-center justify-content-center table-notfound">
                                            <p className="text-center none--container">
                                                <i className="fa-solid fa-magnifying-glass"></i><br />
                                                Nenhuma empresa encontrada...
                                            </p>
                                        </div>
                                        :
                                        <div className="d-flex table-border justify-content-center align-items-center my-3 overflow-auto">
                                        <table className="table table-borderless dark-bg text-white table-sm mb-0 mt-3" style={{ width: "40rem" }}>
                                            <thead>
                                                <tr className="default-bg text-center">
                                                    <th scope="col"><i className="bi bi-person"></i> Razão Social</th>
                                                    <th scope="col"><i className="bi bi-person-vcard"></i> CNPJ</th>
                                                    <th scope="col"><i className="bi bi-envelope-at"></i> E-mail</th>
                                                    <th scope="col"><i className="bi bi-telephone"></i> Telefone</th>
                                                    <th scope="col"><i className="bi bi-gear"></i> Opções</th>
                                                </tr>
                                            </thead>
                                            <tbody className="table-group-divider">
                                                {
                                                    Table.map((item: any, key) => {
                                                        let cnpj = item.cnpj.slice(0,2) + '.' + item.cnpj.slice(2,5) + '.' + item.cnpj.slice(5,8) + '/' + item.cnpj.slice(8,12) + '-' + item.cnpj.slice(12,14);
                                                        let phone = '(' + item.phone.slice(0, 2) + ') ' + item.phone.slice(2, 6) + '-' + item.phone.slice(6, 10);
                                                        return (
                                                            <tr key={key}>
                                                                <td> {item.fullname} </td>
                                                                <td> {cnpj} </td>
                                                                <td> {item.email} </td>
                                                                <td> {phone} </td>
                                                                <td className='text-center'>
                                                                    <Status onUpdate={setUpdate} active={item.status} id={ item.id } url='companies-crud.php'/>
                                                                    <Edit onEdit={setUpdate} type='company' info={{ ID: item.id, Fullname: item.fullname, CNPJ: cnpj, Email: item.email, Phone: phone }} url='companies-crud.php' />
                                                                    <Monthly id={ item.id } idbilling={ item.idbilling } validity = { item.billingval } url='companies-crud.php' onUpdate={setUpdate}/>     
                                                                    {
                                                                        item.status === 'I' &&
                                                                        <Delete id={ item.id } type="empresa" url='companies-crud.php' onUpdate={setUpdate}/>  
                                                                    }                        
                                                                    <CustomerLink id={ item.id } current={ item.fullname }/>
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
                                            Nenhuma empresa registrada.
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

export default Companies;