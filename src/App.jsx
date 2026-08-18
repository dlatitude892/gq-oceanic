import { useState, useEffect, useRef } from "react";
import {
  Anchor, Ship, Compass, FileCheck, ShieldCheck, AlertTriangle,
  Users, Newspaper, MapPin, Lock, Plus, Trash2, Pencil, LogOut,
  ChevronRight, X, Save, Menu, ArrowRight, Container, Ruler, Fuel,
  ClipboardList, HardHat, Waves, Factory, Flame, Image as ImageIcon,
  Briefcase
} from "lucide-react";

const STORAGE_KEY = "gq-oceanic-content";
const ADMIN_PASSWORD = "gqoceanic2026";
const API_BASE = "/api";

const SERVICES = [
  { icon: Ship, title: "Hull & Machinery Survey", desc: "Full structural and mechanical condition assessment for vessels of any class." },
  { icon: Container, title: "Cargo Survey", desc: "Loading, discharge, and stowage surveys to verify quantity and condition." },
  { icon: FileCheck, title: "Pre-Purchase / Condition Survey", desc: "Independent condition reporting before sale, charter, or acquisition." },
  { icon: Compass, title: "Marine Warranty Survey", desc: "Risk assessment and approval for marine warranty on offshore operations." },
  { icon: AlertTriangle, title: "Damage & Casualty Survey", desc: "On-site investigation and reporting following incidents or casualties." },
  { icon: ShieldCheck, title: "P&I / Loss Prevention", desc: "Club-instructed surveys focused on liability exposure and prevention." },
  { icon: Ruler, title: "Draft & Deadweight Survey", desc: "Precise draft readings and deadweight calculations for load verification." },
  { icon: Fuel, title: "Bunker Survey", desc: "Fuel quantity and quality verification at delivery, transfer, or ROB checks." },
  { icon: ClipboardList, title: "On/Off-Hire Survey", desc: "Condition and bunker reporting at charter delivery and redelivery." },
  { icon: HardHat, title: "Newbuilding Supervision", desc: "On-site quality oversight during construction, through sea trials and delivery." },
  { icon: Waves, title: "Marine Casualty Investigation", desc: "Root-cause investigation for groundings, collisions, and machinery failures." },
  { icon: Anchor, title: "Yacht & Small Craft Survey", desc: "Condition and valuation surveys for yachts and commercial small craft." },
];

const INDUSTRIES = [
  { icon: Factory, name: "Petrochemical" },
  { icon: Flame, name: "Oil & Gas" },
  { icon: Ship, name: "Offshore Energy" },
  { icon: Container, name: "Terminal Operations" },
  { icon: Fuel, name: "LNG / Refining" },
];

const GALLERY_CATEGORIES = ["Oil Rig", "Marine / Oceanic", "Maintenance"];

const REGIONS = [
  {
    name: "North America",
    kicker: "HEADQUARTERS",
    blurb: "Our home base, covering major ports and inland waterways with our core surveying team.",
    areas: ["Gulf Coast", "Houston", "New Orleans", "East Coast", "New York / New Jersey", "West Coast", "Los Angeles / Long Beach", "Great Lakes"],
  },
  {
    name: "Middle East",
    kicker: "REGIONAL DESK",
    blurb: "Surveyors on the ground across Gulf ports, supporting owners, charterers, and underwriters.",
    areas: ["UAE", "Dubai", "Abu Dhabi", "Jebel Ali", "Saudi Arabia", "Jeddah", "Dammam", "Qatar", "Doha", "Oman", "Sohar"],
  },
  {
    name: "Asia",
    kicker: "REGIONAL DESK",
    blurb: "Coverage across major Asian shipping and transshipment hubs, coordinated with our core team.",
    areas: ["Singapore", "Hong Kong", "South Korea", "Busan", "Japan", "Yokohama", "China", "Shanghai"],
  },
  {
    name: "Europe",
    kicker: "REGIONAL DESK",
    blurb: "Survey support at key European ports for owners, underwriters, and charterers.",
    areas: ["Netherlands", "Rotterdam", "United Kingdom", "Southampton", "Greece", "Piraeus"],
  },
];

