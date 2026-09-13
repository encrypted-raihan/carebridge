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

const patientEvents = [
  { date: "18 Apr", full: "18 Apr 2026", title: "Consultation", type: "consultation", detail: "Initial consultation" },
  { date: "28 Jul", full: "28 Jul 2026", title: "Discharge", type: "hospital", detail: "Hospital discharge" },
  { date: "12 Aug", full: "12 Aug 2026", title: "Prescription", type: "medicine", detail: "2 medicines documented" },
  { date: "24 Aug", full: "24 Aug 2026", title: "Follow-up", type: "followup", detail: "Follow-up consultation" },
  { date: "10 Sep", full: "10 Sep 2026", title: "Blood report", type: "lab", detail: "6 values extracted" },
];

const records = [
  ["Blood Report", "10 Sep 2026", "6 values extracted"],
  ["Prescription", "12 Aug 2026", "2 medicines"],
  ["Discharge Summary", "28 Jul 2026", "Hospital discharge"],
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
    if (!found) { setError("Invalid demo credentials."); return; }
    setError(""); setUser(found); setSection("Dashboard");
  };

  if (!user) return <Login email={email} password={password} setEmail={setEmail} setPassword={setPassword} error={error} login={login} />;

  const isDoctor = user.role === "doctor";
  const nav = isDoctor
    ? [["⌂", "Dashboard"], ["◉", "Patients"], ["◌", "Recent Activity"]]
    : [["⌂", "Dashboard"], ["◌", "Health Timeline"], ["▤", "Medical Records"], ["↗", "Sharing"]];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">+</span><span>CareBridge</span></div>
        <nav className="nav">{nav.map(([icon, label]) => <button key={label} className={section === label ? "active" : ""} onClick={() => { setSection(label); setSelectedPatient(false); }}><Icon>{icon}</Icon><span>{label}</span></button>)}</nav>
        <div className="sidebar-bottom"><div className="profile-mini"><div className="avatar">{user.name.split(" ").map(x => x[0]).slice(-2).join("")}</div><div><strong>{user.name}</strong><small>{isDoctor ? "Doctor" : "Patient"}</small></div></div><button className="logout" onClick={() => setUser(null)}>↪ &nbsp; Sign out</button></div>
      </aside>

      <main className="main">
        <header className="topbar"><div className="top-search">⌕ <span>{isDoctor ? "Search patients" : "Search your care"}</span></div><div className="top-actions"><button className="icon-btn">♧</button><button className="icon-btn avatar-top">{isDoctor ? "AK" : "RS"}</button></div></header>

        {isDoctor && selectedPatient ? <DoctorPatient onBack={() => setSelectedPatient(false)} /> : <>
          <section className="hero"><div><p className="eyebrow">{isDoctor ? "YOUR PRACTICE" : "YOUR CARE JOURNEY"}</p><h1>{isDoctor ? `Good morning, ${user.name.replace("Dr. ", "")}.` : `Good evening, ${user.name.split(" ")[0]}.`}</h1><p>{isDoctor ? "See the story behind your patients' latest records." : "Everything you need to understand your care, at a glance."}</p></div>{!isDoctor && <button className="primary hero-action">+ Add a record</button>}</section>
          {section === "Dashboard" && (isDoctor ? <DoctorDashboard onPatient={() => setSelectedPatient(true)} /> : <PatientDashboard />)}
          {section === "Health Timeline" && <PatientTimeline />}
          {section === "Medical Records" && <RecordsView />}
          {section === "Sharing" && <SharingView />}
          {section === "Patients" && <DoctorPatients onPatient={() => setSelectedPatient(true)} />}
          {section === "Recent Activity" && <DoctorActivity />}
        </>}
      </main>
    </div>
  );
}

function Login({ email, password, setEmail, setPassword, error, login }: { email: string; password: string; setEmail: (v:string)=>void; setPassword:(v:string)=>void; error:string; login:(e:FormEvent)=>void }) {
  return <main className="login-page"><div className="login-orbit"><span></span><span></span><span></span></div><section className="login-card"><div className="brand"><span className="brand-mark">+</span><span>CareBridge</span></div><div className="login-copy"><p className="eyebrow">CONTINUITY OF CARE</p><h1>Your health,<br/><em>connected.</em></h1><p>One clear story from every visit, report and prescription.</p></div><form onSubmit={login}><div className="field"><label>Email</label><input value={email} onChange={e=>setEmail(e.target.value)} /></div><div className="field"><label>Password</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>{error && <div className="error">{error}</div>}<button className="primary">Enter CareBridge <span>→</span></button></form><div className="demo-box"><strong>Demo access</strong><br/>Patient: patient1@carebridge.demo / Patient@123<br/>Doctor: doctor1@carebridge.demo / Doctor@123</div></section></main>;
}

