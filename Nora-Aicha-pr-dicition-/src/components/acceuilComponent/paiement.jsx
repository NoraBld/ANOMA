import React from "react";
import imageLigne from '../../assets/images/carteDahabia.png';
import imageVertical from '../../assets/images/cartecib.png'; // Remplace avec le chemin de ta deuxième image

const Paiement = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen" style={{ backgroundColor: "#424769" }}>
      {/* Partie texte - 2/4 (Gauche du L) */}
      <div className="w-full md:w-2/4 p-8 text-white z-10 flex items-center justify-center">
        <p className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center leading-relaxed font-poppins">
          Veuillez payer l'abonnement <br />
          soit par carte magnétique <br />
          soit par carte CIB
        </p>
      </div>

      {/* Partie décorative - 2/4 (Droite du L) */}
      <div className="w-full md:w-2/4 h-full relative flex items-center justify-center">
        <div className="w-full md:w-3/4 h-3/4 relative">
          {/* Ligne horizontale */}
          <div className="absolute right-0 top-0 w-full h-[10px] bg-gradient-to-r from-blue-500/50 via-purple-500/30 to-blue-500/50 shadow-md" />

          {/* Ligne verticale */}
          <div className="absolute left-0 bottom-0 w-[10px] h-full bg-gradient-to-b from-blue-500/50 via-purple-500/30 to-blue-500/50 shadow-md" />

          {/* Carte Dahabia alignée sur la ligne verticale */}
          <img
            src={imageLigne}
            alt="Décoration"
            className="absolute left-[-120px] sm:left-[-80px] md:left-[-100px] top-[20px] sm:top-[30px] md:top-[40px] h-[calc(100%-64px)] w-auto"
          />

          {/* Carte CIB déplacée avec un espace adaptable */}
          <img
            src={imageVertical}
            alt="Carte Verticale"
            className="absolute left-[180px] sm:left-[150px] md:left-[200px] top-[60px] sm:top-[90px] md:top-[120px] h-[calc(100%-64px)] w-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default Paiement;
