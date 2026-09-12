"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CookieConsent(){
  const [show, setShow] = useState(false);
  useEffect(()=>{
    // Defer to avoid react-hooks/set-state-in-effect — consent check is external sync
    const timer = setTimeout(() => {
      try{
        const consent = localStorage.getItem("apex_cookie_consent");
        if(!consent) setShow(true);
      }catch{}
    }, 0);
    return () => clearTimeout(timer);
  },[]);
  const accept = ()=>{
    try{ localStorage.setItem("apex_cookie_consent","accepted"); }catch{}
    setShow(false);
  };
  const decline = ()=>{
    try{ localStorage.setItem("apex_cookie_consent","declined"); }catch{}
    setShow(false);
  };
  if(!show) return null;
  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-[100] glass rounded-2xl shadow-2xl p-5 text-sm fade-up">
      <div className="font-black mb-2">🍪 We use cookies</div>
      <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed mb-4">
        Apex uses essential cookies for login, and – with your consent – analytics cookies to improve Core Web Vitals. 
        See our <Link href="/privacy" className="underline text-indigo-600 dark:text-indigo-400">Privacy Policy</Link>.
      </p>
      <div className="flex gap-2">
        <button onClick={accept} className="btn btn-primary flex-1 py-2.5 rounded-xl font-black text-xs">Accept analytics</button>
        <button onClick={decline} className="btn btn-secondary px-4 py-2.5 rounded-xl text-xs font-bold">Essential only</button>
      </div>
    </div>
  )
}
