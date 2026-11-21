import { useState } from 'react';
import { BookOpen, FileText, GraduationCap, MessageCircle, PenTool, Trophy } from 'lucide-react';
import type { PrixConfig, ServiceType } from '../types/sira';
import { getLecons, getMatieres, MATIERES_BY_KEY, NIVEAUX_BY_SYSTEME, SYSTEMES } from '../data/curriculum';
import { Card, GBtn, IF, LegalFooter, SF } from './ui';

type OnOrderFn = (l: string, d: string, a: number, type: ServiceType) => void;

function CascadeSelector({ onOrder, label, prix }: { onOrder: OnOrderFn; label: string; prix: number }) {
  const [sys, setSys] = useState('');
  const [niv, setNiv] = useState('');
  const [mat, setMat] = useState('');
  const [lec, setLec] = useState('');
  const [detail, setDetail] = useState('');

  const niveaux = sys ? NIVEAUX_BY_SYSTEME[sys] ?? [] : [];
  const matieres = niv ? getMatieres(niv) : [];
  const lecons = mat ? getLecons(niv, mat) : [];
  const ok = sys && niv && mat && lec;

  const getServiceType = (l: string): ServiceType => {
    if (l.includes('Cours')) return 'cours';
    if (l.includes('Exercice')) return 'exercice';
    if (l.includes('Fiche')) return 'fiche';
    return 'examen';
  };

  const submit = () => {
    if (!ok) return;
    const d = `${sys} · ${niv} · ${mat} · ${lec}${detail ? ' — ' + detail : ''}`;
    onOrder(label, d, prix, getServiceType(label));
  };

  return (
    <div className="space-y-3">
      <SF label="Système d'éducation" value={sys} onChange={v => { setSys(v); setNiv(''); setMat(''); setLec(''); }} options={SYSTEMES} placeholder="Choisir un système…" />
      {sys && niveaux.length > 0 && <SF label="Niveau / Classe" value={niv} onChange={v => { setNiv(v); setMat(''); setLec(''); }} options={niveaux} placeholder="Choisir la classe…" />}
      {niv && matieres.length > 0 && <SF label="Matière" value={mat} onChange={v => { setMat(v); setLec(''); }} options={matieres} placeholder="Choisir une matière…" />}
      {mat && lecons.length > 0 && <SF label="Leçon au programme" value={lec} onChange={setLec} options={lecons} placeholder="Choisir la leçon…" />}
      {mat && lecons.length === 0 && <IF label="Leçon / Chapitre" value={lec} onChange={setLec} placeholder="Ex : Le théorème de Thalès…" />}
      {lec && <IF label="Point précis ou grand titre (optionnel)" value={detail} onChange={setDetail} placeholder="Ex : II. Applications du théorème…" />}
      <GBtn onClick={submit} disabled={!ok}>
        <MessageCircle className="w-4 h-4" /> Payer &amp; Recevoir via WhatsApp
      </GBtn>
    </div>
  );
}

function CoursCard({ onOrder, prix }: { onOrder: OnOrderFn; prix: number }) {
  return (
    <Card icon={BookOpen} title="Cours complet" price={`${prix} FCFA`} description="Cours rédigé conformément au programme officiel de votre système scolaire.">
      <CascadeSelector label="Cours complet" onOrder={onOrder} prix={prix} />
    </Card>
  );
}

function ExercicesCard({ onOrder, prix }: { onOrder: OnOrderFn; prix: number }) {
  const [sys, setSys] = useState('');
  const [niv, setNiv] = useState('');
  const [mat, setMat] = useState('');
  const [lec, setLec] = useState('');
  const niveaux = sys ? NIVEAUX_BY_SYSTEME[sys] ?? [] : [];
  const matieres = niv ? getMatieres(niv) : [];
  const lecons = mat ? getLecons(niv, mat) : [];

  return (
    <Card icon={PenTool} title="Exercices corrigés" price={`${prix} FCFA`} description="Série d'exercices avec corrections détaillées, conformes au programme.">
      <SF label="Système d'éducation" value={sys} onChange={v => { setSys(v); setNiv(''); setMat(''); setLec(''); }} options={SYSTEMES} placeholder="Choisir un système…" />
      {sys && niveaux.length > 0 && <SF label="Niveau / Classe" value={niv} onChange={v => { setNiv(v); setMat(''); setLec(''); }} options={niveaux} placeholder="Choisir la classe…" />}
      {niv && matieres.length > 0 && <SF label="Matière" value={mat} onChange={v => { setMat(v); setLec(''); }} options={matieres} placeholder="Choisir une matière…" />}
      {mat && lecons.length > 0 && <SF label="Leçon (optionnel)" value={lec} onChange={setLec} options={lecons} placeholder="Toutes les leçons ou choisir…" />}
      {mat && lecons.length === 0 && <IF label="Chapitre (optionnel)" value={lec} onChange={setLec} placeholder="Ex : Probabilités, Thermodynamique…" />}
      <GBtn onClick={() => sys && niv && mat && onOrder('Exercices corrigés', `${sys} · ${niv} · ${mat}${lec ? ' · ' + lec : ''}`, prix, 'exercice')} disabled={!sys || !niv || !mat}>
        <MessageCircle className="w-4 h-4" /> Payer &amp; Recevoir les exercices
      </GBtn>
    </Card>
  );
}

