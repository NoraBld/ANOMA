import React, { useRef, useState } from 'react';
import { Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const GrapheSection = () => {
  const chartRef = useRef(); // Référence graphe ou tableau
  const [displayMode, setDisplayMode] = useState('graph'); // 'graph' ou 'table'
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [showPaymentForm, setShowPaymentForm] = useState(false);

  const data = [
    { Date: '11/11/2002', Valeur: 34 },
    { Date: '12/11/2002', Valeur: 9 },
    { Date: '13/11/2002', Valeur: 6 },
    { Date: '14/11/2002', Valeur: 50 },
    { Date: '15/11/2002', Valeur: 55 },
    { Date: '16/11/2002', Valeur: 53 },
    { Date: '17/11/2002', Valeur: 20 },
    { Date: '18/11/2002', Valeur: 28 },
  ];

  const downloadPDF = () => {
    const input = chartRef.current;
    if (!input) return;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      // Choisir le nom du fichier selon ce qui est affiché
      const filename = displayMode === 'graph' ? 'graphe-prediction.pdf' : 'tableau-prediction.pdf';
      pdf.save(filename);
    });
  };

  return (
    <div className="bg-[#FFFFFF] border-1 border-blue-900 p-6 rounded-2xl shadow-md w-full mb-8  mt-8 flex flex-col">

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full">
        <div>
          <h2 className="text-2xl font-bold mb-2 text-blue-950">Graphique de Prédiction SARIMA</h2>
          <p className="text-gray-500">Visualisez vos résultats ici.</p>
        </div>

        {/* Choix du format */}
        <select
          className="border border-blue-950 rounded-lg p-2 text-blue-950 m-0"
          value={displayMode}
          onChange={(e) => setDisplayMode(e.target.value)}
        >
          <option value="graph">Afficher : Graphique</option>
          <option value="table">Afficher : Tableau</option>
        </select>

        <button
          className="mt-4 md:mt-0 flex items-center gap-2 bg-[#162556] text-white font-semibold py-2 px-4 rounded transition duration-300"
          onClick={downloadPDF}
        >
          <Download size={20} />
          Télécharger
        </button>
      </div>

      {/* Partie affichage : Graphique ou Tableau */}
      <div ref={chartRef} className="mt-8 w-full min-h-72 bg-[#FFFFFF]  p-4 rounded-lg style={{ backgroundColor: 'white' }}  ">
        {displayMode === 'graph' ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid stroke="#878fad" />
              <XAxis dataKey="date" stroke="#424769" />
              <YAxis stroke="#424769" />
              <Tooltip />
              <Line type="monotone" dataKey="Valeur" stroke="#424769" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Date</th>
                  <th className="py-2 px-4 border-b">Valeur</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border-b">{row.Date}</td>
                    <td className="py-2 px-4 border-b">{row.Valeur}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-4 justify-end pt-5">
        {/* Bouton pour ouvrir le modal de confirmation */}
        <button 
          onClick={() => setIsConfirmModalOpen(true)}
          className="bg-[]  text-white py-2 px-4 rounded-lg"
        >
          Choisir ce modèle
        </button>

        {/* Bouton pour afficher le formulaire de paiement */}
        <button 
          // onClick={() => setShowPaymentForm(!showPaymentForm)}
          className="bg-[#FCB17A]  text-white py-2 px-4 rounded-lg"
        >
          Acheter ce modèle
        </button>
      </div>

      {/* Modal de confirmation */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm  bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-96 text-center">
            <h2 className="text-xl font-bold mb-4">Confirmation</h2>
            <p className="text-gray-600 mb-6">Voulez-vous vraiment choisir ce modèle comme votre nouveau modèle de prediction ?</p>

            <div className="flex justify-center gap-4">
              <button 
                onClick={() => setIsConfirmModalOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg"
              >
                Annuler
              </button>
              <button 
                onClick={() => {
                  setIsConfirmModalOpen(false);
                  console.log('Modèle choisi confirmé !');
                }}
                className="bg-amber-300 hover:bg-amber-200 text-black py-2 px-4 rounded-lg"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Formulaire de paiement (affiché sous les boutons) */}
      {/* {showPaymentForm && (
        
        
        <div 
        className="mt-6 p-6 border rounded-2xl shadow-inner  w-full max-w-md mx-auto bg-gray-50">
          <h2 className="text-xl font-bold mb-6 text-center">Paiement</h2>

          <form className="flex flex-col gap-4 ">
            <input
              type="text"
              placeholder="Nom complet"
              className="border border-gray-300 rounded-lg p-2"
            />
            <input
              type="text"
              placeholder="Numéro de carte"
              className="border border-gray-300 rounded-lg p-2"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="MM/AA"
                className="border border-gray-300 rounded-lg p-2 w-1/2"
              />
              <input
                type="text"
                placeholder="CVC"
                className="border border-gray-300 rounded-lg p-2 w-1/2"
              />
            </div>

            <div className="flex justify-center gap-4 mt-4">
              <button
                type="button"
                onClick={() => setShowPaymentForm(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg"
              >
                Annuler
              </button>
              <button
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  setShowPaymentForm(false);
                  console.log('Paiement effectué !');
                }}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
              >
                Payer
              </button>
            </div>
          </form>
        </div>
      )} */}

    </div>
  );
};

export default GrapheSection;



