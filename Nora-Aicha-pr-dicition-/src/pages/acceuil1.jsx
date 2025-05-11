import NavBar from "../components/acceuilComponent1/navBar";
import Presentation from "../components/acceuilComponent1/presentation";
import Fonctionalite from "../components/acceuilComponent1/fonctionalite";
import Paiement from "../components/acceuilComponent1/paiement";
import Footer from "../components/acceuilComponent1/footer";
import React from "react";




const Acceuil = () => {
    return (
        <div>
            <NavBar />
            {/* <Presentation /> */}
            <Fonctionalite />
            <Paiement />
            <Footer />
        </div>
    );
};

export default Acceuil;