function FicheCard({ onOrder, prix }: { onOrder: OnOrderFn; prix: number }) {
  const [sys, setSys] = useState('');
  const [niv, setNiv] = useState('');
  const [mat, setMat] = useState('');
  const niveaux = sys ? NIVEAUX_BY_SYSTEME[sys] ?? [] : [];
  const matieres = niv ? getMatieres(niv) : [];

  return (
    <Card icon={FileText} title="Fiche de révision" price={`${prix} FCFA`} description="Fiche synthétique : l'essentiel d'un chapitre pour réviser efficacement.">
      <SF label="Système d'éducation" value={sys} onChange={v => { setSys(v); setNiv(''); setMat(''); }} options={SYSTEMES} placeholder="Choisir un système…" />
      {sys && niveaux.length > 0 && <SF label="Niveau / Classe" value={niv} onChange={v => { setNiv(v); setMat(''); }} options={niveaux} placeholder="Choisir la classe…" />}
      {niv && matieres.length > 0 && <SF label="Matière" value={mat} onChange={v => { setMat(v); }} options={matieres} placeholder="Choisir une matière…" />}
      <GBtn onClick={() => sys && niv && mat && onOrder('Fiche de révision', `${sys} · ${niv} · ${mat}`, prix, 'fiche')} disabled={!sys || !niv || !mat}>
        <MessageCircle className="w-4 h-4" /> Payer &amp; Recevoir la fiche
      </GBtn>
    </Card>
  );
}

function ExamenCard({ onOrder, prix }: { onOrder: OnOrderFn; prix: number }) {
  const [examen, setExamen] = useState('');
  const [mat, setMat] = useState('');
  const [theme, setTheme] = useState('');
  const mats = examen.includes('BEPC') ? MATIERES_BY_KEY['3e'] : MATIERES_BY_KEY['TleD'];

  return (
    <Card icon={Trophy} title="Préparation examen" price={`${prix} FCFA`} description="Pack révision complet pour le BEPC ou le BAC — sujets + corrections.">
      <SF label="Examen cible" value={examen} onChange={v => { setExamen(v); setMat(''); }} options={['BEPC (3ème)','BAC Série A','BAC Série C','BAC Série D']} placeholder="Choisir l'examen…" />
      {examen && <SF label="Matière prioritaire" value={mat} onChange={setMat} options={mats} placeholder="Choisir une matière…" />}
      {mat && <IF label="Thème prioritaire (optionnel)" value={theme} onChange={setTheme} placeholder="Ex : Probabilités, Révolution française…" />}
      <GBtn onClick={() => examen && mat && onOrder('Préparation examen', `${examen} · ${mat}${theme ? ' · ' + theme : ''}`, prix, 'examen')} disabled={!examen || !mat}>
        <MessageCircle className="w-4 h-4" /> Payer &amp; Préparer mon examen
      </GBtn>
    </Card>
  );
}

export function ServicesTab({ onOrder, prix }: { onOrder: OnOrderFn; prix: PrixConfig }) {
  return (
    <div className="space-y-4">
      <div className="bg-[#2c1c0e] rounded-2xl p-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#1a0f07] flex items-center justify-center shrink-0">
          <GraduationCap className="w-4 h-4 text-emerald-400" />
        </div>
        <div>
          <p className="text-[#f5e6d3] font-bold text-sm">Cours sur mesure — tous systèmes</p>
          <p className="text-[#b89070] text-[11px] mt-0.5">Conformes aux programmes officiels. Livraison via WhatsApp.</p>
        </div>
      </div>
      <CoursCard onOrder={onOrder} prix={prix.cours} />
      <ExercicesCard onOrder={onOrder} prix={prix.exercices} />
      <FicheCard onOrder={onOrder} prix={prix.fiche} />
      <ExamenCard onOrder={onOrder} prix={prix.examen} />
      <LegalFooter />
    </div>
  );
}
