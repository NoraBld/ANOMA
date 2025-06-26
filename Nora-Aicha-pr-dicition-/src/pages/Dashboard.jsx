

import React from 'react';
import { ProSidebarProvider } from 'react-pro-sidebar';
import CustomSidebar from '../components/CustomSidebar';
import PredictionGraph from '../components/dashComponent/PredictionGraph';
import ConsumptionTable from '../components/dashComponent/ConsumptionTable';
import ConsumptionBarChart from '../components/dashComponent/ConsumptionBarChart';
import GraphStats from '../components/dashComponent/GraphStats';

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-100">
      <ProSidebarProvider>
        <CustomSidebar />
      </ProSidebarProvider>

      <div className="flex-1 p-8 overflow-auto bg-neutral-200">
        <PredictionGraph />

       <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0 items-stretch min-h-[400px]">
  <div className="w-full lg:w-1/2 p-4 text-white flex-1">
    <GraphStats />
  </div>
  <div className="w-full lg:w-1/2 p-4 text-white flex-1">
    <ConsumptionTable />
  </div>
</div>


        <ConsumptionBarChart />
      </div>
    </div>
  );
}
