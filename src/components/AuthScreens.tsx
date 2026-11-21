import { useState } from 'react';
import type { UserType } from '../types/sira';
import { ADMIN_PASSWORD } from '../data/pricing';
import MainApp from './MainApp';

export function PhoneScreen({ onSubmit }: { onSubmit: (p: string) => void }) {
  const [phone, setPhone] = useState('');
  return (
    <div className="fixed inset-0 bg-[#1a0f07] flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-sm bg-[#2c1c0e] border border-[#4a3520] rounded-3xl p-6 space-y-6 text-center">
        <h2 className="text-xl font-black text-[#f5e6d3]">Sira Éducation</h2>
        <form onSubmit={e => { e.preventDefault(); const c = phone.trim().replace(/\s+/g, ''); if (c.length >= 8) onSubmit(c); }} className="space-y-4">
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="0798123456"
            className="w-full bg-[#1a0f07] border border-[#4a3520] rounded-2xl py-4 px-4 text-sm text-center font-bold text-[#f5e6d3]"
            required
          />
          <button type="submit" className="w-full py-4 bg-emerald-500 text-[#1a0f07] font-black text-xs uppercase tracking-widest rounded-2xl">
            Continuer
          </button>
        </form>
      </div>
    </div>
  );
}

export function OtpScreen({ otp, onVerify }: { otp: string; onVerify: (c: string) => void }) {
  const [code, setCode] = useState('');
  return (
    <div className="fixed inset-0 bg-[#1a0f07] flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-sm bg-[#2c1c0e] border border-[#4a3520] rounded-3xl p-6 space-y-5 text-center">
        <p className="text-xs text-[#b89070]">OTP : {otp}</p>
        <form onSubmit={e => { e.preventDefault(); onVerify(code); }} className="space-y-4">
          <input
            type="text"
            maxLength={4}
            value={code}
            onChange={e => setCode(e.target.value)}
            className="w-full bg-[#1a0f07] border border-[#4a3520] rounded-2xl py-3.5 text-center text-2xl font-black text-emerald-400"
          />
          <button type="submit" className="w-full py-3 bg-emerald-500 text-[#1a0f07] font-black rounded-xl">
            Confirmer
          </button>
        </form>
      </div>
    </div>
  );
}

export function PasswordScreen({ onVerify }: { onVerify: () => void }) {
  const [pwd, setPwd] = useState('');
  return (
    <div className="fixed inset-0 bg-[#1a0f07] flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-sm bg-[#2c1c0e] border border-[#4a3520] rounded-3xl p-6 space-y-5 text-center">
        <form onSubmit={e => { e.preventDefault(); if (pwd === ADMIN_PASSWORD) onVerify(); }} className="space-y-4">
          <input
            type="password"
            value={pwd}
            onChange={e => setPwd(e.target.value)}
            placeholder="• • • •"
            className="w-full bg-[#1a0f07] border border-[#4a3520] rounded-2xl py-3.5 text-center text-xl font-black text-emerald-400"
          />
          <button type="submit" className="w-full py-3 bg-emerald-500 text-[#1a0f07] font-black rounded-xl">
            Confirmer
          </button>
        </form>
      </div>
    </div>
  );
}

export function UserTypeScreen({ onChoose }: { onChoose: (t: UserType) => void }) {
  return (
    <div className="fixed inset-0 bg-[#1a0f07] flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-sm bg-[#2c1c0e] border border-[#4a3520] rounded-3xl p-6 space-y-4 text-center">
        <button onClick={() => onChoose('eleve')} className="w-full p-4 bg-[#1a0f07] rounded-2xl text-[#f5e6d3] font-bold">
          Je suis Élève
        </button>
        <button onClick={() => onChoose('parent')} className="w-full p-4 bg-[#1a0f07] rounded-2xl text-[#f5e6d3] font-bold">
          Je suis Parent
        </button>
      </div>
    </div>
  );
}

export function AuthView(props: any) {
  return (
    <div className="min-h-screen bg-[#120a05] flex items-center justify-center p-0 sm:py-6">
      <div className="w-full max-w-md min-h-screen sm:h-[85vh] bg-[#1a0f07] text-white">
        {props.step === 'phone' && <PhoneScreen onSubmit={props.handlePhone} />}
        {props.step === 'otp' && <OtpScreen otp={props.otp} onVerify={props.handleOtp} />}
        {props.step === 'password' && <PasswordScreen onVerify={props.handlePasswordVerify} />}
        {props.step === 'usertype' && <UserTypeScreen onChoose={props.handleUserType} />}
        {props.step === 'app' && (
          <MainApp
            phone={props.phone}
            role={props.role}
            userType={props.userType}
            profile={props.profile}
            onSave={props.handleSaveProfile}
            onLogout={props.handleLogout}
          />
        )}
      </div>
    </div>
  );
}
