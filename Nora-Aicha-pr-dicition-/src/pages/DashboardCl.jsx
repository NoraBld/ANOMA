

import React from 'react';
import { ProSidebarProvider } from 'react-pro-sidebar';
import CustomSidebar from '../components/CustomSidebar';

import PredictionGraph from '../components/dashComponentCl/PredictionGraph';
// import VolumeServiceChart from '../components/dashComponent/VolumeServiceChart';
// import TableauJournee from '../components/dashComponent/tableaujournee';
import BottomStats from '../components/dashComponentCl/BottomStats';
import ConsumptionTable from '../components/dashComponentCl/ConsumptionTable';
import RealVsPredictedGraph from '../components/dashComponentCl/RealVsPredictedGraph';
// import RevenueChart from '../components/RevenueChart';

export default function DashboardCl() {

    const salesData = [
        { datetime: '2004-12-25 01:00:00', value: 16669.0 },
        { datetime: '2004-12-25 02:00:00', value: 16218.0 },
        { datetime: '2004-12-25 03:00:00', value: 16135.0 },
        { datetime: '2004-12-25 04:00:00', value: 16107.0 },
        { datetime: '2004-12-25 05:00:00', value: 16229.0 },
        { datetime: '2004-12-25 06:00:00', value: 16470.0 },
        { datetime: '2004-12-25 07:00:00', value: 16935.0 },
        { datetime: '2004-12-25 08:00:00', value: 17548.0 },
        { datetime: '2004-12-25 09:00:00', value: 17927.0 },
        { datetime: '2004-12-25 10:00:00', value: 17837.0 },
        { datetime: '2004-12-25 11:00:00', value: 17453.0 },
        { datetime: '2004-12-25 12:00:00', value: 16891.0 },
        { datetime: '2004-12-25 13:00:00', value: 15967.0 },
        { datetime: '2004-12-25 14:00:00', value: 15088.0 },
        { datetime: '2004-12-25 15:00:00', value: 14564.0 },
        { datetime: '2004-12-25 16:00:00', value: 14394.0 },
        { datetime: '2004-12-25 17:00:00', value: 14745.0 },
        { datetime: '2004-12-25 18:00:00', value: 15856.0 },
        { datetime: '2004-12-25 19:00:00', value: 16502.0 },
        { datetime: '2004-12-25 20:00:00', value: 16678.0 },
        { datetime: '2004-12-25 21:00:00', value: 16842.0 },
        { datetime: '2004-12-25 22:00:00', value: 16621.0 },
        { datetime: '2004-12-25 23:00:00', value: 16167.0 },
        { datetime: '2004-12-26 00:00:00', value: 15676.0 },
        { datetime: '2004-12-26 01:00:00', value: 15059.0 },
        { datetime: '2004-12-26 02:00:00', value: 14617.0 },
        { datetime: '2004-12-26 03:00:00', value: 14452.0 },
        { datetime: '2004-12-26 04:00:00', value: 14465.0 },
        { datetime: '2004-12-26 05:00:00', value: 14561.0 },
        { datetime: '2004-12-26 06:00:00', value: 14862.0 },
        { datetime: '2004-12-26 07:00:00', value: 15318.0 },
        { datetime: '2004-12-26 08:00:00', value: 15865.0 },
        { datetime: '2004-12-26 09:00:00', value: 16421.0 },
        { datetime: '2004-12-26 10:00:00', value: 16751.0 },
        { datetime: '2004-12-26 11:00:00', value: 16521.0 },
        { datetime: '2004-12-26 12:00:00', value: 16047.0 },
        { datetime: '2004-12-26 13:00:00', value: 15790.0 },
        { datetime: '2004-12-26 14:00:00', value: 15702.0 },
        { datetime: '2004-12-26 15:00:00', value: 15488.0 },
        { datetime: '2004-12-26 16:00:00', value: 15607.0 },
        { datetime: '2004-12-26 17:00:00', value: 16012.0 },
        { datetime: '2004-12-26 18:00:00', value: 17243.0 },
        { datetime: '2004-12-26 19:00:00', value: 17922.0 },
        { datetime: '2004-12-26 20:00:00', value: 18064.0 },
        { datetime: '2004-12-26 21:00:00', value: 18086.0 },
        { datetime: '2004-12-26 22:00:00', value: 17834.0 },
        { datetime: '2004-12-26 23:00:00', value: 17392.0 },
        { datetime: '2004-12-27 00:00:00', value: 16842.0 },
        { datetime: '2004-12-27 01:00:00', value: 16718.0 },
        { datetime: '2004-12-27 02:00:00', value: 16150.0 },
        { datetime: '2004-12-27 03:00:00', value: 16090.0 },
        { datetime: '2004-12-27 04:00:00', value: 16223.0 },
        { datetime: '2004-12-27 05:00:00', value: 16652.0 },
        { datetime: '2004-12-27 06:00:00', value: 17317.0 },
        { datetime: '2004-12-27 07:00:00', value: 18384.0 },
        { datetime: '2004-12-27 08:00:00', value: 19366.0 },
        { datetime: '2004-12-27 09:00:00', value: 19772.0 },
        { datetime: '2004-12-27 10:00:00', value: 19792.0 },
        { datetime: '2004-12-27 11:00:00', value: 19697.0 },
        { datetime: '2004-12-27 12:00:00', value: 19193.0 },
        { datetime: '2004-12-27 13:00:00', value: 18640.0 },
        { datetime: '2004-12-27 14:00:00', value: 18066.0 },
        { datetime: '2004-12-27 15:00:00', value: 17692.0 },
        { datetime: '2004-12-27 16:00:00', value: 17522.0 },
        { datetime: '2004-12-27 17:00:00', value: 17933.0 },
        { datetime: '2004-12-27 18:00:00', value: 19353.0 },
        { datetime: '2004-12-27 19:00:00', value: 20046.0 },
        { datetime: '2004-12-27 20:00:00', value: 20127.0 },
        { datetime: '2004-12-27 21:00:00', value: 20049.0 },
        { datetime: '2004-12-27 22:00:00', value: 19751.0 },
        { datetime: '2004-12-27 23:00:00', value: 19038.0 },
        { datetime: '2004-12-28 00:00:00', value: 18133.0 },
        { datetime: '2004-12-28 01:00:00', value: 17580.0 },
        { datetime: '2004-12-28 02:00:00', value: 17158.0 },
        { datetime: '2004-12-28 03:00:00', value: 17002.0 },
        { datetime: '2004-12-28 04:00:00', value: 16923.0 },
        { datetime: '2004-12-28 05:00:00', value: 17191.0 },
        { datetime: '2004-12-28 06:00:00', value: 17908.0 },
        { datetime: '2004-12-28 07:00:00', value: 18944.0 },
        { datetime: '2004-12-28 08:00:00', value: 19752.0 },
        { datetime: '2004-12-28 09:00:00', value: 19882.0 },
        { datetime: '2004-12-28 10:00:00', value: 19544.0 },
        { datetime: '2004-12-28 11:00:00', value: 19309.0 },
        { datetime: '2004-12-28 12:00:00', value: 18756.0 },
        { datetime: '2004-12-28 13:00:00', value: 18201.0 },
        { datetime: '2004-12-28 14:00:00', value: 17666.0 },
        { datetime: '2004-12-28 15:00:00', value: 17203.0 },
        { datetime: '2004-12-28 16:00:00', value: 16935.0 },
        { datetime: '2004-12-28 17:00:00', value: 17207.0 },
        { datetime: '2004-12-28 18:00:00', value: 18349.0 },
        { datetime: '2004-12-28 19:00:00', value: 18815.0 },
        { datetime: '2004-12-28 20:00:00', value: 18599.0 },
        { datetime: '2004-12-28 21:00:00', value: 18480.0 },
        { datetime: '2004-12-28 22:00:00', value: 18135.0 },
        { datetime: '2004-12-28 23:00:00', value: 17112.0 }
    ];



    return (
        <div className="flex h-screen bg-gray-100">
            <ProSidebarProvider>
                <CustomSidebar />
            </ProSidebarProvider>

            <div className="flex-1 p-8   overflow-auto bg-neutral-200">
        <div className="flex justify-between items-center  mb-6 rounded  p-3  bg-white shadow">
          <h5 className="text-lg font-bold text-gray-600 ">Dashboard</h5>
          <h5 className="text-lg font-bold text-gray-600 ">Nom de l'entreprise</h5>
        </div>
        <PredictionGraph data={salesData} />

        <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0">
  <div className="w-full lg:w-1/2 p-4 text-white">
    <BottomStats />
  </div>
  <div className="w-full lg:w-1/2 p-4 text-white">
    <ConsumptionTable />
  </div>
    
</div>

       <RealVsPredictedGraph/>
 
      </div>

            {/* <div className="flex-1 p-8 overflow-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1> */}

                {/* Cartes */}
                {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Cartesinfo title="Valeur minimale" value="1398 MW" change="+12% d'hier" />
          <Cartesinfo title="Valeur maximale" value="9800 MW" change="+8%  d'hier" />
          <Cartesinfo title="Moyenne" value="5599" change="+4%  d'hier" />
        </div> */}
                {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Cartesinfo
                        title="Valeur minimale"
                        value="1398 MW"
                        change="+12% d'hier"
                        backgroundColor="bg-fuchsia-100"
                    />
                    <Cartesinfo
                        title="Valeur maximale"
                        value="9800 MW"
                        change="+8% d'hier"
                        backgroundColor="bg-amber-50"
                    />
                    <Cartesinfo
                        title="Moyenne"
                        value="5599"
                        change="+4% d'hier"
                        backgroundColor="bg-emerald-50"
                    />
                </div> */}


                {/* Graphiques */}
                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <SalesChart data={salesData} />
                    <DailyTable data={salesData} />

                </div> */}
                {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[400px]">
                    <div className="md:col-span-2 h-full">
                        <SalesChart data={salesData} />
                    </div>
                    <div className="md:col-span-1 h-full overflow-y-auto">
                        <TableauJournee data={salesData} />
                    </div>
                </div>
                */}
                {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"> */}
                    {/* Premier conteneur - Graphique */}
                    {/* <div className="md:col-span-2 h-full bg-white p-4 rounded-2xl shadow-md"> */}
                        {/* <PredictionGraph data={salesData} />
                        <BottomStats/> */}
                    {/* </div> */}

                    {/* Deuxième conteneur - Tableau */}
                    {/* <div className="md:col-span-1 h-full flex flex-col bg-white p-4 rounded-2xl shadow-md">
                        <TableauJournee data={salesData} />
                    </div> */}
                {/* </div> */}


                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> */}
                    {/* <VolumeServiceChart data={salesData} /> */}
                    {/* <RevenueChart data={salesData} /> */}
                    {/* < TableauJournee data={salesData} /> */}

                {/* </div>
            </div> */}
        
        </div>
        
    );
}
