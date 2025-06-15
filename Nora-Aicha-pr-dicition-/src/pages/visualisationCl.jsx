import React from 'react';
import CustomSidebarCl from '../components/CustomSidebarCl';
import { ProSidebarProvider } from 'react-pro-sidebar';
import Graphe from '../components/visualisationComponent/graphe';
import BottomStats from '../components/visualisationComponent/BottomStats';
import ConsumptionTable from '../components/visualisationComponent/ConsumptionTable';
import ConsumptionBarChart from '../components/visualisationComponent/ConsumptionBarChart';

const VisualisationCl = () => {
  return (
    <ProSidebarProvider>
      <div className="flex bg-gray-100 min-h-screen">
        {/* Sidebar fixe */}
        <div className="w-[250px] h-screen fixed top-0 left-0 bg-white shadow-md">
          <CustomSidebarCl />
        </div>

        {/* Contenu principal */}
        <div className="flex-1 ml-[250px] p-6 overflow-auto">
          <Graphe />

          <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0 mt-6">
            <div className="w-full lg:w-1/2 p-4 text-white rounded-md">
              <BottomStats />
            </div>
            <div className="w-full lg:w-1/2 p-4 text-white rounded-md">
              <ConsumptionTable />
            </div>
          </div>

          {/* Histogramme en dessous */}
          <div className="mt-6">
            <ConsumptionBarChart />
          </div>
        </div>
      </div>
    </ProSidebarProvider>
  );
};

export default VisualisationCl;
