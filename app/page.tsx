"use client";

import { FormEvent, useState } from "react";

type Role = "patient" | "doctor";
type User = { email: string; password: string; role: Role; name: string };

const USERS: User[] = [
  { email: "patient1@carebridge.demo", password: "Patient@123", role: "patient", name: "Raihan Shiras" },
  { email: "patient2@carebridge.demo", password: "Patient@456", role: "patient", name: "Ananya Menon" },
  { email: "doctor1@carebridge.demo", password: "Doctor@123", role: "doctor", name: "Dr. Anil Kumar" },
  { email: "doctor2@carebridge.demo", password: "Doctor@456", role: "doctor", name: "Dr. Meera Nair" },
];

const events = [
  ["10 Sep 2026", "Blood report", "Latest investigation uploaded · 6 values extracted"],
  ["24 Aug 2026", "Consultation", "Dr. Anil Kumar · Follow-up visit"],
  ["12 Aug 2026", "Prescription", "2 medicines documented · 1 updated"],
  ["28 Jul 2026", "Discharge summary", "Hospital discharge · Follow-up advised"],
];

const records = [
  ["Blood Report", "10 Sep 2026", "PDF"],
  ["Prescription", "12 Aug 2026", "PDF"],
  ["Discharge Summary", "28 Jul 2026", "PDF"],
];

function Icon({ children }: { children: React.ReactNode }) { return <span className="nav-icon">{children}</span>; }

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("patient1@carebridge.demo");
  const [password, setPassword] = useState("Patient@123");
  const [error, setError] = useState("");
  const [section, setSection] = useState("Dashboard");
  const [selectedPatient, setSelectedPatient] = useState(false);

  const login = (e: FormEvent) => {
    e.preventDefault();
    const found = USERS.find((u) => u.email === email.trim().toLowerCase() && u.password === password);
    if (!found) { setError("Invalid demo credentials. Use one of the accounts shown below."); return; }
    setError(""); setUser(found); setSection("Dashboard");
  };

  if (!user) return <main className="login-page"><section className="login-card">
    <div className="brand"><span className="brand-mark">+</span><span>CareBridge</span></div>
    <h1>Welcome back.</h1><p className="sub">Your health journey, connected in one place.</p>
    <form onSubmit={login}>
      <div className="field"><label htmlFor="email">Email</label><input id="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
      <div className="field"><label htmlFor="password">Password</label><input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
      {error && <div className="error">{error}</div>}<button className="primary">Sign in</button>
    </form>
    <div className="demo-box"><strong>Hackathon demo accounts</strong><br />Patient: patient1@carebridge.demo / Patient@123<br />Patient: patient2@carebridge.demo / Patient@456<br />Doctor: doctor1@carebridge.demo / Doctor@123<br />Doctor: doctor2@carebridge.demo / Doctor@456</div>
  </section></main>;

  const isDoctor = user.role === "doctor";
  const nav = isDoctor ? [["⌂", "Dashboard"], ["◉", "Patients"], ["▤", "Recent Activity"]] : [["⌂", "Dashboard"], ["◌", "Health Timeline"], ["▤", "Medical Records"], ["↗", "Sharing"]];

  return <div className="app-shell"><aside className="sidebar">
    <div className="brand"><span className="brand-mark">+</span><span>CareBridge</span></div>
    <nav className="nav">{nav.map(([icon, label]) => <button key={label} className={section === label ? "active" : ""} onClick={() => { setSection(label); setSelectedPatient(false); }}><Icon>{icon}</Icon><span>{label}</span></button>)}</nav>
    <div className="sidebar-bottom"><div className="profile-mini"><div className="avatar">{user.name.split(" ").map((x) => x[0]).slice(-2).join("")}</div><div><strong>{user.name}</strong><small>{isDoctor ? "Doctor" : "Patient"}</small></div></div><button className="logout" onClick={() => setUser(null)}>↪ &nbsp; Sign out</button></div>
  </aside><main className="main">
    <header className="topbar"><input className="search" placeholder={isDoctor ? "Search patients..." : "Search records..."} /><div className="top-actions"><button className="icon-btn">♧</button><button className="icon-btn">{isDoctor ? "DR" : "RS"}</button></div></header>
    {isDoctor && selectedPatient ? <DoctorPatient onBack={() => setSelectedPatient(false)} /> : <><section className="hero"><h1>{isDoctor ? `Good morning, ${user.name.replace("Dr. ", "")}.` : `Good evening, ${user.name.split(" ")[0]}.`}</h1><p>{isDoctor ? "Your patients' latest health context at a glance." : "Here's your health journey at a glance."}</p></section>
    {section === "Dashboard" && (isDoctor ? <DoctorDashboard onPatient={() => setSelectedPatient(true)} /> : <PatientDashboard />)}
    {section === "Health Timeline" && <PatientTimeline />}{section === "Medical Records" && <RecordsView />}{section === "Sharing" && <SharingView />}{section === "Patients" && <DoctorPatients onPatient={() => setSelectedPatient(true)} />}{section === "Recent Activity" && <DoctorActivity />}</>}
  </main></div>;
}

