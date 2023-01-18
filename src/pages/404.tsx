import React from "react";
import { Link, useNavigate } from "react-router-dom";

const NotFound = () => {
    var navigate = useNavigate();
    return (
        <>
            <main style={{ height: "95vh" }}>
                <div className="d-flex flex-column justify-content-center align-items-center dark--container px-0">
                    <div className="text-center px-4 mt-2">
                        <div className="d-flex justify-content-center align-items-center" style={{height:"3rem"}}>
                            <span className="notfound position-absolute"></span>
                        </div>
                        <br />
                        <h3 className="fw-bold"> 
                        <span className="purple--accent-color" style={{fontSize:"2.5rem"}}>
                        Oops!</span><br/><i className="fa-solid fa-magnifying-glass"></i> Página não encontrada...
                        </h3>
                    </div>
                    <hr className="hr--custom" />
                    <div className="text-center" style={{width:"280px"}}>
                        <h5 className="fw-bold">Encontramos um erro ao tentar acessar essa página...</h5>
                        <p>Sentimos muito, mas, não conseguimos achar esta página!</p>
                    </div>
                    <Link to="" onClick={() => {navigate(-1)}} className="nav-link purple--accent-color"><i className="fa-solid fa-rotate-left"></i> Voltar à página anterior</Link>
                    <br />
                </div>
            </main>
        </>
    )
}

export default NotFound;