import React from "react";
import { Dialog } from "@headlessui/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const sampleData = [
  { heure: "00h", consommation: 10 },
  { heure: "01h", consommation: 12 },
  { heure: "02h", consommation: 8 },
  { heure: "03h", consommation: 14 },
  { heure: "04h", consommation: 11 },
  { heure: "05h", consommation: 7 },
  { heure: "06h", consommation: 13 },
  { heure: "07h", consommation: 15 },
  { heure: "08h", consommation: 18 },
  { heure: "09h", consommation: 16 },
  { heure: "10h", consommation: 14 },
];

const ConsumptionGraphModal = ({ isOpen, onClose, client }) => {
  if (!client) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center px-4">
        <Dialog.Panel className="bg-white p-6 rounded-xl shadow-lg max-w-xl w-full sm:max-w-lg md:max-w-xl">

          <Dialog.Title className="text-xl font-semibold mb-4">
            Consommations horaires - {client.prenom} {client.nom}
          </Dialog.Title>

          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <LineChart
                data={sampleData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="heure" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="consommation"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={onClose}

              className="px-4 py-2 bg-[#FCB17A] text-white rounded-xl hover:bg-[#e89a52] transition"

            >
              Fermer
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ConsumptionGraphModal;
