
import React, { useEffect, useRef, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Download } from "lucide-react";

export default function GrapheSection({ allPredictions = [],parametres, select = [] }) {
  const chartRef = useRef();
  const [displayMode, setDisplayMode] = useState("graph");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [confirmedMethod, setConfirmedMethod] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8000/affichage");
        if (!res.ok) throw new Error("Erreur récupération consommation");
        const backendData = await res.json();
        setData({
          Date: backendData.dates,
          Valeurs: backendData.valeurs,
          methode: backendData.nom_de_la_methode || "Dérnière prédiction",
        });
      } catch (error) {
        console.error("Erreur API:", error);
      }
    };
    fetchData();
  }, []);


  const downloadPDF = () => {
    const input = chartRef.current;
    if (!input) return;
    html2canvas(input, { scale: 2 }).then((canvas) => {

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height],
      });
      const filename =
        displayMode === "graph" ? "graphe-prediction.pdf" : "tableau-prediction.pdf";
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);

      pdf.save(filename);
    });
  };


  // --- Fusion des données à afficher ---
  let mergedData = [];
  let courbesAAfficher = [];
  let methodesDansTableau = [];

  if (Array.isArray(allPredictions) && allPredictions.length > 0) {
    const allDates = Array.from(
      new Set(allPredictions.flatMap((pred) => pred.Date))
    ).sort();

    mergedData = allDates.map((date) => {
      const point = { date };
      allPredictions.forEach((pred, idx) => {
        const key = pred.methode || `Méthode ${idx + 1}`;
        const index = pred.Date.indexOf(date);
        if (index !== -1) point[key] = pred.Valeurs[index];
      });
      return point;
    });

    courbesAAfficher = confirmedMethod
      ? allPredictions.filter((pred) => pred.methode === confirmedMethod)
      : allPredictions;

    methodesDansTableau = courbesAAfficher;
  } else if (data && Array.isArray(data.Date) && Array.isArray(data.Valeurs)) {
    mergedData = data.Date.map((date, i) => ({
      date,
      [data.methode]: data.Valeurs[i],
    }));

    courbesAAfficher = [{ methode: data.methode }];
    methodesDansTableau = [{ methode: data.methode }];
  } else {
    return (
      <div className="text-center text-gray-500 mt-8">
        Chargement des données ou aucune donnée disponible...
      </div>
    );
  }

  return (
    <div className="bg-white border p-6 rounded-2xl shadow-md w-full mb-8 mt-8 flex flex-col">
      {/* Titre et actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full">
        <div>
          <h2 className="text-2xl font-bold mb-2 text-blue-950">
            Graphique de Prédiction
          </h2>
          <p className="text-gray-500">Affichage des données depuis le backend</p>
        </div>


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

          <Download size={20} /> Télécharger
        </button>
      </div>

      {/* Zone graphique/tableau */}
      <div ref={chartRef} className="mt-8 w-full min-h-72 bg-white p-4 rounded-lg">
        {displayMode === "graph" ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={mergedData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="#424769" />
              <YAxis stroke="#424769" />
              <Tooltip />
              <Legend />
              {courbesAAfficher.map((pred, index) => (
                <Line
                  key={index}
                  type="monotone"
                  dataKey={pred.methode || `Méthode ${index + 1}`}
                  stroke={["#424769", "#FCB17A", "#8A2BE2", "#2ECC71"][index % 4]}
                  strokeWidth={3}
                  dot={false}
                />
              ))}

            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Date</th>

                  {methodesDansTableau.map((pred, index) => (
                    <th key={index} className="py-2 px-4 border-b">
                      {pred.methode || `Méthode ${index + 1}`}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mergedData.map((row, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border-b">{row.date}</td>
                    {methodesDansTableau.map((pred, i) => (
                      <td key={i} className="py-2 px-4 border-b">
                        {row[pred.methode || `Méthode ${i + 1}`] ?? "-"}
                      </td>
                    ))}

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>


     {/* Sélection modèle + bouton de confirmation uniquement si une nouvelle prédiction est présente */}
      {allPredictions && allPredictions.length > 0 && (
        <div className="flex flex-wrap gap-4 justify-between items-center pt-6">
          <div className="flex items-center gap-4">
            <select
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="bg-blue-950 text-white py-2 px-4 rounded-lg"
              value={selectedMethod}
            >
              <option value="">Choisir un modèle</option>
              {select.map((item, index) => (
                <option key={index} value={item.methode}>
                  {item.methode}
                </option>
              ))}
            </select>
          </div>

          {selectedMethod && (
            <button
              onClick={() => setIsConfirmModalOpen(true)}
              className="bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded-lg"
            >
              Choisir ce modèle
            </button>
          )}
        </div>
      )}

      {confirmedMethod && (
        <p className="text-blue-900 font-medium mt-4">
          ✅ Méthode sélectionnée : <strong>{confirmedMethod}</strong>
        </p>
      )}

      {/* Modal confirmation */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-96 text-center">
            <h2 className="text-xl font-bold mb-4">Confirmation</h2>
            <p className="text-gray-600 mb-6">
              Voulez-vous vraiment choisir ce modèle comme votre nouveau modèle
              de prédiction ?
            </p>
            <div className="flex justify-center gap-4">
              <button

                onClick={() => setIsConfirmModalOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg"
              >
                Annuler
              </button>

              <button
                onClick={async () => {
                  setConfirmedMethod(selectedMethod);
                  setIsConfirmModalOpen(false);

                  const parametreAenregistrer = selectedMethod
                    ? parametres.filter((pred) => pred.nommethode === selectedMethod)
                    : parametres;
                  const valeur = selectedMethod
                    ? allPredictions.filter((pred) => pred.methode === selectedMethod)
                    : allPredictions;

                  try {
                    const response = await fetch("http://localhost:8000/enregistrerModel", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        parametres: parametreAenregistrer,
                        valeurs: valeur,
                      }),
                    });

                    const res = await response.json();
                    console.log("Réponse du backend:", res);
                  } catch (error) {
                    console.error("Erreur lors de l'envoi:", error);
                  }

                }}
                className="bg-amber-300 hover:bg-amber-200 text-black py-2 px-4 rounded-lg"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

