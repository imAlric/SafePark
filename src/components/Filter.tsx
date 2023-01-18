import React, { useCallback } from "react";
import { Form } from "react-bootstrap";

const Filter = (props:any) => {
    //Atualiza as informações do formulário quando o usuário digita.
    const FormHandler = useCallback(
        (e:any) => {
            props.setSearch(e.target.value)
        }, [props.setSearch] // eslint-disable-line react-hooks/exhaustive-deps
    );

    //Atualiza qual o filtro escolhido pelo usuário.
    const FilterHandler = useCallback( 
        (e:any) => {
            props.setFilterType(e.target.value)
        }, [props.setFilterType] // eslint-disable-line react-hooks/exhaustive-deps
    ); 

    //Atualiza qual estado foi escolhido pelo usuário.
    const StatusOptions = 
    props.Type === 'Movement' ? 
    ['all','active','inactive','finished',] : 
    (props.Type === 'Company' || props.Type === 'Staff')? 
    ['all','active','inactive'] :
    ['all','active','inactive', 'linked', 'unlinked']

    const statusHandler = useCallback(
        (e:any) => {
            props.setFilterStatus(e.target.value)
        }, [props.setFilterStatus] // eslint-disable-line react-hooks/exhaustive-deps
    ); 

    const submitHandler = (e:any) => {
        e.preventDefault();
    }

    return (
        <div>
            <form onSubmit={submitHandler}>
                <div className="d-flex align-items-center filter">
                    <div className="position-relative filter">
                        <i className="fa-solid fa-search" style={{ position: "absolute", right: "1.5rem", top: "11px" }}></i>
                        <input
                            type="text"
                            id="filter"
                            onChange={e => {FormHandler(e); props.SearchHandler(); props.setLoaded(false);}}
                            value={props.Search}
                            name="Filter"
                            placeholder="Pesquisar..."
                            autoComplete="off"
                            className="vehicle--option text-white text-decoration-none me-2"
                        />
                    </div>
                    <select
                        value={props.FilterType}
                        onChange={e => {FilterHandler(e); props.SearchHandler(); props.setLoaded(false)}}
                        name="FilterSelect"
                        id="filtertype"
                        className="dark-bg text-white"
                    >
                        <option value="" defaultValue="true" className="d-none">Filtrar por...</option>
                        {props.Options.map((item:any, key:any) => {
                            return (
                                <option key={key} value={item.value}>{item.option}</option>
                            )
                        })}
                    </select>
                    <div className="d-flex align-items-center mx-2">
                        {
                            (StatusOptions).map((item:any, key:any) => {
                                return(
                                <span key={key} className="purple--accent-color mx-2">
                                    <label htmlFor={item}>
                                    { 
                                    item === 'all' ? <i className="fa-solid fa-border-all"></i> : 
                                    item === 'active' ? <i className="fa-solid fa-toggle-on"></i> : 
                                    item === 'inactive' ? <i className="fa-solid fa-toggle-off"></i> : 
                                    item === 'linked' ? <i className="fa-solid fa-link"></i> : 
                                    item === 'unlinked' ? <i className="fa-solid fa-link-slash"></i> : 
                                    item === 'finished' ? <i className="fa-solid fa-square-check"></i> : 
                                    ''
                                    }
                                    </label>
                                    <Form.Check
                                    type="radio"
                                    id={item}
                                    name="Status"
                                    value={item[0].toUpperCase() + item.substring(1)}
                                    checked={props.FilterStatus === item[0].toUpperCase() + item.substring(1)}
                                    onChange={statusHandler}
                                    />
                                </span>
                                )
                            })
                        }
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Filter;