function PatientDashboard() { return <><div className="stats">
  <div className="stat"><div className="stat-top"><span>Health records</span><span>▤</span></div><div className="stat-value">12</div><div className="stat-note">+3 this month</div></div>
  <div className="stat"><div className="stat-top"><span>Care events</span><span>◌</span></div><div className="stat-value">8</div><div className="stat-note">Across 3 providers</div></div>
  <div className="stat"><div className="stat-top"><span>Next follow-up</span><span>□</span></div><div className="stat-value" style={{fontSize:22}}>24 Sep</div><div className="stat-note">Dr. Anil Kumar</div></div>
</div><div className="grid"><section className="card"><div className="card-header"><h2>Your health timeline</h2><button className="link">View all →</button></div><div className="timeline">{events.map(([date,title,desc]) => <div className="event" key={date}><span className="dot"/><div className="event-date">{date}</div><div className="event-title">{title}</div><div className="event-desc">{desc}</div></div>)}</div></section>
<section className="card change"><div className="card-header"><h2>What changed?</h2><span className="badge">3 updates</span></div><div className="change-list"><Change icon="↑" title="Lab values updated" detail="2 values changed since 24 Aug"/><Change icon="+" title="New medication" detail="1 medicine documented"/><Change icon="▤" title="New blood report" detail="Uploaded 10 Sep 2026"/></div></section></div>
<section className="card" style={{marginTop:18}}><div className="card-header"><h2>Recent records</h2><button className="link">View all →</button></div><div className="records">{records.map(([name,date,type]) => <Record key={name} name={name} date={date} type={type}/>)}</div></section></>; }

function Change({icon,title,detail}:{icon:string;title:string;detail:string}) { return <div className="change-row"><div className="change-icon">{icon}</div><div><strong>{title}</strong><span>{detail}</span></div></div>; }
function Record({name,date,type}:{name:string;date:string;type:string}) { return <div className="record"><div className="file-icon">▤</div><div className="record-main"><strong>{name}</strong><span>{date} · {type}</span></div><button className="link">Open →</button></div>; }
function PatientTimeline() { return <section className="card"><div className="card-header"><h2>Complete health timeline</h2><button className="primary-small">+ Add record</button></div><div className="timeline">{events.concat([["18 Apr 2026","Consultation","Initial consultation · CareBridge record created"]]).map(([date,title,desc]) => <div className="event" key={date}><span className="dot"/><div className="event-date">{date}</div><div className="event-title">{title}</div><div className="event-desc">{desc}</div></div>)}</div></section>; }
function RecordsView() { return <section className="card"><div className="card-header"><h2>Medical records</h2><button className="primary-small">+ Upload record</button></div><div className="records">{records.concat([["Consultation Notes","24 Aug 2026","PDF"],["Imaging Report","18 Apr 2026","PDF"]]).map(([name,date,type]) => <Record key={name} name={name} date={date} type={type}/>)}</div></section>; }
function SharingView() { return <section className="card"><div className="card-header"><h2>Sharing & consent</h2><button className="primary-small">+ Share records</button></div><div className="change-list"><div className="change-row"><div className="change-icon">✓</div><div><strong>Dr. Anil Kumar</strong><span>Records shared · Access expires 24 Sep 2026</span></div><button className="secondary">Revoke</button></div><div className="change-row"><div className="change-icon">+</div><div><strong>Patient-controlled access</strong><span>Choose records, doctor and access duration before sharing.</span></div></div></div></section>; }

