import React from "react";

//Componentes fixos.
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Home = () => {
    return (
        <>
            <Navbar />
            <main>
                <div className="d-flex text-center text-white flex-column home--main">
                    <p style={{ fontSize: "24px", marginBottom: "-10px" }}>Bem-vindo ao</p>
                    <span className="fw-bold" style={{ fontSize: "48px" }}>Safe Park!</span>
                    <p>Estacione sempre seguro.</p>
                    <span className="main--warning"><i className='bx bx-error'></i><br />sistema para uso interno</span>
                </div>
            </main>
            <Footer />
        </>
    )
}

export default Home;