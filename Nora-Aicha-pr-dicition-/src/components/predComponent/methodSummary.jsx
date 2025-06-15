import React from 'react';
import method from '../../assets/images/analyse.png';
import param from '../../assets/images/parametres-des-engrenages.png';
import erreurIcon from '../../assets/images/etat-derreur.png';

const MethodSummary = ({ sommaire }) => {

  if (!sommaire || sommaire.length === 0) {
    return (
      <div className="text-center text-gray-500">
        
      </div>
    );
  }

  return (
    <>
      {sommaire.map((item, index) => (
        <div key={index} className="bg-white p-6 mb-8 border border-[#162556] rounded-2xl shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-blue-950 text-center">
            Informations Clés de l'Analyse
          </h2>
          <div className="flex gap-6 w-full flex-col md:flex-row">
            {/* Méthode */}
            <div className="bg-fuchsia-100 p-6 rounded-sm shadow-md text-center transition duration-300 hover:scale-105 hover:shadow-lg flex-1">
              <img src={method} alt="Méthode Utilisée" className="w-6 mb-2 mx-auto" />
              <h3 className="text-lg font-bold mb-2 text-[#162556]">Méthode Utilisée</h3>
              <p className="text-gray-600">Méthode : {item.nommethode}</p>
            </div>

            {/* Paramètres */}
            <div className="bg-amber-50 p-6 rounded-sm shadow-md text-center transition duration-300 hover:scale-105 hover:shadow-lg flex-1">
              <img src={param} alt="Paramètres" className="w-6 mb-2 mx-auto" />
              <h3 className="text-lg font-bold mb-2 text-[#162556]">Paramètres</h3>
              {item.nommethode === 'SARIMA' || item.nommethode === 'SARIMAX' ? (
               <div className="text-gray-600 space-y-1">
    <p>p : {item.p}</p>
    <p>d : {item.d}</p>
    <p>q : {item.q}</p>
    <p>P : {item.P}</p>
    <p>D : {item.D}</p>
    <p>Q : {item.Q}</p>
    <p>AIC : {item.AIC}</p>
  </div>
  
) : (
  <div className="text-gray-600 space-y-1">
    <p>learning_rate : {item.learning_rate}</p>
    <p>units : {item.units}</p>
    <p>dropout : {item.dropout}</p>
    <p>epochs : {item.epochs}</p>
    <p>batch_size : {item.batch_size}</p>
    <p>loss : {item.loss}</p>
    <p>time_step : {item.time_step}</p>
    <p>patience : {item.patience}</p>
    <p>split_ratio : {item.split_ratio}</p>
  </div>
)}
</div>

            {/* Erreur */}
            <div className="bg-emerald-50 p-6 rounded-sm shadow-md text-center transition duration-300 hover:scale-105 hover:shadow-lg flex-1">
              <img src={erreurIcon} alt="Taux d'Erreur" className="w-6 mb-2 mx-auto" />
              <h3 className="text-lg font-bold mb-2 text-[#162556]">Taux d'Erreur</h3>
              {item.erreur && <p className="text-gray-600">Erreur : {item.erreur} %</p>}
            </div>
          </div>
        </div>
      ))}
    </>
  );

};

export default MethodSummary;
