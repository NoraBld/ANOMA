
import React, { useState } from 'react';


import NewPredictionButton from '../components/predComponent/newPredictionButton';
import GrapheSection from '../components/predComponent/grapheSection';

import MethodSummary from '../components/predComponent/methodSummary';

import CustomSidebar from '../components/CustomSidebar';
import { ProSidebarProvider } from 'react-pro-sidebar';

const Prediction = () => {

  const [select, setSelect] = useState([]);
  // const [predictionData, setPredictionData] = useState(null);
  const [allPredictions, setAllPredictions] = useState([]);

  const [sommaire, setSommaires] = useState([]);





  return (
    <div className="flex h-screen">
       {/* <GraphProvider> */}
      {/* Sidebar fixe à gauche */}
        <ProSidebarProvider>
              <CustomSidebar />
            </ProSidebarProvider>

      {/* Contenu principal prend le reste */}
      <div className="flex-1 p-8   overflow-auto bg-neutral-200">
        {/* <div className="flex justify-between items-center mb-6 rounded  p-3  bg-white shadow">
          <h5 className="text-lg font-bold text-gray-600 ">Prediction</h5>
          <h5 className="text-lg font-bold text-gray-600 ">Nom de l'entreprise</h5>
        </div> */}

      

{/* <GrapheSection data={selectedData} />
 */}
{/* <GrapheSection predictionData={predictionData}  /> */}
<GrapheSection allPredictions={allPredictions} parametres={sommaire} select={select} />



    <MethodSummary sommaire={sommaire}/>
    {/* <NewPredictionButton setPredictionData={setPredictionData} setSommaire={setSommaire}/>   */}
    <NewPredictionButton 
    // setSommaire={setSommaire}

  onNewPrediction={(newPrediction, newSommaire, newmethode ) => {
    setAllPredictions(prev => [...prev, newPrediction]);
    setSommaires(prev => [...prev, newSommaire]);
    setSelect(prev => [...prev, newmethode]);
  }}
/>

 

  

      </div>
      {/* </GraphProvider> */}
    </div>
  );
};



export default Prediction;
