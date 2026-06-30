"use client";

import { useState } from "react";
import BankSelector from "./components/BankSelector";
import HSBCForm from "./banks/hsbc/HSBCForm";
import BNIForm from "./banks/bni/BNIForm";
import DeutscheForm from "./banks/deutsche/DeutscheForm";
import MandiriForm from "./banks/mandiri/MandiriForm";
import BCAForm from "./banks/bca/BCAForm";
import CitiForm from "./banks/citi/CitiForm";
import TransactionResult from "./components/TransactionResult";

export default function Home() {
  const [selectedBank, setSelectedBank] = useState("hsbc");
  const [transactionData, setTransactionData] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = (data) => {
    setTransactionData(data);
    setShowResult(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setShowResult(false);
  };

  const renderForm = () => {
    switch (selectedBank) {
      case "hsbc":
        return <HSBCForm onSubmit={handleSubmit} />;
      case "bni":
        return <BNIForm onSubmit={handleSubmit} />;
      case "deutsche":
        return <DeutscheForm onSubmit={handleSubmit} />;
      case "mandiri":
        return <MandiriForm onSubmit={handleSubmit} />;
      case "bca":
        return <BCAForm onSubmit={handleSubmit} />;
      case "citi":
        return <CitiForm onSubmit={handleSubmit} />;
      default:
        return <HSBCForm onSubmit={handleSubmit} />;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-t-2xl px-6 py-5 flex flex-col sm:flex-row justify-between items-center shadow-lg no-print">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">SQR400 - v5.8</h1>
          <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-4 py-1.5 rounded-full text-sm font-bold shadow-md mt-2 sm:mt-0">⭐ Premium Plan Active</span>
        </div>

        {/* Navigation */}
        <div className="bg-gray-800 px-6 py-3 rounded-b-2xl flex flex-wrap gap-4 text-gray-300 text-sm font-medium shadow-lg no-print">
          <span className="hover:text-white cursor-pointer transition">Home</span>
          <span className="hover:text-white cursor-pointer transition">Switch Mode</span>
          <span className="hover:text-white cursor-pointer transition">Pricing</span>
          <span className="hover:text-white cursor-pointer transition">Settings</span>
          <span className="hover:text-white cursor-pointer transition">History</span>
          <span className="hover:text-white cursor-pointer transition">Help</span>
        </div>

        {/* Bank Selector */}
        <div className="mt-6 no-print">
          <BankSelector selectedBank={selectedBank} onSelectBank={setSelectedBank} />
        </div>

        {/* Form or Result */}
        <div className="mt-4">{!showResult ? renderForm() : <TransactionResult data={transactionData} onBack={handleBack} />}</div>
      </div>
    </main>
  );
}
