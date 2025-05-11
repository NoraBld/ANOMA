import NavBar from "../components/acceuilComponent/navBar";
import Presentation from "../components/acceuilComponent/presenation";
import Abonnement from "../components/acceuilComponent/abonnement";
import Paiement from "../components/acceuilComponent/Paiement";
import Footer from "../components/acceuilComponent/footer";
import React from "react";




const Acceuil = () => {
    return (
        <div>
            <NavBar />
            <Presentation /> 
            <Abonnement/>
            <Paiement/>
            {/* {/* <Fonctionalite /> */}
            {/* <Paiement /> */}
            <Footer /> 
        </div>
    );
};

export default Acceuil;