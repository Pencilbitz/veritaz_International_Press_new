import React from "react";

export default function StateFilterBar({ states, value, onChange }) {
  if (!states || states.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
      <span className="text-sm font-semibold text-gray-500 mr-1">STATE:</span>
      <button
        type="button"
        onClick={() => onChange("")}
        className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
          value === ""
            ? "bg-emerald-50 border-emerald-400 text-emerald-700"
            : "bg-white border-gray-300 text-gray-700 hover:border-gray-400"
        }`}
      >
        All States
      </button>
      {states.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
            value === s
              ? "bg-emerald-50 border-emerald-400 text-emerald-700"
              : "bg-white border-gray-300 text-gray-700 hover:border-gray-400"
          }`}
        >
          {s}
        </button>
      ))}
    </div>
  );
}