function DoctorDashboard({onPatient}:{onPatient:()=>void}) { return <><div className="stats"><div className="stat"><div className="stat-top"><span>My patients</span><span>◉</span></div><div className="stat-value">24</div><div className="stat-note">Active patients</div></div><div className="stat"><div className="stat-top"><span>New records</span><span>▤</span></div><div className="stat-value">6</div><div className="stat-note">Since yesterday</div></div><div className="stat"><div className="stat-top"><span>Follow-ups</span><span>□</span></div><div className="stat-value">3</div><div className="stat-note">This week</div></div></div>
<section className="card"><div className="card-header"><h2>Patients needing attention</h2><button className="link">View all →</button></div><div className="doctor-patient"><PatientRow name="Raihan Shiras" last="24 Aug 2026" badge="3 new records" onPatient={onPatient}/><PatientRow name="Ananya Menon" last="18 Aug 2026" badge="1 new record" onPatient={onPatient}/></div></section></>; }
function PatientRow({name,last,badge,onPatient}:{name:string;last:string;badge?:string;onPatient:()=>void}) { return <div className="patient-row"><div className="avatar">{name.split(" ").map(x=>x[0]).join("")}</div><div className="patient-info"><strong>{name}</strong><span>Last visit · {last}</span></div>{badge&&<span className="badge">{badge}</span>}<button className="open-btn" onClick={onPatient}>Open</button></div>; }
function DoctorPatients({onPatient}:{onPatient:()=>void}) { return <section className="card"><div className="card-header"><h2>My patients</h2><button className="primary-small">+ Add patient</button></div><div className="doctor-patient">{["Raihan Shiras","Ananya Menon","Arjun Nair","Meera Thomas"].map((name,i)=><PatientRow key={name} name={name} last={`${24-i*3} Aug 2026`} badge={i<2?(i===0?"3 new":"1 new"):undefined} onPatient={onPatient}/>)}</div></section>; }
function DoctorActivity() { return <section className="card"><div className="card-header"><h2>Recent activity</h2></div><div className="change-list"><Change icon="↑" title="Raihan Shiras · Blood Report" detail="New record received · 10 Sep 2026"/><Change icon="+" title="Ananya Menon · Prescription" detail="Medication updated · 09 Sep 2026"/></div></section>; }

function DoctorPatient({onBack}:{onBack:()=>void}) { return <><div className="detail-header"><div className="patient-head"><div className="avatar">RS</div><div><h1>Raihan Shiras</h1><p>Patient ID P001 · 19 years · Authorized access</p></div></div><div className="action-row"><button className="secondary" onClick={onBack}>← Back</button><button className="secondary">Generate Handoff</button><button className="primary-small">Generate Care Brief</button></div></div>
<div className="stats"><div className="stat"><div className="stat-top"><span>Recent records</span><span>▤</span></div><div className="stat-value">3</div><div className="stat-note">Since last visit</div></div><div className="stat"><div className="stat-top"><span>Medication changes</span><span>+</span></div><div className="stat-value">1</div><div className="stat-note">Documented change</div></div><div className="stat"><div className="stat-top"><span>Latest report</span><span>□</span></div><div className="stat-value" style={{fontSize:20}}>10 Sep</div><div className="stat-note">Blood report</div></div></div>
<div className="grid"><section className="card"><div className="card-header"><h2>Patient timeline</h2><button className="link">View source records →</button></div><div className="timeline">{events.map(([date,title,desc])=><div className="event" key={date}><span className="dot"/><div className="event-date">{date}</div><div className="event-title">{title}</div><div className="event-desc">{desc}</div></div>)}</div></section><section className="card change"><div className="card-header"><h2>What changed?</h2><span className="badge">Since 24 Aug</span></div><div className="change-list"><Change icon="↑" title="Lab value updated" detail="Test A · 110 → 128"/><Change icon="+" title="Medication added" detail="Medicine X · 500 mg"/><Change icon="▤" title="3 new records" detail="All traceable to source documents"/></div></section></div>
<section className="card" style={{marginTop:18}}><div className="card-header"><h2>Source-linked Care Brief</h2><span className="badge">Demo preview</span></div><p className="sub"><b>Recent care:</b> Follow-up consultation on 24 Aug with a new blood report received on 10 Sep.</p><p className="sub"><b>Documented changes:</b> one medication was added and one tracked lab value changed from 110 to 128.</p><p className="sub"><b>Source:</b> Blood_Report_10_Sep.pdf · Prescription_12_Aug.pdf</p></section></>; }
