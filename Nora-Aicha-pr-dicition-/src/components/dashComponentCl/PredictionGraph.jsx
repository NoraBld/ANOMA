// // import React, { useEffect, useState } from 'react';
// // import { TrendingUp } from 'lucide-react';

// // import {
// //   LineChart,
// //   Line,
// //   XAxis,
// //   YAxis,
// //   Tooltip,
// //   ResponsiveContainer,

// //   CartesianGrid
// // } from 'recharts';
// // import GraphStats from './GraphStats';

// // const PredictionGraph = () => {
// //   const [data, setData] = useState([]);

// //   useEffect(() => {
// //     fetch('http://localhost:8000/consommation/mensuelle')
// //       .then((response) => {
// //         if (!response.ok) throw new Error('Erreur réseau');
// //         return response.json();
// //       })
// //       .then(setData)
// //       .catch((error) => {
// //         console.error('Erreur lors de la récupération des données :', error);
// //       });
// //   }, []);

// //   const valeurs = data.filter(d => d.valeur !== undefined).map(d => d.valeur);
// //   const total = valeurs.reduce((a, b) => a + b, 0);
// //   const max = Math.max(...valeurs);
// //   const min = Math.min(...valeurs);
// //   const moyenne = (total / valeurs.length).toFixed(2);

// //   const formatDate = (dateStr) => {
// //     if (!dateStr) return '';
// //     const [year, month] = dateStr.split("-");
// //     const moisNom = [
// //       "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
// //       "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
// //     ];
// //     return `${moisNom[parseInt(month, 10) - 1]} ${year}`;
// //   };

// //   return (
// //     <div className="bg-[#f3f4fa] text-white p-4 shadow-md w-full">
// //       <div className="flex flex-col lg:flex-row">

// //         <div className="flex-1">
// //           <ResponsiveContainer width="100%" height={250}>
// //             <LineChart data={data}>
// //               <CartesianGrid stroke="#878fad" />
// //               <XAxis dataKey="date" stroke="#424769" />
// //               <YAxis stroke="#424769" />


// //               <Tooltip
// //                 content={({ active, payload }) => {
// //                   if (active && payload && payload.length > 0) {
// //                     const point = payload[0].payload;
// //                     return (
// //                       <div className="bg-white text-[#2D3250] p-2 rounded shadow border border-gray-200 text-sm">
// //                         📅 <strong>Date :</strong> {formatDate(point.date)} <br />
// //                         ⚡ <strong>Consommation :</strong> {point.valeur} W
// //                       </div>
// //                     );
// //                   }
// //                   return null;
// //                 }}
// //               />

// //               <Line
// //                 type="monotone"
// //                 dataKey="valeur"
// //                 name="Consommation"
// //                 stroke="#424769"
// //                 strokeWidth={2}
// //                 dot={{ r: 5 }}
// //                 activeDot={{ r: 8 }}
// //               />
// //             </LineChart>
// //           </ResponsiveContainer>
// //         </div>


// //         <div className="mt-6 lg:mt-0 lg:ml-8 w-full lg:w-1/3">
// //           <GraphStats data={data} />
// //         </div>
// //       </div>


// //       <p className="text-sm text-black italic mt-4 ml-2 flex items-center gap-2">
// //         <TrendingUp size={16} className="text-[#FCB17A]" />
// //         Vous allez produire <strong>{total.toFixed(0)} W</strong> d’énergie.
// //       </p>

// //     </div>
// //   );
// // };

// // export default PredictionGraph;


// import React, { useEffect, useState } from 'react';
// import { TrendingUp } from 'lucide-react';

// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid
// } from 'recharts';

// import GraphStats from './GraphStats';

// const PredictionGraph = () => {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     Promise.all([
//       fetch('http://localhost:8000/consommation/mensuelle').then(res => res.json()),
//       fetch('http://localhost:8000/prediction/mensuelle').then(res => res.json())
//     ])
//       .then(([consommationData, predictionData]) => {
//         const merged = {};

//         consommationData.forEach(item => {
//           merged[item.date] = { date: item.date, consommation: item.valeur };
//         });

//         predictionData.forEach(item => {
//           if (!merged[item.date]) merged[item.date] = { date: item.date };
//           merged[item.date].prediction = item.valeur;
//         });

//         const finalData = Object.values(merged).sort(
//           (a, b) => new Date(a.date) - new Date(b.date)
//         );

//         setData(finalData);
//       })
//       .catch(error => {
//         console.error('Erreur lors de la récupération des données :', error);
//       });
//   }, []);

//   const valeursConsommation = data
//     .filter(d => d.consommation !== undefined)
//     .map(d => d.consommation);
//   const total = valeursConsommation.reduce((a, b) => a + b, 0);
//   const moyenne = (total / valeursConsommation.length).toFixed(2);

