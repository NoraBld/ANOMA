import React, { useState } from 'react';


const NewPredictionButton = ({  onNewPrediction }) => {

  const [showForm, setShowForm] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [predictionPeriod, setPredictionPeriod] = useState('');
  const [fileFormat, setFileFormat] = useState('');
  const [file, setFile] = useState(null);
  const [showModel, setShowModel] = useState(false);

  const [exogFile, setExogFile] = useState(null);


  const methodInfo = {
    SARIMA: {
      nom : 'SARIMA',
      maxSize: '2MB',
      formats: ['CSV', 'Excel'],
    },
     SARIMAX: {
      nom : 'SARIMAX',

      maxSize: '2MB',
      formats: ['CSV', 'Excel'],
    },
    GRU: {

      nom : 'GRU',

      maxSize: '5MB',
      formats: ['CSV', 'Excel'],
    },
  };



const handleValidate = async () => {
  const formData = new FormData();
  const formData2= new FormData();
  const formData3= new FormData();
  let nb_gru =0;
  formData.append("periode", predictionPeriod);
  const methode = methodInfo[selectedMethod].nom;
  formData.append("nommethode", methode);

  if (methode === "SARIMAX") {
    // formData.append("fichier", exogFile);
    formData2.append("periode", predictionPeriod);
    formData2.append("nommethode", methode);
    // formData2.append("fichier", file);
    // formData2.append("fichierexog", exogFile)
    



  } else {
    // formData.append("fichier", file);
  }
 
  try {
    let response = null;

    if (methode === "SARIMA") {
      response = await fetch("http://localhost:8000/predict/sarima", {
        method: "POST",
        body: formData,
      });
    } else if (methode === "SARIMAX") {
      const sarimaResponse = await fetch("http://localhost:8000/predict/sarima", {
        method: "POST",
        body: formData,
      });
      if (!sarimaResponse.ok) {
        throw new Error("Erreur lors de la prédiction SARIMA de la requette sarimax");
      }
      const sarimaData = await sarimaResponse.json();
      const { dates, valeurs } = sarimaData;
      dates.forEach((date) => formData2.append("dates", date));
      valeurs.forEach((val) => formData2.append("valeurs", val));
      
      response = await fetch("http://localhost:8000/predict/sarimax", {
        method: "POST",
   
        body: formData2,
  });
 
    } else if (methode === "GRU") {
      response = await fetch("http://localhost:8000/predict/gru", {
        method: "POST",
        body: formData,
      });
      // nb_gru ++ ;
    }

    if (!response || !response.ok) {
      throw new Error("Échec de la prédiction");

    }

    const data = await response.json();
    console.log("Réponse du serveur :", data);


    if (data.dates && data.valeurs) {
      // setPredictionData({
      //   Date: data.dates,
      //   Valeurs: data.valeurs
      // });

if (data.nom_de_la_methode === "SARIMA" || data.nom_de_la_methode === "SARIMAX")
{
const predictionFormatted = {
  Date: data.dates,
  Valeurs: data.valeurs,
  methode: data.nom_de_la_methode,
  periode: predictionPeriod,
  len: data.data_len

};
const sommaireFormatted={
        erreur: data.taux_erreur_mape,
        p: data.meilleurs_parametres.p,
        d: data.meilleurs_parametres.d,
        q: data.meilleurs_parametres.q,
        P: data.meilleurs_parametres.P,
        D: data.meilleurs_parametres.D,
        Q: data.meilleurs_parametres.Q,
        AIC: data.aic_bestmodel,
        nommethode: data.nom_de_la_methode
};
const selectFormatted={
  methode: data.nom_de_la_methode,
  nommethode: data.nom_de_la_methode

};
onNewPrediction(predictionFormatted, sommaireFormatted, selectFormatted);

}
if (data.nom_de_la_methode === "GRU")
{
// const nomdemethode = `${data.nom_de_la_methode}${nb_gru}`;

const predictionFormatted = {
  Date: data.dates,
  Valeurs: data.valeurs,
  // methode: nomdemethode
  methode: data.nom_de_la_methode,
  periode: predictionPeriod,
  len: data.data_len
};
const sommaireFormatted={
        erreur: data.taux_erreur_mape,
        learning_rate :data.meilleurs_parametres.learning_rate,
        units :data.meilleurs_parametres.units,
        dropout :data.meilleurs_parametres.dropout,
        epochs :data.meilleurs_parametres.epochs,
        batch_size :data.meilleurs_parametres.batch_size,
        time_step :data.meilleurs_parametres.time_step,
        loss :data.meilleurs_parametres.loss,
        patience :data.meilleurs_parametres.patience,
        split_ratio :data.meilleurs_parametres.split_ratio,
        nommethode: data.nom_de_la_methode
};
const selectFormatted={
  methode: data.nom_de_la_methode,
  nommethode: data.nom_de_la_methode

};
onNewPrediction(predictionFormatted, sommaireFormatted, selectFormatted);

}





      // setSommaire({
      //   erreur: data.taux_erreur_mape,
      //   p: data.meilleurs_parametres.p,
      //   d: data.meilleurs_parametres.d,
      //   q: data.meilleurs_parametres.q,
      //   P: data.meilleurs_parametres.P,
      //   D: data.meilleurs_parametres.D,
      //   Q: data.meilleurs_parametres.Q,
      //   nommethode: data.nom_de_la_methode
      // });

      alert("Prédiction lancée avec succès !");
      setShowForm(false);
      setShowModel(true);
    } else {
      alert("Réponse inattendue du serveur.");
    }

  } catch (error) {
    console.error("Erreur réseau :", error);
    alert("Une erreur est survenue lors de la prédiction.");
  }

};




  return (
    <div className="mb-8">
      {/* BOUTON aligné à droite */}
      <div className="flex justify-end mr-[6%]">
        <button
          onClick={() => {
            setShowForm(!showForm);
            setShowModel(false);
          }}
          className="text-white font-bold py-3 px-6 rounded-lg transition duration-300 bg-[#FCB17A]"
        >
          Lancer une nouvelle prédiction
        </button>
      </div>

      {/* FORMULAIRE aligné à gauche */}
      <div className="flex flex-col items-start ml-[6%]">
        {showForm && (
          <div className="mt-4 w-full max-w-xl bg-white p-6 rounded-2xl shadow-lg border" style={{ borderColor: '#162556' }}>
            <h2 className="text-lg font-bold mb-4" style={{ color: '#162556' }}>Choisissez une méthode</h2>

            <div className="flex space-x-4 mb-6">

              {['SARIMA', 'SARIMAX', 'GRU'].map((method) => (

                <button
                  key={method}
                  onClick={() => setSelectedMethod(method)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    selectedMethod === method
                      ? 'bg-[#162556] text-white'
                      : 'bg-gray-200 text-gray-800 '
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>

            {selectedMethod && (
              <div className="space-y-4">

                {/* <p><strong >Prix :</strong> {methodInfo[selectedMethod].price}</p> */}
                  <input
                  type="hidden"
                  name="nom_methode"
                  value={methodInfo[selectedMethod].nom}
                  />

                <p><strong>Taille max du dataset :</strong> {methodInfo[selectedMethod].maxSize}</p>

                <div>
                  <label className="block mb-1 font-medium" style={{ color: '#162556' }}>Période de prédiction</label>
                  <input
                    type="text"
                    value={predictionPeriod}
                    onChange={(e) => setPredictionPeriod(e.target.value)}
                    placeholder="ex: 12 mois"
                    className="w-full p-2 border rounded-lg"
                  />
                </div>


                {/* <div>

                  <label className="block mb-1 font-medium" style={{ color: '#162556' }}>Format de données</label>
                  <select
                    value={fileFormat}
                    onChange={(e) => setFileFormat(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="">-- Choisir un format --</option>
                    {methodInfo[selectedMethod].formats.map((format) => (
                      <option key={format} value={format}>
                        {format}
                      </option>
                    ))}
                  </select>

                </div> */}

                {/* <div>

                  <label className="block mb-1 font-medium" style={{ color: '#162556' }}>Importer fichier (facultatif)</label>
                  <input  
                    type="file"
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="w-full p-2 border rounded-lg"
                  />

                </div> */}
                {/* {methodInfo[selectedMethod]?.nom === "SARIMAX" && (
  <div>
    <label className="block mb-1 font-medium" style={{ color: '#162556' }}>
      Importer fichier exogène
    </label>
    <input
      type="file"
      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      onChange={(e) => setExogFile(e.target.files[0])}
      className="w-full p-2 border rounded-lg"
    />
  </div>
)} */}



                <div className="flex justify-end space-x-4 mt-4">
                  <button
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleValidate}
                    className="px-4 py-2 rounded-lg bg-[#FCB17A] text-white"
                  >
                    Valider
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {showModel && (
          <div className="mt-6 w-full max-w-xl bg-indigo-50 p-6 rounded-xl shadow-md border border-indigo-300">
            <h3 className="text-xl font-bold text-indigo-800 mb-4">🧠 Résumé de votre prédiction</h3>
            <p><strong>Méthode :</strong> {selectedMethod}</p>
            <p><strong>Période :</strong> {predictionPeriod}</p>
            <p><strong>Format :</strong> {fileFormat}</p>
            {file && <p><strong>Fichier :</strong> {file.name}</p>}
            <p className="text-green-700 font-medium mt-2">✔ Prédiction prête à être lancée !</p>
          </div>
        )}
      </div>
    </div>
  );
};


export default NewPredictionButton;