const DEFAULT_CONTENT = {
  news: [
    { id: "n1", date: "2026-06-02", tag: "Expansion", title: "G&Q Oceanic opens Middle East desk", body: "Sample entry — edit or remove this in the admin panel. We've expanded coverage to support Gulf port operations alongside our North America base." },
    { id: "n2", date: "2026-04-14", tag: "Accreditation", title: "Surveyor team completes IACS refresher", body: "Sample entry — edit or remove this in the admin panel." },
  ],
  team: [
    { id: "t1", name: "Add your first surveyor", role: "Managing Surveyor", region: "North America", bio: "Edit this profile in the admin panel.", photo: "" },
    { id: "t2", name: "Add a team member", role: "Senior Marine Surveyor", region: "Middle East", bio: "Edit this profile in the admin panel.", photo: "" },
  ],
  gallery: [],
  requests: [],
};

function useSiteContent() {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/content`);
        if (!res.ok) throw new Error("Request failed");
        const data = await res.json();
        setContent(data);
      } catch (e) {
        setError("Couldn't reach the content API. If you're developing locally, run 'netlify dev' instead of 'npm run dev' so the /api functions are available.");
      }
      setLoaded(true);
    })();
  }, []);

  const save = async (next) => {
    setContent(next); // update UI immediately
    try {
      const res = await fetch(`${API_BASE}/content`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      if (!res.ok) throw new Error("Save failed");
      setError("");
    } catch (e) {
      setError("Couldn't save — if you're developing locally, run 'netlify dev' so the /api functions are available.");
    }
  };

  return { content, save, loaded, error };
}

function Contours({ className }) {
  return (
    <svg className={className} viewBox="0 0 1200 400" preserveAspectRatio="none" fill="none">
      {[60, 120, 180, 240, 300, 360].map((y, i) => (
        <path
          key={i}
          d={`M0,${y} C150,${y - 30 + (i % 2) * 20} 300,${y + 30} 450,${y} S750,${y - 40} 900,${y + 10} S1100,${y - 20} 1200,${y}`}
          stroke="currentColor"
          strokeWidth="1"
          opacity={0.14 + i * 0.02}
        />
      ))}
    </svg>
  );
}

function Reveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function Logo({ light }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={`w-9 h-9 rounded-sm flex items-center justify-center ${light ? "bg-amber-400" : "bg-slate-900"}`}>
        <Anchor size={18} className={light ? "text-slate-900" : "text-amber-400"} strokeWidth={2.25} />
      </div>
      <div className="leading-none">
        <div className={`font-serif text-lg tracking-tight ${light ? "text-white" : "text-slate-900"}`}>G&amp;Q Oceanic</div>
        <div className={`text-[10px] tracking-[0.25em] font-mono ${light ? "text-amber-300" : "text-amber-600"}`}>MARINE SURVEYORS</div>
      </div>
    </div>
  );
}

function PublicSite({ content, onStaffClick, onSubmitRequest }) {
  const [navOpen, setNavOpen] = useState(false);
  const [galleryFilter, setGalleryFilter] = useState("All");
  const [contactForm, setContactForm] = useState({ name: "", email: "", details: "" });
  const [contactStatus, setContactStatus] = useState("idle"); // idle | sending | sent | error

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.details.trim()) {
      setContactStatus("error");
      return;
    }
    setContactStatus("sending");
    try {
      await onSubmitRequest(contactForm);
      setContactForm({ name: "", email: "", details: "" });
      setContactStatus("sent");
    } catch (err) {
      setContactStatus("error");
    }
  };
  const navLinks = [
    { href: "#services", label: "Services" },
    { href: "#industries", label: "Industries" },
    { href: "#regions", label: "Regions" },
    { href: "#gallery", label: "Gallery" },
    { href: "#news", label: "News" },
    { href: "#team", label: "Team" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <div className="bg-stone-50 text-slate-900 font-sans min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-5 py-3.5 flex items-center justify-between">
          <Logo light />
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map(l => (
              <a key={l.href} href={l.href} className="text-sm text-slate-300 hover:text-amber-400 transition-colors">{l.label}</a>
            ))}
            <button onClick={onStaffClick} className="flex items-center gap-1.5 text-xs font-mono tracking-wide text-slate-400 hover:text-amber-400 border border-slate-700 hover:border-amber-500 rounded-sm px-3 py-1.5 transition-colors">
              <Lock size={12} /> STAFF
            </button>
          </nav>
          <button className="md:hidden text-slate-300" onClick={() => setNavOpen(!navOpen)}><Menu size={22} /></button>
        </div>
        {navOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-950 px-5 py-4 flex flex-col gap-3">
            {navLinks.map(l => (
              <a key={l.href} href={l.href} onClick={() => setNavOpen(false)} className="text-sm text-slate-300">{l.label}</a>
            ))}
            <button onClick={onStaffClick} className="flex items-center gap-1.5 text-xs font-mono text-amber-400 pt-2">
              <Lock size={12} /> STAFF LOGIN
            </button>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative bg-slate-950 text-white overflow-hidden">
        <Contours className="absolute inset-0 w-full h-full text-amber-400 gq-drift" />
        <div className="relative max-w-6xl mx-auto px-5 pt-20 pb-24">
          <div className="font-mono text-xs tracking-[0.3em] text-amber-400 mb-5">
            29.7604° N, 95.3698° W &nbsp;·&nbsp; 25.2048° N, 55.2708° E
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl leading-[1.05] max-w-2xl">
            Independent marine surveys, held to one standard.
          </h1>
          <p className="mt-6 text-slate-300 max-w-xl text-base leading-relaxed">
            G&amp;Q Oceanic is a marine surveying firm based in North America, with surveyors
            active across the Middle East. Hull, cargo, condition, and casualty work — reported
            the way underwriters and owners actually need it.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#contact" className="inline-flex items-center gap-2 bg-amber-400 text-slate-900 font-medium text-sm px-5 py-3 rounded-sm hover:bg-amber-300 transition-colors">
              Request a Survey <ArrowRight size={16} />
            </a>
            <a href="#services" className="inline-flex items-center gap-2 border border-slate-600 text-slate-200 text-sm px-5 py-3 rounded-sm hover:border-amber-400 hover:text-amber-400 transition-colors">
              View Services
            </a>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="max-w-6xl mx-auto px-5 py-16 sm:py-20 scroll-mt-20">
        <div className="flex items-baseline justify-between mb-10">
          <h2 className="font-serif text-3xl text-slate-900">Survey Services</h2>
          <span className="hidden sm:block font-mono text-xs text-slate-400">{String(SERVICES.length).padStart(2,"0")} DISCIPLINES</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {SERVICES.map((s, i) => (
            <Reveal key={i} delay={i * 40}>
            <div className="border border-stone-200 bg-white rounded-sm p-5 sm:p-6 hover:border-amber-400 hover:-translate-y-0.5 transition-all h-full">
              <s.icon size={22} className="text-amber-600 mb-4" strokeWidth={1.75} />
              <h3 className="font-serif text-lg text-slate-900 mb-2">{s.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
            </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Industries / Independent Contractor */}
      <section id="industries" className="bg-stone-100 py-16 sm:py-20 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
            <Reveal className="lg:col-span-2">
              <div className="flex items-center gap-2 text-amber-700 font-mono text-xs tracking-widest mb-3">
                <Briefcase size={14} /> INDEPENDENT CONTRACTOR &amp; CONSULTANT
              </div>
              <h2 className="font-serif text-3xl text-slate-900 mb-4">Embedded in your operations, not just your inbox</h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                Beyond standalone surveys, G&amp;Q Oceanic works as an independent contractor and
                consultant specialist to petrochemical and gas companies — supporting terminal,
                refinery, and offshore teams with on-site marine expertise for as long as a project needs it.
              </p>
            </Reveal>
            <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {INDUSTRIES.map((ind, i) => (
                <Reveal key={ind.name} delay={i * 60}>
                  <div className="bg-white border border-stone-200 rounded-sm p-5 flex flex-col items-start gap-3 h-full hover:border-amber-400 transition-colors">
                    <ind.icon size={20} className="text-amber-600" strokeWidth={1.75} />
                    <span className="text-sm font-medium text-slate-800">{ind.name}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Regions */}
      <section id="regions" className="bg-slate-900 text-white py-16 sm:py-20 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="font-serif text-3xl mb-10">Where We Work</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {REGIONS.map((r) => (
              <div key={r.name} className="border border-slate-700 rounded-sm p-6 sm:p-7">
                <div className="flex items-center gap-2 text-amber-400 font-mono text-xs tracking-widest mb-3">
                  <MapPin size={14} /> {r.kicker}
                </div>
                <h3 className="font-serif text-2xl mb-2">{r.name}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-5">{r.blurb}</p>
                <div className="flex flex-wrap gap-2">
                  {r.areas.map((a) => (
                    <span key={a} className="text-xs font-mono text-slate-300 border border-slate-700 rounded-sm px-2.5 py-1">{a}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="max-w-6xl mx-auto px-5 py-16 sm:py-20 scroll-mt-20">
        <div className="flex flex-wrap items-baseline justify-between gap-4 mb-8">
          <h2 className="font-serif text-3xl text-slate-900">Our Work</h2>
          <span className="hidden sm:flex items-center gap-1.5 font-mono text-xs text-slate-400"><ImageIcon size={13}/> FIELD PHOTOS</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-8">
          {["All", ...GALLERY_CATEGORIES].map(cat => (
            <button
              key={cat}
              onClick={() => setGalleryFilter(cat)}
              className={`text-xs font-mono px-3 py-1.5 rounded-sm border transition-colors ${
                galleryFilter === cat
                  ? "bg-slate-900 text-amber-400 border-slate-900"
                  : "border-stone-300 text-slate-500 hover:border-amber-400 hover:text-amber-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        {content.gallery.length === 0 ? (
          <p className="text-sm text-slate-400">No photos posted yet — add oil rig, marine, and maintenance job photos from the admin panel.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {content.gallery
              .filter(g => galleryFilter === "All" || g.category === galleryFilter)
              .map((g, i) => (
                <Reveal key={g.id} delay={i * 50}>
                  <div className="group relative aspect-square overflow-hidden rounded-sm border border-stone-200 bg-stone-100">
                    <img
                      src={g.photo}
                      alt={g.caption}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/0 to-slate-950/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                      <div>
                        <span className="text-[10px] font-mono text-amber-400 tracking-wide">{g.category}</span>
                        <p className="text-white text-xs mt-0.5">{g.caption}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
          </div>
        )}
      </section>

      {/* News */}
      <section id="news" className="max-w-6xl mx-auto px-5 py-16 sm:py-20 scroll-mt-20">
        <div className="flex items-baseline justify-between mb-10">
          <h2 className="font-serif text-3xl text-slate-900">Updates</h2>
          <span className="hidden sm:flex items-center gap-1.5 font-mono text-xs text-slate-400"><Newspaper size={13}/> LOG</span>
        </div>
        {content.news.length === 0 ? (
          <p className="text-sm text-slate-400">No updates posted yet.</p>
        ) : (
          <div className="space-y-4">
            {content.news.map(n => (
              <div key={n.id} className="border-b border-stone-200 pb-5 flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-6">
                <div className="font-mono text-xs text-slate-400 w-24 shrink-0">{n.date}</div>
                <div>
                  <span className="inline-block text-[10px] font-mono tracking-wide text-amber-700 bg-amber-50 border border-amber-200 rounded-sm px-1.5 py-0.5 mb-1.5">{n.tag}</span>
                  <h3 className="font-serif text-lg text-slate-900">{n.title}</h3>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">{n.body}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Team */}
      <section id="team" className="bg-stone-100 py-16 sm:py-20 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex items-baseline justify-between mb-10">
            <h2 className="font-serif text-3xl text-slate-900">Our Surveyors</h2>
            <span className="hidden sm:flex items-center gap-1.5 font-mono text-xs text-slate-400"><Users size={13}/> DIRECTORY</span>
          </div>
          {content.team.length === 0 ? (
            <p className="text-sm text-slate-400">No team members posted yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {content.team.map((t, i) => (
                <Reveal key={t.id} delay={i * 60}>
                <div className="bg-white border border-stone-200 rounded-sm p-6 h-full">
                  {t.photo ? (
                    <img src={t.photo} alt={t.name} className="w-14 h-14 rounded-full object-cover mb-4 border border-stone-200" />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center font-serif text-base mb-4">
                      {t.name.split(" ").map(w => w[0]).slice(0,2).join("")}
                    </div>
                  )}
                  <h3 className="font-serif text-lg text-slate-900">{t.name}</h3>
                  <div className="text-xs font-mono text-amber-700 mt-0.5">{t.role}</div>
                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-1"><MapPin size={11}/> {t.region}</div>
                  <p className="text-sm text-slate-500 mt-3 leading-relaxed">{t.bio}</p>
                </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="max-w-6xl mx-auto px-5 py-16 sm:py-20 scroll-mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 items-start">
          <div>
            <h2 className="font-serif text-3xl text-slate-900 mb-4">Request a Survey</h2>
            <p className="text-slate-500 text-sm leading-relaxed max-w-md">
              Reach out with vessel details, location, and timeline. A surveyor from the nearest
              office — North America or the Middle East — will follow up.
            </p>
          </div>
          <form className="space-y-3" onSubmit={handleContactSubmit}>
            <input
              className="w-full border border-stone-300 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500"
              placeholder="Name"
              value={contactForm.name}
              onChange={e => { setContactForm(f => ({ ...f, name: e.target.value })); setContactStatus("idle"); }}
            />
            <input
              type="email"
              className="w-full border border-stone-300 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500"
              placeholder="Email"
              value={contactForm.email}
              onChange={e => { setContactForm(f => ({ ...f, email: e.target.value })); setContactStatus("idle"); }}
            />
            <textarea
              className="w-full border border-stone-300 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 h-28"
              placeholder="Vessel / survey details"
              value={contactForm.details}
              onChange={e => { setContactForm(f => ({ ...f, details: e.target.value })); setContactStatus("idle"); }}
            />
            <button
              disabled={contactStatus === "sending"}
              className="bg-slate-900 text-white text-sm px-5 py-2.5 rounded-sm hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {contactStatus === "sending" ? "Sending…" : "Send Request"}
            </button>
            {contactStatus === "sent" && (
              <p className="text-sm text-emerald-700">Request sent — a surveyor will follow up shortly.</p>
            )}
            {contactStatus === "error" && (
              <p className="text-sm text-red-600">Please fill in your name, email, and survey details.</p>
            )}
          </form>
        </div>
      </section>

      <footer className="bg-slate-950 text-slate-400 py-10">
        <div className="max-w-6xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo light />
          <div className="text-xs font-mono">North America · Middle East · Asia · Europe</div>
        </div>
      </footer>
    </div>
  );
}

function AdminLogin({ onSuccess, onCancel }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) onSuccess();
    else setError("Incorrect password.");
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center z-50 px-5">
      <div className="bg-white rounded-sm p-8 w-full max-w-sm relative">
        <button onClick={onCancel} className="absolute top-4 right-4 text-slate-400 hover:text-slate-900"><X size={18}/></button>
        <div className="flex items-center gap-2 text-amber-600 mb-1"><Lock size={16}/><span className="font-mono text-xs tracking-widest">STAFF ACCESS</span></div>
        <h2 className="font-serif text-xl text-slate-900 mb-5">Admin Login</h2>
        <form onSubmit={submit} className="space-y-3">
          <input
            type="password"
            autoFocus
            value={pw}
            onChange={e => { setPw(e.target.value); setError(""); }}
            placeholder="Password"
            className="w-full border border-stone-300 rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500"
          />
          {error && <div className="text-red-600 text-xs">{error}</div>}
          <button className="w-full bg-slate-900 text-white text-sm py-2.5 rounded-sm hover:bg-slate-800 transition-colors">Enter</button>
        </form>
      </div>
    </div>
  );
}

function AdminDashboard({ content, save, onLogout }) {
  const [tab, setTab] = useState("news");
  const [editingNews, setEditingNews] = useState(null);
  const [editingTeam, setEditingTeam] = useState(null);
  const [editingGallery, setEditingGallery] = useState(null);

  const emptyNews = { id: "", date: new Date().toISOString().slice(0,10), tag: "", title: "", body: "" };
  const emptyTeam = { id: "", name: "", role: "", region: "North America", bio: "", photo: "" };
  const emptyGallery = { id: "", photo: "", caption: "", category: GALLERY_CATEGORIES[0] };

  const saveNews = (item) => {
    const isNew = !content.news.some(n => n.id === item.id);
    const id = item.id || ("n" + Date.now());
    const next = isNew
      ? [{ ...item, id }, ...content.news]
      : content.news.map(n => n.id === item.id ? item : n);
    save({ ...content, news: next });
    setEditingNews(null);
  };
  const deleteNews = (id) => save({ ...content, news: content.news.filter(n => n.id !== id) });

  const saveTeam = (item) => {
    const isNew = !content.team.some(t => t.id === item.id);
    const id = item.id || ("t" + Date.now());
    const next = isNew
      ? [{ ...item, id }, ...content.team]
      : content.team.map(t => t.id === item.id ? item : t);
    save({ ...content, team: next });
    setEditingTeam(null);
  };
  const deleteTeam = (id) => save({ ...content, team: content.team.filter(t => t.id !== id) });

  const saveGallery = (item) => {
    if (!item.photo) { return; }
    const isNew = !content.gallery.some(g => g.id === item.id);
    const id = item.id || ("g" + Date.now());
    const next = isNew
      ? [{ ...item, id }, ...content.gallery]
      : content.gallery.map(g => g.id === item.id ? item : g);
    save({ ...content, gallery: next });
    setEditingGallery(null);
  };
  const deleteGallery = (id) => save({ ...content, gallery: content.gallery.filter(g => g.id !== id) });
  const deleteRequest = (id) => save({ ...content, requests: (content.requests || []).filter(r => r.id !== id) });

  return (
    <div className="min-h-screen bg-stone-100 font-sans">
      <header className="bg-slate-950 text-white">
        <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
          <Logo light />
          <button onClick={onLogout} className="flex items-center gap-1.5 text-xs font-mono text-slate-300 hover:text-amber-400">
            <LogOut size={14}/> LOG OUT
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-5 py-8">
        <h1 className="font-serif text-2xl text-slate-900 mb-1">Admin Panel</h1>
        <p className="text-sm text-slate-500 mb-6">Changes here update the live site for every visitor.</p>

        <div className="flex gap-2 mb-7 border-b border-stone-300">
          {[["news","Updates",Newspaper],["team","Employee Directory",Users],["gallery","Photo Gallery",ImageIcon],["requests","Survey Requests",FileCheck]].map(([key,label,Icon]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${tab===key ? "border-amber-500 text-slate-900" : "border-transparent text-slate-400 hover:text-slate-600"}`}
            >
              <Icon size={14}/> {label}
            </button>
          ))}
        </div>

        {tab === "news" && (
          <div>
            <button
              onClick={() => setEditingNews(emptyNews)}
              className="flex items-center gap-1.5 bg-slate-900 text-white text-sm px-4 py-2 rounded-sm mb-5 hover:bg-slate-800"
            >
              <Plus size={15}/> New Update
            </button>
            <div className="space-y-3">
              {content.news.map(n => (
                <div key={n.id} className="bg-white border border-stone-200 rounded-sm p-4 flex items-start justify-between gap-4">
                  <div>
                    <div className="font-mono text-xs text-slate-400 mb-1">{n.date} · {n.tag}</div>
                    <div className="font-serif text-base text-slate-900">{n.title}</div>
                    <p className="text-sm text-slate-500 mt-1">{n.body}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => setEditingNews(n)} className="text-slate-400 hover:text-amber-600"><Pencil size={16}/></button>
                    <button onClick={() => deleteNews(n.id)} className="text-slate-400 hover:text-red-600"><Trash2 size={16}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "team" && (
          <div>
            <button
              onClick={() => setEditingTeam(emptyTeam)}
              className="flex items-center gap-1.5 bg-slate-900 text-white text-sm px-4 py-2 rounded-sm mb-5 hover:bg-slate-800"
            >
              <Plus size={15}/> Add Employee
            </button>
            <div className="grid sm:grid-cols-2 gap-3">
              {content.team.map(t => (
                <div key={t.id} className="bg-white border border-stone-200 rounded-sm p-4 flex items-start justify-between gap-4">
                  <div className="flex gap-3">
                    {t.photo ? (
                      <img src={t.photo} alt={t.name} className="w-10 h-10 rounded-full object-cover shrink-0 border border-stone-200" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center font-serif text-sm shrink-0">
                        {t.name.split(" ").map(w => w[0]).slice(0,2).join("")}
                      </div>
                    )}
                    <div>
                      <div className="font-serif text-base text-slate-900">{t.name}</div>
                      <div className="text-xs font-mono text-amber-700">{t.role} · {t.region}</div>
                      <p className="text-sm text-slate-500 mt-1">{t.bio}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => setEditingTeam(t)} className="text-slate-400 hover:text-amber-600"><Pencil size={16}/></button>
                    <button onClick={() => deleteTeam(t.id)} className="text-slate-400 hover:text-red-600"><Trash2 size={16}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "gallery" && (
          <div>
            <button
              onClick={() => setEditingGallery(emptyGallery)}
              className="flex items-center gap-1.5 bg-slate-900 text-white text-sm px-4 py-2 rounded-sm mb-5 hover:bg-slate-800"
            >
              <Plus size={15}/> Add Photo
            </button>
            {content.gallery.length === 0 ? (
              <p className="text-sm text-slate-400">No photos yet. Add oil rig, marine, or maintenance job photos.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {content.gallery.map(g => (
                  <div key={g.id} className="bg-white border border-stone-200 rounded-sm overflow-hidden">
                    <img src={g.photo} alt={g.caption} className="w-full aspect-square object-cover" />
                    <div className="p-3">
                      <span className="text-[10px] font-mono text-amber-700">{g.category}</span>
                      <p className="text-sm text-slate-700 mt-0.5 truncate">{g.caption}</p>
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => setEditingGallery(g)} className="text-slate-400 hover:text-amber-600"><Pencil size={15}/></button>
                        <button onClick={() => deleteGallery(g.id)} className="text-slate-400 hover:text-red-600"><Trash2 size={15}/></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "requests" && (
          <div>
            {(content.requests || []).length === 0 ? (
              <p className="text-sm text-slate-400">No survey requests submitted yet.</p>
            ) : (
              <div className="space-y-3">
                {content.requests.map(r => (
                  <div key={r.id} className="bg-white border border-stone-200 rounded-sm p-4 flex items-start justify-between gap-4">
                    <div>
                      <div className="font-mono text-xs text-slate-400 mb-1">{new Date(r.date).toLocaleString()}</div>
                      <div className="font-serif text-base text-slate-900">{r.name}</div>
                      <div className="text-xs text-amber-700">{r.email}</div>
                      <p className="text-sm text-slate-500 mt-1 whitespace-pre-wrap">{r.details}</p>
                    </div>
                    <button onClick={() => deleteRequest(r.id)} className="text-slate-400 hover:text-red-600 shrink-0"><Trash2 size={16}/></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {editingNews && (
        <EditModal
          title={editingNews.id ? "Edit Update" : "New Update"}
          onCancel={() => setEditingNews(null)}
          onSave={saveNews}
          initial={editingNews}
          fields={[
            { key: "date", label: "Date", type: "date" },
            { key: "tag", label: "Tag", type: "text", placeholder: "e.g. Accreditation" },
            { key: "title", label: "Title", type: "text" },
            { key: "body", label: "Body", type: "textarea" },
          ]}
        />
      )}
      {editingTeam && (
        <EditModal
          title={editingTeam.id ? "Edit Employee" : "Add Employee"}
          onCancel={() => setEditingTeam(null)}
          onSave={saveTeam}
          initial={editingTeam}
          fields={[
            { key: "photo", label: "Photo", type: "image" },
            { key: "name", label: "Name", type: "text" },
            { key: "role", label: "Role / Title", type: "text" },
            { key: "region", label: "Region", type: "select", options: ["North America", "Middle East", "Asia", "Europe"] },
            { key: "bio", label: "Short Bio", type: "textarea" },
          ]}
        />
      )}
      {editingGallery && (
        <EditModal
          title={editingGallery.id ? "Edit Photo" : "Add Photo"}
          onCancel={() => setEditingGallery(null)}
          onSave={saveGallery}
          initial={editingGallery}
          fields={[
            { key: "photo", label: "Photo", type: "image", round: false },
            { key: "category", label: "Category", type: "select", options: GALLERY_CATEGORIES },
            { key: "caption", label: "Caption", type: "text", placeholder: "e.g. Hull inspection, Gulf of Mexico" },
          ]}
        />
      )}
    </div>
  );
}

function EditModal({ title, fields, initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial);
  const [imgError, setImgError] = useState("");

  const handlePhotoFile = (key, file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setImgError("Please choose an image file."); return; }
    if (file.size > 1.5 * 1024 * 1024) { setImgError("Image is too large — please use one under 1.5MB."); return; }
    setImgError("");
    const reader = new FileReader();
    reader.onload = () => setForm(f => ({ ...f, [key]: reader.result }));
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center z-50 px-5">
      <div className="bg-white rounded-sm p-7 w-full max-w-md relative max-h-[85vh] overflow-y-auto">
        <button onClick={onCancel} className="absolute top-4 right-4 text-slate-400 hover:text-slate-900"><X size={18}/></button>
        <h2 className="font-serif text-xl text-slate-900 mb-5">{title}</h2>
        <div className="space-y-3">
          {fields.map(f => (
            <div key={f.key}>
              <label className="block text-xs font-mono text-slate-500 mb-1">{f.label}</label>
              {f.type === "image" ? (
                <div className="flex items-center gap-3">
                  {form[f.key] ? (
                    <img src={form[f.key]} alt="" className={`w-14 h-14 object-cover border border-stone-200 ${f.round === false ? "rounded-sm" : "rounded-full"}`} />
                  ) : (
                    <div className={`w-14 h-14 bg-stone-100 border border-stone-200 flex items-center justify-center text-slate-300 ${f.round === false ? "rounded-sm" : "rounded-full"}`}>
                      {f.round === false ? <ImageIcon size={20} /> : <Users size={20} />}
                    </div>
                  )}
                  <div className="flex flex-col gap-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handlePhotoFile(f.key, e.target.files?.[0])}
                      className="text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-sm file:border file:border-stone-300 file:bg-stone-50 file:text-xs file:cursor-pointer"
                    />
                    {form[f.key] && (
                      <button type="button" onClick={() => setForm(fm => ({ ...fm, [f.key]: "" }))} className="text-xs text-red-600 text-left hover:underline">
                        Remove photo
                      </button>
                    )}
                    {imgError && <span className="text-xs text-red-600">{imgError}</span>}
                  </div>
                </div>
              ) : f.type === "textarea" ? (
                <textarea
                  className="w-full border border-stone-300 rounded-sm px-3 py-2 text-sm h-24 focus:outline-none focus:border-amber-500"
                  value={form[f.key]}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                />
              ) : f.type === "select" ? (
                <select
                  className="w-full border border-stone-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
                  value={form[f.key]}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                >
                  {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input
                  type={f.type}
                  placeholder={f.placeholder}
                  className="w-full border border-stone-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
                  value={form[f.key]}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-6">
          <button onClick={() => onSave(form)} className="flex items-center gap-1.5 bg-slate-900 text-white text-sm px-4 py-2 rounded-sm hover:bg-slate-800">
            <Save size={14}/> Save
          </button>
          <button onClick={onCancel} className="text-sm px-4 py-2 text-slate-500 hover:text-slate-800">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const { content, save, loaded, error } = useSiteContent();
  const [view, setView] = useState("site"); // site | login | admin

  if (!loaded) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-amber-400 font-mono text-sm">Loading site…</div>;
  }

  const submitRequest = async (req) => {
    const entry = { ...req, id: "r" + Date.now(), date: new Date().toISOString() };
    await save({ ...content, requests: [entry, ...(content.requests || [])] });
  };

  return (
    <>
      {error && (
        <div className="fixed top-0 inset-x-0 z-[60] bg-red-600 text-white text-xs font-mono text-center py-2 px-4">
          {error}
        </div>
      )}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        html { scroll-behavior: smooth; }
        @keyframes gqDrift { 0% { transform: translateX(0); } 50% { transform: translateX(-18px); } 100% { transform: translateX(0); } }
        .gq-drift { animation: gqDrift 14s ease-in-out infinite; }
        .font-serif { font-family: 'Fraunces', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      {view === "site" && <PublicSite content={content} onStaffClick={() => setView("login")} onSubmitRequest={submitRequest} />}
      {view === "login" && (
        <>
          <PublicSite content={content} onStaffClick={() => {}} onSubmitRequest={submitRequest} />
          <AdminLogin onSuccess={() => setView("admin")} onCancel={() => setView("site")} />
        </>
      )}
      {view === "admin" && <AdminDashboard content={content} save={save} onLogout={() => setView("site")} />}
    </>
  );
}