function PatientDashboard() {
  return <div className="patient-home">
    <section className="journey-layout">
      <div className="journey-panel card">
        <div className="card-header"><div><p className="eyebrow">LONGITUDINAL VIEW</p><h2>Your care journey</h2></div><span className="journey-count">5 events</span></div>
        <div className="journey-line"><div className="journey-track" />{patientEvents.map((e, i) => <div className={`journey-event ${i === patientEvents.length - 1 ? "current" : ""}`} key={e.full}><div className="journey-node"><span /></div><div className="journey-date">{e.date}</div><div className="journey-title">{e.title}</div><div className="journey-detail">{e.detail}</div></div>)}</div>
        <button className="timeline-link">Open full timeline <span>↗</span></button>
      </div>
      <BodyMap />
    </section>

    <section className="insight-grid">
      <div className="change-feature card"><div className="feature-kicker">✦ INTELLIGENCE</div><h2>What changed?</h2><p className="feature-intro">Since your last follow-up on <b>24 Aug</b>, CareBridge found 3 documented changes.</p><div className="change-items"><Change icon="↗" title="Blood pressure" detail="124 / 82 → 116 / 70" note="8% lower" /><Change icon="+" title="Medication" detail="1 medicine added" note="12 Aug" /><Change icon="▤" title="New report" detail="Metabolic panel" note="10 Sep" /></div><button className="primary-small">See the full story →</button></div>
      <div className="records-feature card"><div className="card-header"><div><p className="eyebrow">YOUR DOCUMENTS</p><h2>Recent records</h2></div><button className="link">View all →</button></div><div className="records">{records.map(([name,date,detail]) => <Record key={name} name={name} date={date} detail={detail} />)}</div></div>
    </section>
  </div>;
}

function BodyMap() {
  return <section className="body-card card"><div className="body-heading"><div><p className="eyebrow">AT A GLANCE</p><h2>Where it matters</h2></div><span className="overall"><i /> Overall care <b>On track</b></span></div><div className="body-stage"><div className="body-glow" /><div className="mannequin"><div className="head"/><div className="neck"/><div className="torso"/><div className="arm left"/><div className="arm right"/><div className="leg left"/><div className="leg right"/><div className="joint j1"/><div className="joint j2"/><div className="joint j3"/></div><div className="body-label label-heart"><span className="hot-dot"/><div><b>Heart</b><small>2 updates</small></div></div><div className="body-label label-chest"><span className="hot-dot"/><div><b>Blood pressure</b><small>Trending better</small></div></div><div className="body-label label-leg"><span className="hot-dot"/><div><b>Medication</b><small>1 recent change</small></div></div></div><div className="body-footer"><span>Tap a point to explore</span><button className="link">View health map →</button></div></section>;
}

function Change({icon,title,detail,note}:{icon:string;title:string;detail:string;note:string}) { return <div className="change-item"><div className="change-icon">{icon}</div><div className="change-main"><strong>{title}</strong><span>{detail}</span></div><small>{note}</small></div>; }
function Record({name,date,detail}:{name:string;date:string;detail:string}) { return <div className="record"><div className="file-icon">▤</div><div className="record-main"><strong>{name}</strong><span>{date} · {detail}</span></div><button className="link">Open</button></div>; }

