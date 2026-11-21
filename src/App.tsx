import { useState } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Courses from './pages/courses';
import type { AuthStep, UserProfile, UserType } from './types/sira';
import { ADMIN_PHONE } from './data/pricing';
import { getBanStatus } from './utils/storage';
import { AuthView } from './components/AuthScreens';

export default function App() {
  const [step, setStep] = useState<AuthStep>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [role, setRole] = useState<'client' | 'admin'>('client');
  const [userType, setUserType] = useState<UserType>('eleve');
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const handlePhone = (p: string) => {
    const banInfo = getBanStatus(p);
    if (banInfo.isBanned) {
      alert(`Accès refusé : ${banInfo.reason || 'Ce compte est banni.'}`);
      return;
    }
    setPhone(p);
    if (p === ADMIN_PHONE) {
      setRole('admin');
      setStep('password');
    } else {
      setRole('client');
      const code = String(Math.floor(1000 + Math.random() * 9000));
      setOtp(code);
      setStep('otp');
    }
  };

  const handleOtp = (code: string) => {
    if (code === otp) {
      const savedProfile = localStorage.getItem(`sira_profile_${phone}`);
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        setProfile(parsed);
        setUserType(parsed.userType || 'eleve');
        setStep('app');
      } else {
        setStep('usertype');
      }
    } else {
      alert('Code OTP incorrect.');
    }
  };

  const handlePasswordVerify = () => {
    setProfile({
      phone: ADMIN_PHONE,
      fullName: 'Administrateur Sira',
      email: 'admin@sira.edu',
      city: 'Abidjan',
      school: 'Direction Sira',
      createdAt: new Date().toISOString(),
      userType: 'eleve',
    });
    setStep('app');
  };

  const handleUserType = (t: UserType) => {
    setUserType(t);
    const newProf: UserProfile = {
      phone,
      fullName: '',
      email: '',
      city: '',
      school: '',
      createdAt: new Date().toISOString(),
      userType: t,
    };
    setProfile(newProf);
    localStorage.setItem(`sira_profile_${phone}`, JSON.stringify(newProf));
    setStep('app');
  };

  const handleSaveProfile = (updated: Partial<UserProfile>) => {
    if (!profile) return;
    const newProf = { ...profile, ...updated };
    setProfile(newProf);
    localStorage.setItem(`sira_profile_${phone}`, JSON.stringify(newProf));
  };

  const handleLogout = () => {
    setStep('phone');
    setPhone('');
    setProfile(null);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#1a0f07] text-[#f5e6d3] flex flex-col">
        <nav className="bg-[#2c1c0e] border-b border-[#4a3520] px-6 py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <span className="font-black text-emerald-400 text-lg tracking-wider">Sira Éducation</span>
          </div>
          <div className="flex gap-6 text-sm font-bold">
            <Link to="/" className="text-[#b89070] hover:text-emerald-400 transition-colors">Accueil</Link>
            <Link to="/cours" className="text-[#b89070] hover:text-emerald-400 transition-colors">Cours</Link>
            <Link to="/app" className="text-emerald-400 hover:underline">Mon Compte</Link>
          </div>
        </nav>

        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cours" element={<Courses />} />
            <Route
              path="/app"
              element={
                <AuthView
                  step={step}
                  phone={phone}
                  otp={otp}
                  role={role}
                  userType={userType}
                  profile={profile}
                  handlePhone={handlePhone}
                  handleOtp={handleOtp}
                  handlePasswordVerify={handlePasswordVerify}
                  handleUserType={handleUserType}
                  handleSaveProfile={handleSaveProfile}
                  handleLogout={handleLogout}
                />
              }
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
