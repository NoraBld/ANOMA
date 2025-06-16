// import React from 'react';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
// } from 'recharts';

// const data = [
//   { date: '2024-01', valeur: 120 },
//   { date: '2024-02', valeur: 130 },
//   { date: '2024-03', valeur: 125 },
//   { date: '2024-04', valeur: 135 },
//   { date: '2024-05', valeur: 140 },
//   { date: '2024-06', valeur: 138 },
//   { date: '2024-07', valeur: 142 },
//   { date: '2024-08', valeur: 145 },
//   { date: '2024-09', prediction: 148 },
//   { date: '2024-10', prediction: 152 },
//   { date: '2024-11', prediction: 158 },
//   { date: '2024-12', prediction: 161 },
// ];

// // Fonction pour afficher les mois courts (Jan, Feb, etc.) sur l'axe X
// const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
// const formatXAxis = (tickItem) => {
//   // tickItem = "2024-01" par ex.
//   const parts = tickItem.split('-');
//   if (parts.length === 2) {
//     const monthIndex = parseInt(parts[1], 10) - 1;
//     return monthNames[monthIndex] || tickItem;
//   }
//   return tickItem;
// };

// const Graphe = () => {
//   const valeurs = data.filter(d => d.valeur !== undefined).map(d => d.valeur);
//   const max = Math.max(...valeurs);
//   const min = Math.min(...valeurs);
//   const moyenne = (valeurs.reduce((a, b) => a + b, 0) / valeurs.length).toFixed(2);

//   return (
//     <div className="bg-[#f3f4fa] text-black p-4 shadow-md w-full rounded-md">
//       <div className="flex flex-col lg:flex-row">
//         {/* Graphique */}
//         <div className="flex-1">
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={data} margin={{ top: 20, right: 40, left: 0, bottom: 20 }}>
//               <CartesianGrid stroke="#878fad" />
//               <XAxis dataKey="date" stroke="#424769" tickFormatter={formatXAxis} />
//               <YAxis stroke="#424769" />
//               <Tooltip />
              
//               {/* Ligne des valeurs réelles en bleu */}
//               <Line
//                 type="monotone"
//                 dataKey="valeur"
//                 name="Valeur réelle"
//                 stroke="#424769"
//                 strokeWidth={2}
//                 dot={({ payload, cx, cy }) =>
//                   payload.valeur !== undefined ? <circle cx={cx} cy={cy} r={4} fill="#424769" /> : null
//                 }
//               />
              
//               {/* Ligne des prédictions en orange */}
//               <Line
//                 type="monotone"
//                 dataKey="prediction"
//                 name="Prédiction"
//                 stroke="#f9b17a"
//                 strokeWidth={2}
//                 dot={({ payload, cx, cy }) =>
//                   payload.prediction !== undefined ? <circle cx={cx} cy={cy} r={4} fill="#f9b17a" /> : null
//                 }
//               />
//             </LineChart>
//           </ResponsiveContainer>

//           <p className="text-sm italic mt-4 ml-2">
//             🔶 La ligne orange représente les valeurs prédites pour les prochaines périodes.
//           </p>

//           <p className="text-sm italic mt-2 ml-2">
//             💰 Vous allez payer <span className="text-[#f9b17a] font-bold">1 379 943 DA</span> pour le trimestre en cours.
//           </p>
//         </div>

//         {/* Ici tu peux mettre d’autres statistiques si besoin */}
//       </div>
//     </div>
//   );
// };

// export default Graphe;



import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

// Tableau des noms de mois pour l'affichage
const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

// Fonction de format pour l'axe X
const formatXAxis = (tickItem) => {
  const parts = tickItem.split('-');
  if (parts.length === 2) {
    const monthIndex = parseInt(parts[1], 10) - 1;
    return monthNames[monthIndex] || tickItem;
  }
  return tickItem;
};

const Graphe = () => {
  const [data, setData] = useState([]);
  const [moyenne, setMoyenne] = useState(0);
  const [max, setMax] = useState(0);
  const [min, setMin] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8000/client/mes-consommations", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(res => {
        const transformed = res.map(item => ({
          date: `${item.annee}-${String(item.mois).padStart(2, '0')}`,
          valeur: item.valeur,
        })).sort((a, b) => a.date.localeCompare(b.date));

        setData(transformed);

        const valeurs = transformed.map(d => d.valeur);
        if (valeurs.length > 0) {
          setMax(Math.max(...valeurs));
          setMin(Math.min(...valeurs));
          setMoyenne((valeurs.reduce((a, b) => a + b, 0) / valeurs.length).toFixed(2));
        }
      })
      .catch(err => {
        console.error("Erreur lors de la récupération des consommations :", err);
      });
  }, []);

  return (
    <div className="bg-[#f3f4fa] text-black p-4 shadow-md w-full rounded-md">
      <div className="flex flex-col lg:flex-row">
        {/* Graphique */}
        <div className="flex-1">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 20, right: 40, left: 0, bottom: 20 }}>
              <CartesianGrid stroke="#878fad" />
              <XAxis dataKey="date" stroke="#424769" tickFormatter={formatXAxis} />
              <YAxis stroke="#424769" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="valeur"
                name="Consommation"
                stroke="#424769"
                strokeWidth={2}
                dot={({ payload, cx, cy }) =>
                  payload.valeur !== undefined ? <circle cx={cx} cy={cy} r={4} fill="#424769" /> : null
                }
              />
            </LineChart>
          </ResponsiveContainer>

          <p className="text-sm italic mt-4 ml-2">
            📊 Moyenne : <span className="font-bold">{moyenne}</span> | Min : <span className="font-bold">{min}</span> | Max : <span className="font-bold">{max}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Graphe;
