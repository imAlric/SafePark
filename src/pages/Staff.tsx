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
import Delete from "../components/Delete";
//Componentes especiais.
import StaffAdd from "../components/Staff/StaffAdd";

const Staff = () => {
    //Controla a renderização da tabela caso ache ou não ache resultados no banco.
    const [TableRender, setTableRender] = useState(true);
    const [Loaded, setLoaded] = useState(false);

    //Controla a atualização da página em caso de pesquisa ou inserir novo funcionário.
    //(Atualiza a renderização da tabela em tempo real)
    const [Update, setUpdate] = useState({ data: '', message: '', alert: false });

    //Controla a pesquisa da tabela.
    const [Search, setSearch] = useState('');
    const [FilterType, setFilterType] = useState('');
    const [FilterStatus, setFilterStatus] = useState('Active');

    //Controla as informações da tabela.
    const [TableData, setTableData] = useState([]);
    const [FilterData, setFilterData] = useState([]);

    //Controla a requisição da tabela após a pesquisa ser feita.
    const SearchHandler = useCallback(debounce(():any => { // eslint-disable-line react-hooks/exhaustive-deps
        $.get("http://"+window.location.hostname+":8000/src/php/staff-table.php", 
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

    const [Offset, setOffset] = useState(0); //Offset sendo enviado ao banco.
    const [Count, setCount] = useState<any>(0); //Contagem total dos dados do banco.
    const Limit = 20; // Limite de informações por página.
    //Chama o banco de dados e insere a tabela uma única vez na renderização inicial, ou, caso o usuário
    //pesquise algo ou insira um novo cliente.
    useEffect(() => {
        $.get("http://"+window.location.hostname+":8000/src/php/staff-table.php", 
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
                        <i className="fa-solid fa-user-tie"></i><br />FUNCIONÁRIOS
                    </h4>
                    <div className="d-flex justify-content-center align-items-center">
                        <Filter
                            Options={[
                                { option: 'Nome', value: 'Fullname' },
                                { option: 'Email', value: 'Email' },
                                { option: 'CPF', value: 'CPF' },
                                { option: 'Cargo', value: 'Role' },
                            ]}
                            Type="Staff"
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
                        <StaffAdd onInsert={setUpdate} />
                    </div>
                        {
                            Loaded ?
                                TableRender ?
                                    !FilterData.length && Search ?
                                        <div className="d-flex align-items-center justify-content-center table-notfound">
                                            <p className="text-center none--container">
                                                <i className="fa-solid fa-magnifying-glass"></i><br />
                                                Nenhum funcionário encontrado...
                                            </p>
                                        </div>
                                        :
                                        <div className="d-flex table-border justify-content-center align-items-center my-3 overflow-auto">
                                        <table className="table table-borderless dark-bg text-white table-sm mb-0 mt-3" style={{ width: "40rem" }}>
                                            <thead>
                                                <tr className="default-bg text-center">
                                                    <th scope="col"><i className="bi bi-person"></i> Nome</th>
                                                    <th scope="col"><i className="bi bi-envelope-at"></i> E-mail</th>
                                                    <th scope="col"><i className="bi bi-person-vcard"></i> CPF</th>
                                                    <th scope="col"><i className="bi bi-person-badge"></i> Cargo</th>
                                                    <th scope="col"><i className="bi bi-gear"></i> Opções</th>
                                                </tr>
                                            </thead>
                                            <tbody className="table-group-divider">
                                                {
                                                    Table.map((item: any, key) => {
                                                        let cpf = item.cpf.slice(0, 3) + '.' + item.cpf.slice(3, 6) + '.' + item.cpf.slice(6, 9) + '-' + item.cpf.slice(9, 11);
                                                        return (
                                                            <tr key={key}>
                                                                <td> {item.fullname} </td>
                                                                <td className={ item.email ? "" : "text-center" }> {item.email ? item.email : <i className="bi bi-x-square warning--accent-color"></i>} </td>
                                                                <td> {cpf} </td>
                                                                <td> {item.role} </td>
                                                                <td className='text-center'>
                                                                    <Status onUpdate={setUpdate} active={item.status} id={ item.id } url='staff-crud.php'/>
                                                                    <Edit onEdit={setUpdate} type='staff' info={{ ID: item.id, Fullname: item.fullname, Email: item.email, CPF: cpf, Role: item.role }} url='staff-crud.php' />
                                                                    {
                                                                        item.status === 'I' &&
                                                                        <Delete id={ item.id } type="funcionário" url='staff-crud.php' onUpdate={setUpdate}/>
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
                                            Nenhum funcionário registrado.
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

export default Staff;