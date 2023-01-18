import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import CryptoJS, { AES } from "crypto-js";
import $ from "jquery";

//Alerta de sucesso.
import { useToast } from "izitoast-react";
import "../lib/izitoast/dist/css/iziToast.min.css";

const Status = (props:any) => {
    //ID do usuário.
    const iduser = parseInt(AES.decrypt(Cookies.get('UID')!, Cookies.get('AESP')!).toString(CryptoJS.enc.Utf8));

    var isActive = props.active === 'A' ? true : false;
    const [Enabled, setEnabled] = useState(isActive);

    const handlePageUpdate = useCallback((e:any) => {props.onUpdate(e)}, [props.onUpdate]); // eslint-disable-line react-hooks/exhaustive-deps

    //Controla o aviso de erro.
    const Alert = useToast({
        id:"alert",
        title: Enabled ? "Desativado!" : "Ativado!",
        message: Enabled ? "Desativado com sucesso!" : "Ativado com sucesso!",
        layout:2,
        theme: "light",
        color: Enabled ? "red" : "green",
        icon: Enabled ? "fa-solid fa-toggle-off" :"fa-solid fa-toggle-on",
        position: "topCenter",
        displayMode:2,
        maxWidth:250,
        timeout:3000,
    });

    const stateHandler = (e:any) => {
        e.preventDefault();
        $.post("http://"+window.location.hostname+":8000/src/php/"+props.url,
        { Action: "status", status:(Enabled ? 'A' : 'I'), UserID: iduser, id:props.id },
        (response) => {
            var jsonData = JSON.parse(response);
            Alert();
            setEnabled(!Enabled);
            handlePageUpdate(jsonData);
        })
    }
    return(
    <>
    <Link onClick={stateHandler} to="#" className="purple--accent-color mx-1 position-relative" style={{top:"2px"}}>
        <i className={ "bi "+(Enabled ? "bi-toggle-on" : "bi-toggle-off text-muted")}></i>
    </Link>
    </>
    )
}

export default Status;