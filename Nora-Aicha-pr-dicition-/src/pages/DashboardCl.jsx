import React from 'react';
import { ProSidebarProvider } from 'react-pro-sidebar';
import CustomSidebar from '../components/CustomSidebar';

import PredictionGraph from '../components/dashComponentCl/PredictionGraph';
import BottomStats from '../components/dashComponentCl/BottomStats';
import ConsumptionTable from '../components/dashComponentCl/ConsumptionTable';
import RealVsPredictedGraph from '../components/dashComponentCl/RealVsPredictedGraph';

export default function DashboardCl() {
  return (
    <div className="flex h-screen bg-gray-100">
      <ProSidebarProvider>
        <CustomSidebar />
      </ProSidebarProvider>

      <div className="flex-1 p-8 overflow-auto bg-neutral-200">
        {/* Graphique de prédiction (données récupérées via l'API dans le composant) */}
        <PredictionGraph />

        <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0">
          <div className="w-full lg:w-1/2 p-4 text-white">
            <BottomStats />
          </div>
          <div className="w-full lg:w-1/2 p-4 text-white">
            <ConsumptionTable />
          </div>
        </div>

        <RealVsPredictedGraph />
      </div>
    </div>
  );
}
