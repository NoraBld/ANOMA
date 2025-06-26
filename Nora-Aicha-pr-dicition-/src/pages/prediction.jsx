
import React, { useState } from 'react';


import NewPredictionButton from '../components/predComponent/newPredictionButton';
import GrapheSection from '../components/predComponent/grapheSection';

import MethodSummary from '../components/predComponent/methodSummary';

import CustomSidebar from '../components/CustomSidebar';
import { ProSidebarProvider } from 'react-pro-sidebar';

const Prediction = () => {

  const [select, setSelect] = useState([]);
 
  const [allPredictions, setAllPredictions] = useState([]);

  const [sommaire, setSommaires] = useState([]);





  return (
    <div className="flex h-screen">
       
        <ProSidebarProvider>
              <CustomSidebar />
            </ProSidebarProvider>

     
      <div className="flex-1 p-8   overflow-auto bg-neutral-200">
       

      
<GrapheSection allPredictions={allPredictions} parametres={sommaire} select={select} />



    <MethodSummary sommaire={sommaire}/>
    <NewPredictionButton 


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
