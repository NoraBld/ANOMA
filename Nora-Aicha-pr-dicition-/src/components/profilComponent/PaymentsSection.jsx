
import React from 'react';

const PaymentsSection = ({ payments, totalPayments }) => (
  <div className="bg-transparent rounded-md">
    <h2 className="text-[#2D3250] text-lg font-semibold mb-4">📅 Liste des Prédictions</h2>

    <ul className="space-y-2">
      {payments.map((payment, index) => (
        <li
          key={index}
          className="flex justify-between items-center px-4 py-2 rounded-md bg-white/10 text-white hover:bg-white/20 transition duration-200"
        >
          <span>{payment.date}</span>
          <span className="text-[#FCB17A] font-medium">{payment.amount}</span>
        </li>
      ))}
    </ul>

    <div className="mt-4 pt-3 border-t border-white/20 flex justify-between text-white font-semibold">
      <span>Total :</span>
      <span className="text-[#FCB17A]">{totalPayments.toLocaleString()} DA</span>
    </div>
  </div>
);

export default PaymentsSection;