//   const formatDate = (dateStr) => {
//     if (!dateStr) return '';
//     const [year, month] = dateStr.split("-");
//     const moisNom = [
//       "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
//       "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
//     ];
//     return `${moisNom[parseInt(month, 10) - 1]} ${year}`;
//   };

//   return (
//     <div className="bg-[#f3f4fa] text-white p-4 shadow-md w-full">
//       <div className="flex flex-col lg:flex-row">
//         <div className="flex-1">
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={data}>
//               <CartesianGrid stroke="#878fad" />
//               <XAxis dataKey="date" stroke="#424769" />
//               <YAxis stroke="#424769" />

//               <Tooltip
//                 content={({ active, payload }) => {
//                   if (active && payload && payload.length > 0) {
//                     const point = payload[0].payload;
//                     return (
//                       <div className="bg-white text-[#2D3250] p-2 rounded shadow border border-gray-200 text-sm">
                       
                       
//                          <strong>Consommation :</strong> {point.consommation ?? 'N/A'} W
//                       </div>
//                     );
//                   }
//                   return null;
//                 }}
//               />

//               <Line
//                 type="monotone"
//                 dataKey="consommation"
//                 name="Consommation réelle"
//                 stroke="#424769"
//                 strokeWidth={2}
//                 dot={{ r: 4 }}
//                 activeDot={{ r: 6 }}
//               />

//               <Line
//                 type="monotone"
//                 dataKey="prediction"
//                 name="Prédiction"
//                 stroke="#FCB17A"
//                 strokeWidth={2}
//                 strokeDasharray="4 4"
//                 dot={{ r: 4 }}
//                 activeDot={{ r: 6 }}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         <div className="mt-6 lg:mt-0 lg:ml-8 w-full lg:w-1/3">
//           <GraphStats data={data} />
//         </div>
//       </div>

//       <p className="text-sm text-black italic mt-4 ml-2 flex items-center gap-2">
//         <TrendingUp size={16} className="text-[#FCB17A]" />
//         Vous allez produire <strong>{total.toFixed(0)} W</strong> d’énergie.
//       </p>
//     </div>
//   );
// };

// export default PredictionGraph;
import React, { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import GraphStats from './GraphStats';

const PredictionGraph = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:8000/consommation/mensuelle').then(res => res.json()),
      fetch('http://localhost:8000/prediction/mensuelle').then(res => res.json())
    ])
      .then(([consommationData, predictionData]) => {
        const merged = {};

        consommationData.forEach(item => {
          merged[item.date] = { date: item.date, consommation: item.valeur };
        });

        predictionData.forEach(item => {
          if (!merged[item.date]) merged[item.date] = { date: item.date };
          merged[item.date].prediction = item.valeur;
        });

        const finalData = Object.values(merged).sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );

        setData(finalData);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des données :', error);
      });
  }, []);

  const valeursConsommation = data
    .filter(d => d.consommation !== undefined)
    .map(d => d.consommation);
  const total = valeursConsommation.reduce((a, b) => a + b, 0);
  const moyenne = (total / valeursConsommation.length).toFixed(2);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split("-");
    const moisNom = [
      "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
      "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];
    return `${moisNom[parseInt(month, 10) - 1]} ${year}`;
  };

  return (
    <div className="bg-[#f3f4fa] text-white p-4 shadow-md w-full">
      <div className="flex flex-col lg:flex-row">
        <div className="flex-1">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid stroke="#878fad" />
              <XAxis dataKey="date" stroke="#424769" />
              <YAxis stroke="#424769" />

              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length > 0) {
                    const point = payload[0].payload;
                    const hasCons = point.consommation !== undefined;
                    const hasPred = point.prediction !== undefined;

                    return (
                      <div className="bg-white text-[#2D3250] p-2 rounded shadow border border-gray-200 text-sm">
                        <div><strong>Date :</strong> {formatDate(point.date)}</div>
                        {hasCons && !hasPred && (
                          <div><strong>Consommation :</strong> {point.consommation} W</div>
                        )}
                        {hasPred && !hasCons && (
                          <div><strong>Prédiction :</strong> {point.prediction} W</div>
                        )}
                        {hasCons && hasPred && (
                          <>
                            <div><strong>Consommation :</strong> {point.consommation} W</div>
                            <div><strong>Prédiction :</strong> {point.prediction} W</div>
                          </>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Line
                type="monotone"
                dataKey="consommation"
                name="Consommation réelle"
                stroke="#424769"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />

              <Line
                type="monotone"
                dataKey="prediction"
                name="Prédiction"
                stroke="#FCB17A"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 lg:mt-0 lg:ml-8 w-full lg:w-1/3">
          <GraphStats data={data} />
        </div>
      </div>

      <p className="text-sm text-black italic mt-4 ml-2 flex items-center gap-2">
        <TrendingUp size={16} className="text-[#FCB17A]" />
        Vous allez produire <strong>{total.toFixed(0)} W</strong> d’énergie.
      </p>
    </div>
  );
};

export default PredictionGraph;
