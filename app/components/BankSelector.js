"use client";

import { bankConfigs } from "../utils/bankConfig";

const BankSelector = ({ selectedBank, onSelectBank }) => {
  const banks = Object.values(bankConfigs);

  // Helper for bank badge colors - adjusted for sleek web3 theme
  const getBadgeStyle = (id) => {
    switch (id) {
      case "hsbc":
        return "bg-red-500/10 text-red-400 border border-red-550/30";
      case "bni":
        return "bg-teal-500/10 text-teal-400 border border-teal-550/30";
      case "deutsche":
        return "bg-blue-500/10 text-blue-400 border border-blue-550/30";
      case "mandiri":
        return "bg-amber-500/10 text-amber-400 border border-amber-550/30";
      case "bca":
        return "bg-indigo-500/10 text-indigo-400 border border-indigo-550/30";
      case "citi":
        return "bg-cyan-500/10 text-cyan-400 border border-cyan-550/30";
      default:
        return "bg-slate-500/10 text-slate-400 border border-slate-550/30";
    }
  };

  return (
    <div className="bg-slate-900/30 border border-slate-850 rounded-3xl p-6 shadow-2xl mb-8 backdrop-blur-md relative overflow-hidden">
      {/* Background neon visual line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
      
      <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-5 flex items-center gap-2 font-mono">
        <span>⛓️</span> [ ACTIVE SWIFT GATEWAY NODES ]
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {banks.map((bank) => {
          const isSelected = selectedBank === bank.id;
          return (
            <button
              key={bank.id}
              type="button"
              onClick={() => onSelectBank(bank.id)}
              className={`flex flex-col items-center justify-between p-5 rounded-2xl border text-center transition-all duration-300 relative overflow-hidden group font-mono ${
                isSelected
                  ? "bg-slate-950/80 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.15)] -translate-y-1"
                  : "bg-slate-950/30 border-slate-900 hover:border-slate-800 hover:bg-slate-900/40 hover:-translate-y-0.5"
              }`}
            >
              {/* Top Accent Dot */}
              <div
                className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  isSelected ? "bg-cyan-400 animate-pulse" : "bg-slate-800"
                }`}
              />

              {/* Bank Initials Node Avatar */}
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm tracking-wider mb-4 shadow-md uppercase transition-all duration-300 group-hover:scale-105 ${getBadgeStyle(
                  bank.id
                )} ${isSelected ? "ring-1 ring-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.05)]" : ""}`}
              >
                {bank.id.substring(0, 3)}
              </div>

              {/* Bank Name */}
              <span className="text-xs font-bold text-slate-200 block truncate w-full tracking-wide">
                {bank.name.toUpperCase()}
              </span>

              {/* Swift Code */}
              <span className="text-[9px] font-mono text-slate-500 block mt-1.5 tracking-wider bg-slate-950/60 px-2 py-0.5 rounded-md border border-slate-900/60">
                {bank.code}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BankSelector;
