import React, { useState } from 'react';
import { Scale } from 'lucide-react';

export function SF({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: (string | { id: string; label: string })[];
  placeholder: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-bold text-[#b89070] uppercase tracking-wide">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-[#3d2a18] text-[#f5e6d3] text-sm rounded-xl px-4 py-3 outline-none border border-[#4a3520]"
      >
        <option value="">{placeholder}</option>
        {options.map(o => {
          const val = typeof o === 'object' ? o.id : o;
          const lbl = typeof o === 'object' ? o.label : o;
          return <option key={val} value={val}>{lbl}</option>;
        })}
      </select>
    </div>
  );
}

export function IF({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-bold text-[#b89070] uppercase tracking-wide">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#3d2a18] text-[#f5e6d3] text-sm rounded-xl px-4 py-3 outline-none border border-[#4a3520] focus:border-emerald-500 transition-colors placeholder:text-[#6b5040]"
      />
    </div>
  );
}

export function GBtn({
  onClick,
  children,
  disabled,
  type = 'button',
}: {
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit';
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-xl text-[#1a0f07] font-black text-[11px] uppercase tracking-widest"
    >
      {children}
    </button>
  );
}

export function Card({
  icon: Icon,
  title,
  price,
  description,
  children,
}: {
  icon: React.ElementType;
  title: string;
  price: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#2c1c0e] rounded-2xl p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1a0f07] flex items-center justify-center shrink-0 mt-0.5">
            <Icon className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-[#f5e6d3] font-bold text-[15px] leading-tight">{title}</p>
            <p className="text-[#b89070] text-[11px] mt-1 leading-snug">{description}</p>
          </div>
        </div>
        <span className="shrink-0 text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full whitespace-nowrap">
          {price}
        </span>
      </div>
      {children}
    </div>
  );
}

export function LegalFooter() {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-2 pt-2 pb-4 text-center">
      <button
        onClick={() => setShow(s => !s)}
        className="text-[9px] font-bold text-[#6b5040] hover:text-[#b89070] uppercase tracking-widest mx-auto px-3 py-1.5 rounded-lg border border-[#2c1c0e] bg-[#1a0f07]"
      >
        <Scale className="w-3 h-3 inline mr-1" /> Protection des droits &amp; Confidentialité
      </button>
      {show && (
        <div className="bg-[#2c1c0e] border border-[#4a3520] p-4 rounded-xl text-[10px] text-[#b89070] text-left space-y-2">
          <p><strong>Tatouage Numérique :</strong> Chaque document acheté est marqué avec le numéro de téléphone.</p>
        </div>
      )}
    </div>
  );
}
