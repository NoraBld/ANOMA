import NavBar from "../components/acceuilComponent/navBar";
import Presentation from "../components/acceuilComponent/presenation";
import Abonnement from "../components/acceuilComponent/abonnement";

import Footer from "../components/acceuilComponent/footer";
import React from "react";




const Acceuil = () => {
    return (
        <div>
            <NavBar />
            <Presentation /> 
            <Abonnement/>
            
            <Footer /> 
        </div>
    );
};

export default Acceuil;