function PatientTimeline() { return <section className="card full-card"><div className="card-header"><div><p className="eyebrow">LONGITUDINAL VIEW</p><h2>Complete health timeline</h2></div><button className="primary-small">+ Add record</button></div><div className="full-timeline">{patientEvents.slice().reverse().concat([{date:"05 Mar",full:"05 Mar 2026",title:"Older consultation",type:"consultation",detail:"Initial care record"}]).map(e=><div className="full-event" key={e.full}><span className="big-node"/><div><small>{e.full}</small><h3>{e.title}</h3><p>{e.detail}</p></div><button className="link">Source ↗</button></div>)}</div></section>; }
function RecordsView() { return <section className="card full-card"><div className="card-header"><div><p className="eyebrow">YOUR DOCUMENTS</p><h2>Medical records</h2></div><button className="primary-small">+ Upload record</button></div><div className="records">{records.concat([["Consultation Notes","24 Aug 2026","Follow-up visit"],["Imaging Report","18 Apr 2026","Original report"]]).map(([name,date,detail])=><Record key={name} name={name} date={date} detail={detail}/>)}</div></section>; }
function SharingView() { return <section className="card full-card"><div className="card-header"><div><p className="eyebrow">PATIENT CONTROL</p><h2>Sharing & consent</h2></div><button className="primary-small">+ Share records</button></div><div className="share-card"><div className="avatar">AK</div><div><strong>Dr. Anil Kumar</strong><span>Records shared · Access expires 24 Sep 2026</span></div><button className="secondary">Revoke</button></div><p className="muted-note">Choose records, doctor and access duration before sharing. CareBridge never silently shares your health information.</p></section>; }

function DoctorDashboard({onPatient}:{onPatient:()=>void}) { return <div className="doctor-home"><section className="doctor-focus card"><div><p className="eyebrow">YOUR PATIENTS</p><h2>Who needs your attention?</h2><p>CareBridge surfaces the patient context that changed most recently.</p></div><div className="focus-number"><b>6</b><span>new records</span></div></section><section className="card patient-list"><div className="card-header"><div><p className="eyebrow">RECENT ACTIVITY</p><h2>Patients</h2></div><button className="link">View all →</button></div><PatientRow name="Raihan Shiras" last="24 Aug 2026" badge="3 new records" onPatient={onPatient}/><PatientRow name="Ananya Menon" last="18 Aug 2026" badge="1 new record" onPatient={onPatient}/></section></div>; }
function PatientRow({name,last,badge,onPatient}:{name:string;last:string;badge?:string;onPatient:()=>void}) { return <div className="patient-row"><div className="avatar">{name.split(" ").map(x=>x[0]).join("")}</div><div className="patient-info"><strong>{name}</strong><span>Last visit · {last}</span></div>{badge&&<span className="badge">{badge}</span>}<button className="open-btn" onClick={onPatient}>Open →</button></div>; }
function DoctorPatients({onPatient}:{onPatient:()=>void}) { return <section className="card full-card"><div className="card-header"><div><p className="eyebrow">CARE NETWORK</p><h2>My patients</h2></div><button className="primary-small">+ Add patient</button></div>{["Raihan Shiras","Ananya Menon","Arjun Nair","Meera Thomas"].map((n,i)=><PatientRow key={n} name={n} last={`${24-i*3} Aug 2026`} badge={i<2?(i===0?"3 new":"1 new"):undefined} onPatient={onPatient}/>)}</section>; }
function DoctorActivity() { return <section className="card full-card"><div className="card-header"><div><p className="eyebrow">ACTIVITY</p><h2>Recent activity</h2></div></div><div className="change-items"><Change icon="↗" title="Raihan Shiras · Blood Report" detail="New record received" note="10 Sep"/><Change icon="+" title="Ananya Menon · Prescription" detail="Medication updated" note="09 Sep"/></div></section>; }

function DoctorPatient({onBack}:{onBack:()=>void}) { return <div className="doctor-patient-view"><div className="detail-header"><button className="back-button" onClick={onBack}>← Patients</button><div className="patient-head"><div className="avatar large">RS</div><div><p className="eyebrow">AUTHORIZED PATIENT</p><h1>Raihan Shiras</h1><p>Patient P001 · 19 years</p></div></div><div className="action-row"><button className="secondary">Generate Handoff</button><button className="primary-small">Generate Care Brief</button></div></div><section className="doctor-context"><div className="context-main card"><p className="eyebrow">THE STORY SO FAR</p><h2>What matters now</h2><p className="context-copy">Three new records have arrived since the 24 Aug follow-up. CareBridge compared them with the previous available context.</p><div className="context-changes"><Change icon="↗" title="Blood pressure" detail="110 → 128" note="updated"/><Change icon="+" title="Medication" detail="Medicine X · 500 mg" note="added"/><Change icon="▤" title="Records" detail="3 new documents" note="10 Sep"/></div></div><div className="mini-timeline card"><p className="eyebrow">CARE JOURNEY</p><h2>Recent events</h2>{patientEvents.slice().reverse().map(e=><div className="mini-event" key={e.full}><span/><div><b>{e.title}</b><small>{e.date} · {e.detail}</small></div></div>)}</div></section></div>; }
