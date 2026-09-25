import { useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ArrowUpRight, BarChart3, Boxes, Check, CheckCircle2, ChevronRight, CircleDot,
  Clock3, Cpu, Gauge, IndianRupee, LayoutGrid, Leaf, LocateFixed, MapPin, Menu,
  Megaphone, PackageOpen, Plus, Recycle, Scan, ScanLine, Search, Send, ShieldCheck,
  SlidersHorizontal, Sparkles, UploadCloud, Wrench, X, Zap,
} from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

type View = 'Marketplace' | 'AI Scanner' | 'WANTED Board' | 'Deconstruction Kits' | 'Impact Tracker';

const navItems: { label: View; icon: typeof LayoutGrid; detail: string }[] = [
  { label: 'Marketplace', icon: LayoutGrid, detail: 'Find something useful' },
  { label: 'AI Scanner', icon: ScanLine, detail: 'Identify a component' },
  { label: 'WANTED Board', icon: Megaphone, detail: 'Ask the campus' },
  { label: 'Deconstruction Kits', icon: PackageOpen, detail: 'Buy projects, not clutter' },
  { label: 'Impact Tracker', icon: BarChart3, detail: 'See the difference' },
];

const listings = [
  { id: 'esp32', name: 'ESP32-WROOM-32 board', category: 'Microcontrollers', price: 380, branch: 'ECE · North Block', condition: 'Tested · good', accent: 'sage', mark: 'ESP', note: 'Wi-Fi + Bluetooth dev board', seller: 'AK' },
  { id: 'ultrasonic', name: 'Ultrasonic sensor pair', category: 'Sensors', price: 120, branch: 'Robotics Club · Lab 2', condition: 'Barely used', accent: 'clay', mark: 'HC', note: 'HC-SR04, jumper wires included', seller: 'NS' },
  { id: 'robot', name: '2WD line-following robot kit', category: 'Robotics', price: 950, branch: 'Makerspace · Bay 04', condition: 'Built once', accent: 'moss', mark: '2WD', note: 'Chassis, motors, wheels + controller', seller: 'RV' },
  { id: 'drafter', name: 'Drafter set · 12 piece', category: 'Academic tools', price: 440, branch: 'Architecture · Studio 1', condition: 'Like new', accent: 'sand', mark: 'D', note: 'Koh-I-Noor compatible pieces', seller: 'PM' },
  { id: 'driver', name: 'L298N motor driver board', category: 'Motor control', price: 160, branch: 'Mech · Workshop', condition: 'Tested · good', accent: 'rust', mark: 'L29', note: 'Dual H-bridge, heat sink fitted', seller: 'TS' },
  { id: 'calc', name: 'Casio fx-991ES Plus', category: 'Academic tools', price: 620, branch: 'Civil · Block C', condition: 'Well cared for', accent: 'ink', mark: '991', note: 'Fresh battery, exam-ready', seller: 'DM' },
];

const requestsSeed = [
  { id: 'r1', item: 'Working Arduino Uno', urgency: 'This week', deadline: '18 Sep', budget: '₹450 max', initials: 'SK', accent: 'clay' },
  { id: 'r2', item: 'M3 brass standoffs · 20 pcs', urgency: 'Before Friday', deadline: '20 Sep', budget: '₹180 max', initials: 'AM', accent: 'sage' },
  { id: 'r3', item: 'Digital multimeter', urgency: 'Flexible', deadline: '28 Sep', budget: '₹700 max', initials: 'JT', accent: 'ink' },
];

const kits = [
  { id: 'line', title: 'Line-following rover', subtitle: 'A weekend of autonomous motion', price: 1100, saved: 340, accent: 'sage', parts: [['2WD chassis', '₹520'], ['Arduino Uno clone', '₹380'], ['IR sensor array', '₹260']] },
  { id: 'weather', title: 'Pocket weather station', subtitle: 'Measure your micro-climate', price: 780, saved: 220, accent: 'clay', parts: [['ESP32 board', '₹380'], ['DHT11 sensor', '₹150'], ['OLED display', '₹250']] },
  { id: 'arm', title: 'Servo sorting arm', subtitle: 'A tiny lesson in mechanics', price: 1450, saved: 490, accent: 'sand', parts: [['Acrylic arm kit', '₹680'], ['4× SG90 servos', '₹480'], ['PCA9685 driver', '₹290']] },
];

const scans = [
  { name: 'ESP32-WROOM-32', category: 'Microcontroller', voltage: '3.3V logic', pins: '38 pins', price: '₹320 – ₹450', icon: Cpu },
  { name: 'ATmega328P', category: 'Microcontroller', voltage: '5V logic', pins: '28 pins', price: '₹180 – ₹260', icon: Cpu },
  { name: 'HC-SR04', category: 'Distance sensor', voltage: '5V', pins: '4 pins', price: '₹90 – ₹140', icon: Gauge },
  { name: 'L298N', category: 'Motor driver', voltage: '5–35V motor', pins: '15 pins', price: '₹120 – ₹190', icon: Zap },
];

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <RoutedErrorBoundary />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function RoutedErrorBoundary() {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}><Switch><Route path="/" component={Home} /><Route component={Home} /></Switch></ErrorBoundary>;
}

function Home() {
  const [view, setView] = useState<View>('Marketplace');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const chooseView = (next: View) => {
    setView(next);
    setSidebarOpen(false);
  };

  return (
    <div className="grain min-h-[100dvh] bg-[#F5F1E8] text-[#1D3B2A]">
      <Sidebar active={view} onSelect={chooseView} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="min-h-[100dvh] lg:pl-[272px]">
        <div className="flex h-16 items-center justify-between border-b border-[#d9d0be] bg-[#F5F1E8]/90 px-5 backdrop-blur-md lg:hidden">
          <Logo compact />
          <button className="focus-ring press rounded-lg p-2 text-[#1D3B2A]" onClick={() => setSidebarOpen(true)} data-testid="button-open-menu" aria-label="Open navigation">
            <Menu size={23} strokeWidth={1.8} />
          </button>
        </div>
        <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
          <Header view={view} />
          <div key={view} className="animate-rise">
            {view === 'Marketplace' && <Marketplace />}
            {view === 'AI Scanner' && <AIScanner />}
            {view === 'WANTED Board' && <WantedBoard />}
            {view === 'Deconstruction Kits' && <DeconstructionKits />}
            {view === 'Impact Tracker' && <ImpactTracker />}
          </div>
        </div>
      </main>
    </div>
  );
}

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3" data-testid="brand-scrap-to-life">
      <div className="relative grid h-10 w-10 place-items-center rounded-[11px] bg-[#B5651D] text-[#F5F1E8] shadow-[3px_3px_0_#1D3B2A]">
        <Recycle size={22} strokeWidth={1.8} />
        <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-[#F5F1E8] bg-[#B7C895]" />
      </div>
      {!compact && <div><p className="serif text-[22px] font-semibold leading-none tracking-[-.03em]">ScrapToLife</p><p className="mt-1 text-[9px] font-semibold uppercase tracking-[.2em] text-[#607463]">Campus circulation</p></div>}
      {compact && <p className="serif text-[20px] font-semibold tracking-[-.03em]">ScrapToLife</p>}
    </div>
  );
}

function Sidebar({ active, onSelect, open, onClose }: { active: View; onSelect: (v: View) => void; open: boolean; onClose: () => void }) {
  return (
    <>
      {open && <button className="fixed inset-0 z-40 bg-[#102419]/40 lg:hidden" onClick={onClose} aria-label="Close navigation overlay" data-testid="button-close-overlay" />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col bg-[#1D3B2A] px-5 py-7 text-[#F5F1E8] transition-transform duration-300 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-start justify-between">
          <Logo />
          <button onClick={onClose} className="press rounded-md p-1 text-[#b6c5ae] hover:bg-[#365540] lg:hidden" data-testid="button-close-menu" aria-label="Close navigation"><X size={19} /></button>
        </div>
        <div className="mt-14">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-[#9eb39d]">Workshop floor</p>
          <nav className="space-y-1" aria-label="Primary navigation">
            {navItems.map(({ label, icon: Icon, detail }) => {
              const selected = active === label;
              return <button key={label} onClick={() => onSelect(label)} className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all ${selected ? 'bg-[#F5F1E8] text-[#1D3B2A] shadow-[4px_4px_0_#B5651D]' : 'text-[#c0cdbb] hover:bg-[#31513c] hover:text-[#F5F1E8]'}`} data-testid={`nav-${label.toLowerCase().replaceAll(' ', '-')}`}>
                <Icon size={18} strokeWidth={selected ? 2.2 : 1.7} />
                <span className="min-w-0"><span className="block text-[13px] font-semibold">{label}</span><span className={`mt-0.5 block text-[10px] ${selected ? 'text-[#607463]' : 'text-[#91a892]'}`}>{detail}</span></span>
                {selected && <ChevronRight className="ml-auto" size={16} />}
              </button>;
            })}
          </nav>
        </div>
        <div className="mt-auto rounded-2xl border border-[#50705b] bg-[#284b35] p-4">
          <div className="mb-3 flex items-center gap-2 text-[#d0dfbd]"><Leaf size={15} /><span className="text-[10px] font-bold uppercase tracking-[.15em]">Your circular score</span></div>
          <div className="flex items-end justify-between"><p className="serif text-3xl">72</p><p className="mb-1 text-[11px] text-[#b6c8ae]">/ 100 this term</p></div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#173124]"><div className="h-full w-[72%] rounded-full bg-[#B7C895]" /></div>
        </div>
        <div className="mt-4 flex items-center gap-3 border-t border-[#365540] pt-5" data-testid="profile-verified-student">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-[#B7C895] text-xs font-bold text-[#1D3B2A]">RS</div>
          <div className="min-w-0"><p className="truncate text-[12px] font-semibold">Riya Shah</p><p className="mt-0.5 flex items-center gap-1 text-[10px] text-[#b6c8ae]"><ShieldCheck size={11} /> Verified student · ECE</p></div>
          <CircleDot className="ml-auto text-[#B7C895]" size={10} fill="currentColor" />
        </div>
      </aside>
    </>
  );
}

function Header({ view }: { view: View }) {
  const sub: Record<View, string> = {
    Marketplace: 'Good hardware is already here.',
    'AI Scanner': 'Know what you have before you list it.',
    'WANTED Board': 'The fastest way to find the missing piece.',
    'Deconstruction Kits': 'Start with a working project. Keep what you need.',
    'Impact Tracker': 'Every small trade adds up.',
  };
  return <header className="mb-9 flex flex-col justify-between gap-5 md:flex-row md:items-end">
    <div><div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.2em] text-[#B5651D]"><span className="h-px w-6 bg-[#B5651D]" />Student workshop / {view}</div><h1 className="serif text-[clamp(2.15rem,4vw,3.7rem)] font-semibold leading-[.98] tracking-[-.045em] text-[#1D3B2A]">{sub[view]}</h1></div>
    <div className="hidden items-center gap-2 text-right text-[11px] text-[#607463] md:flex"><span className="h-2 w-2 rounded-full bg-[#78945d]" />Campus network live <span className="text-[#c0b49f]">·</span> Pune, India</div>
  </header>;
}

function Marketplace() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All pieces');
  const [showFilters, setShowFilters] = useState(false);
  const categories = ['All pieces', 'Microcontrollers', 'Sensors', 'Robotics', 'Academic tools', 'Motor control'];
  const filtered = useMemo(() => listings.filter((item) => `${item.name} ${item.category} ${item.note}`.toLowerCase().includes(query.toLowerCase()) && (category === 'All pieces' || item.category === category)), [query, category]);
  return <section>
    <div className="mb-7 grid gap-4 rounded-2xl bg-[#DCE5CE] p-5 sm:p-6 md:grid-cols-[1fr_auto] md:items-end">
      <div><p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-[#476148]"><LocateFixed size={14} />Near your campus</p><p className="serif text-2xl font-semibold text-[#1D3B2A]">Parts with a previous life.</p><p className="mt-1 max-w-lg text-sm text-[#526653]">Browse verified bits from workshops, seniors, and clubs before you buy new.</p></div>
      <button onClick={() => setCategory('All pieces')} className="press flex items-center justify-center gap-2 rounded-lg bg-[#1D3B2A] px-4 py-3 text-xs font-bold text-[#F5F1E8] hover:bg-[#31513c]" data-testid="button-browse-nearby">Browse nearby <ArrowUpRight size={15} /></button>
    </div>
    <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="relative max-w-[460px] flex-1"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7c8c78]" size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search boards, tools, sensors..." className="focus-ring h-11 w-full rounded-xl border border-[#d6cdbb] bg-[#fbf8f1] pl-10 pr-4 text-sm outline-none placeholder:text-[#98a093] focus:border-[#B5651D]" data-testid="input-search-listings" /></div>
      <div className="flex gap-2 overflow-x-auto pb-1">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`press whitespace-nowrap rounded-full border px-3.5 py-2 text-[11px] font-semibold ${category === item ? 'border-[#1D3B2A] bg-[#1D3B2A] text-[#F5F1E8]' : 'border-[#d6cdbb] bg-[#F5F1E8] text-[#607463] hover:border-[#B5651D] hover:text-[#1D3B2A]'}`} data-testid={`filter-${item.toLowerCase().replaceAll(' ', '-')}`}>{item}</button>)}</div>
      <button onClick={() => setShowFilters((open) => !open)} className={`press flex w-fit items-center gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-semibold hover:bg-[#e9e1d2] ${showFilters ? 'border-[#1D3B2A] bg-[#e9e1d2] text-[#1D3B2A]' : 'border-[#d6cdbb] text-[#607463]'}`} data-testid="button-filter-listings"><SlidersHorizontal size={15} /> {showFilters ? 'Hide filters' : 'Filters'}</button>
    </div>
    {showFilters && <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-[#d9d0be] bg-[#eee8dc] px-4 py-3 text-xs text-[#607463] animate-rise" data-testid="panel-listing-filters"><span className="font-semibold text-[#1D3B2A]">Quick filter:</span><span>Verified sellers only</span><span className="text-[#b8ad9a]">·</span><span>Under ₹500</span><span className="text-[#b8ad9a]">·</span><span>Available near you</span></div>}
    <div className="mb-5 flex items-center justify-between"><p className="text-xs font-semibold text-[#607463]" data-testid="text-listing-count"><span className="text-[#1D3B2A]">{filtered.length}</span> pieces circulating now</p><p className="hidden text-[11px] text-[#899787] sm:block">Sorted by distance · verified first</p></div>
    {filtered.length === 0 ? <EmptyState title="No parts on this shelf" detail="Try another search or clear the category filter." action="Clear filters" onAction={() => { setQuery(''); setCategory('All pieces'); }} /> : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{filtered.map((item, index) => <ListingCard key={item.id} item={item} index={index} />)}</div>}
  </section>;
}

function ListingCard({ item, index }: { item: typeof listings[number]; index: number }) {
  return <article className="card-lift animate-rise overflow-hidden rounded-2xl border border-[#ddd4c4] bg-[#fbf8f1]" style={{ animationDelay: `${index * 70}ms` }} data-testid={`card-listing-${item.id}`}>
    <div className={`relative flex h-[142px] items-center justify-center overflow-hidden ${item.accent === 'sage' ? 'bg-[#b9cba6]' : item.accent === 'clay' ? 'bg-[#d8a27b]' : item.accent === 'moss' ? 'bg-[#90a883]' : item.accent === 'sand' ? 'bg-[#dcc895]' : item.accent === 'rust' ? 'bg-[#bd8060]' : 'bg-[#829b9a]'}`}>
      <div className="absolute left-4 top-4 rounded-full bg-[#F5F1E8]/75 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[.12em] text-[#1D3B2A]">{item.category}</div>
      <div className="relative rotate-[-4deg] border-2 border-[#1D3B2A]/75 bg-[#f3ead8]/80 px-5 py-4 shadow-[5px_5px_0_rgba(29,59,42,.25)]"><span className="serif text-3xl font-semibold tracking-[-.08em] text-[#1D3B2A]">{item.mark}</span><span className="absolute -bottom-3 -right-3 grid h-7 w-7 place-items-center rounded-full bg-[#B5651D] text-[#F5F1E8]"><Wrench size={13} /></span></div>
      <div className="absolute bottom-3 right-4 flex gap-1 text-[#1D3B2A]/60"><CircleDot size={11} /><CircleDot size={11} /><CircleDot size={11} /></div>
    </div>
    <div className="p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold leading-tight text-[#1D3B2A]" data-testid={`text-listing-name-${item.id}`}>{item.name}</h3><p className="mt-1 text-[11px] text-[#778477]">{item.note}</p></div><p className="shrink-0 text-lg font-bold text-[#B5651D]" data-testid={`text-listing-price-${item.id}`}>₹{item.price}</p></div>
      <div className="mt-4 flex items-center justify-between border-t border-[#e5ddcf] pt-3 text-[10px] text-[#71806f]"><span className="flex items-center gap-1"><MapPin size={12} />{item.branch}</span><span className="flex items-center gap-1 text-[#54704f]"><ShieldCheck size={12} />Verified</span></div>
      <div className="mt-2 flex items-center justify-between"><span className="rounded-full bg-[#e9e4d7] px-2 py-1 text-[10px] font-semibold text-[#6d786a]">{item.condition}</span><span className="flex items-center gap-1 text-[10px] text-[#71806f]"><span className="grid h-5 w-5 place-items-center rounded-full bg-[#d9e3c8] text-[8px] font-bold text-[#36533b]">{item.seller}</span> campus seller</span></div>
    </div>
  </article>;
}

function AIScanner() {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'result' | 'published'>('idle');
  const [result, setResult] = useState(scans[0]);
  const scan = () => {
    setStatus('scanning');
    window.setTimeout(() => { setResult(scans[Math.floor(Math.random() * scans.length)]); setStatus('result'); }, 1350);
  };
  return <section className="grid gap-6 xl:grid-cols-[1.05fr_.95fr]">
    <div className="rounded-2xl border border-[#d7cfbf] bg-[#fbf8f1] p-5 sm:p-7">
      <div className="mb-7 flex items-start justify-between"><div><p className="mb-2 text-[10px] font-bold uppercase tracking-[.18em] text-[#B5651D]">Bench tool 01</p><h2 className="serif text-3xl font-semibold">What is this little thing?</h2><p className="mt-2 max-w-md text-sm leading-relaxed text-[#687568]">Give the scanner a clear look at the markings. We’ll suggest a fair campus price so your old drawer parts can move on.</p></div><div className="hidden rounded-xl bg-[#e5eadb] p-3 text-[#476148] sm:block"><Scan size={22} /></div></div>
      {status === 'scanning' ? <div className="relative flex h-[300px] flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-[#B5651D] bg-[#1D3B2A] text-[#F5F1E8]" data-testid="status-scanning"><div className="scan-line absolute left-[15%] right-[15%] top-1/2 h-0.5 bg-[#d69a64] shadow-[0_0_20px_#B5651D]" /><div className="relative animate-pulse-ring rounded-full border border-[#b7c895]/40 p-6"><ScanLine size={34} className="text-[#B7C895]" /></div><p className="mt-6 text-sm font-semibold">Reading component markings...</p><p className="mt-1 text-[11px] text-[#b5c8b0]">Keep it steady for a moment</p></div> : <button onClick={scan} className="focus-ring group flex h-[300px] w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#b9b19f] bg-[#f4f0e6] transition-colors hover:border-[#B5651D] hover:bg-[#efe7d8]" data-testid="dropzone-scanner"><span className="mb-5 grid h-16 w-16 place-items-center rounded-full bg-[#dce5ce] text-[#476148] transition-transform group-hover:scale-105"><UploadCloud size={28} strokeWidth={1.5} /></span><span className="font-semibold text-[#1D3B2A]">{status === 'published' ? 'Ready for another scan' : 'Drop a photo here'}</span><span className="mt-2 text-xs text-[#849080]">or click to use a sample component</span><span className="mt-5 rounded-full bg-[#1D3B2A] px-4 py-2 text-[11px] font-bold text-[#F5F1E8]">Choose from device</span></button>}
      <div className="mt-5 flex items-center gap-3 text-[11px] text-[#7d897c]"><ShieldCheck size={15} className="text-[#6f8b5e]" /><span>Photos stay on this device in this demo.</span><span className="ml-auto font-semibold text-[#B5651D]">How it works →</span></div>
    </div>
    <div className="rounded-2xl bg-[#1D3B2A] p-5 text-[#F5F1E8] sm:p-7">
      <div className="flex items-center justify-between"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#B7C895]">Scan result</p><span className="rounded-full border border-[#52705b] px-2.5 py-1 text-[10px] text-[#afc0aa]">{status === 'result' || status === 'published' ? 'Match found' : 'Waiting for input'}</span></div>
      {status === 'idle' ? <div className="flex min-h-[370px] flex-col items-center justify-center text-center"><div className="mb-5 grid h-16 w-16 place-items-center rounded-2xl border border-[#4c6956] text-[#779172]"><CircleDot size={28} /></div><h3 className="serif text-2xl">Your answer will land here.</h3><p className="mt-2 max-w-[250px] text-sm leading-relaxed text-[#a7b8a2]">We’ll identify the part, then help you list it with less guesswork.</p></div> : status === 'published' ? <div className="flex min-h-[370px] flex-col items-center justify-center text-center"><div className="mb-5 grid h-16 w-16 place-items-center rounded-full bg-[#B7C895] text-[#1D3B2A]"><Check size={30} /></div><h3 className="serif text-3xl">On the shelf.</h3><p className="mt-2 max-w-[260px] text-sm leading-relaxed text-[#b8c9b0]">Your {result.name} listing is ready for the next builder on campus.</p><button onClick={() => setStatus('idle')} className="press mt-6 rounded-lg border border-[#779172] px-4 py-2.5 text-xs font-bold hover:bg-[#31513c]" data-testid="button-scan-another">Scan another</button></div> : <ScanResult result={result} onPublish={() => setStatus('published')} onTryAgain={scan} />}
    </div>
  </section>;
}

function ScanResult({ result, onPublish, onTryAgain }: { result: typeof scans[number]; onPublish: () => void; onTryAgain: () => void }) {
  const Icon = result.icon;
  return <div className="animate-rise pt-12" data-testid="card-scan-result"><div className="mb-6 flex items-center gap-4"><div className="grid h-14 w-14 place-items-center rounded-xl bg-[#B7C895] text-[#1D3B2A]"><Icon size={28} /></div><div><h3 className="serif text-3xl">{result.name}</h3><p className="mt-1 text-xs text-[#b7c9b1]">{result.category} · likely match 94%</p></div></div><div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[#41614c] bg-[#41614c]"><InfoCell icon={<Zap size={14} />} label="Operating" value={result.voltage} /><InfoCell icon={<CircleDot size={14} />} label="Pin count" value={result.pins} /><InfoCell icon={<IndianRupee size={14} />} label="Suggested" value={result.price} /><InfoCell icon={<ShieldCheck size={14} />} label="Confidence" value="High" /></div><button onClick={onPublish} className="press mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#B5651D] py-3.5 text-xs font-bold text-[#F5F1E8] hover:bg-[#c97832]" data-testid="button-confirm-publish">Confirm & Publish <Send size={15} /></button><button onClick={onTryAgain} className="mt-3 w-full py-2 text-[11px] text-[#a7baa2] hover:text-[#F5F1E8]" data-testid="button-correct-scan">That’s not right? Try again</button></div>;
}

function InfoCell({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="bg-[#254632] p-3"><div className="flex items-center gap-1.5 text-[10px] text-[#9bb09a]">{icon}{label}</div><p className="mt-1 text-sm font-semibold text-[#F5F1E8]">{value}</p></div>;
}

function WantedBoard() {
  const [requests, setRequests] = useState(requestsSeed);
  const [posting, setPosting] = useState(false);
  const [posted, setPosted] = useState(false);
  const [helped, setHelped] = useState<string | null>(null);
  const addRequest = () => { setPosting(true); window.setTimeout(() => { setRequests((prev) => [{ id: `r${Date.now()}`, item: 'Any spare soldering iron', urgency: 'New request', deadline: 'Open', budget: '₹500 max', initials: 'RS', accent: 'clay' }, ...prev]); setPosting(false); setPosted(true); }, 500); };
  return <section>
    <div className="mb-7 flex flex-col justify-between gap-5 rounded-2xl bg-[#B5651D] p-5 text-[#F5F1E8] sm:p-7 md:flex-row md:items-center"><div><p className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.18em] text-[#f2c49d]"><Megaphone size={14} /> Open calls from campus</p><h2 className="serif text-3xl font-semibold">Someone has the part you need.</h2><p className="mt-2 max-w-lg text-sm text-[#f3d5bb]">Post a clear ask. Your campus is a surprisingly well-stocked workshop.</p></div><button onClick={addRequest} disabled={posting} className="press flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#F5F1E8] px-4 py-3 text-xs font-bold text-[#1D3B2A] hover:bg-[#fffaf0] disabled:opacity-60" data-testid="button-post-request">{posting ? 'Posting...' : <><Plus size={15} /> Post a request</>}</button></div>
    {posted && <div className="mb-5 flex items-center gap-2 rounded-xl border border-[#aec495] bg-[#e0ead4] px-4 py-3 text-xs font-semibold text-[#36533b] animate-rise" data-testid="status-request-posted"><CheckCircle2 size={16} /> Your request is live on the board.</div>}
    {helped && <div className="mb-5 flex items-center gap-2 rounded-xl border border-[#e1b48d] bg-[#f3dfcd] px-4 py-3 text-xs font-semibold text-[#75451f] animate-rise" data-testid="status-help-sent"><Send size={15} /> Message queued for {helped}. They’ll see your offer on the board.</div>}
    <div className="mb-5 flex items-center justify-between"><div><p className="serif text-2xl font-semibold">The board</p><p className="mt-1 text-xs text-[#748274]">Fresh asks from builders, designers, and tinkerers.</p></div><span className="rounded-full bg-[#e3ead8] px-3 py-1.5 text-[10px] font-bold text-[#476148]">{requests.length} open calls</span></div>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{requests.map((request, index) => <RequestCard key={request.id} request={request} index={index} onHelp={() => setHelped(request.initials)} />)}</div>
  </section>;
}

function RequestCard({ request, index, onHelp }: { request: typeof requestsSeed[number]; index: number; onHelp: () => void }) {
  return <article className="card-lift animate-rise rounded-2xl border border-[#ddd4c4] bg-[#fbf8f1] p-5" style={{ animationDelay: `${index * 70}ms` }} data-testid={`card-request-${request.id}`}><div className="flex items-start justify-between"><div className={`grid h-10 w-10 place-items-center rounded-xl text-xs font-bold ${request.accent === 'clay' ? 'bg-[#e5b18a] text-[#713b1e]' : request.accent === 'sage' ? 'bg-[#c5d5b5] text-[#36533b]' : 'bg-[#bdcecc] text-[#365153]'}`}>{request.initials}</div><span className="flex items-center gap-1.5 rounded-full bg-[#f0e7d8] px-2.5 py-1 text-[10px] font-semibold text-[#8b653e]"><Clock3 size={12} />{request.urgency}</span></div><h3 className="mt-6 text-base font-semibold text-[#1D3B2A]">{request.item}</h3><div className="mt-5 space-y-2 border-t border-[#e5ddcf] pt-3 text-[11px] text-[#788578]"><div className="flex justify-between"><span>Needed by</span><span className="font-semibold text-[#536453]">{request.deadline}</span></div><div className="flex justify-between"><span>Budget</span><span className="font-semibold text-[#B5651D]">{request.budget}</span></div></div><button onClick={onHelp} className="press mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-[#cfc5b2] py-2.5 text-xs font-bold text-[#36533b] hover:border-[#B5651D] hover:bg-[#f0e7d8]" data-testid={`button-message-${request.id}`}>I can help <ArrowUpRight size={14} /></button></article>;
}

function DeconstructionKits() {
  return <section><div className="mb-7 grid gap-4 md:grid-cols-[1.3fr_.7fr]"><div className="rounded-2xl bg-[#DCE5CE] p-6 sm:p-7"><div className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.18em] text-[#476148]"><Boxes size={14} /> The smarter start</div><h2 className="serif max-w-xl text-3xl font-semibold leading-tight text-[#1D3B2A]">Take apart a project.<br />Keep the useful bits.</h2><p className="mt-3 max-w-lg text-sm leading-relaxed text-[#5e705d]">Deconstruction kits are tested student projects sold as a whole. Build it, learn from it, or reuse the parts in something new.</p></div><div className="rounded-2xl bg-[#1D3B2A] p-6 text-[#F5F1E8]"><Recycle className="mb-5 text-[#B7C895]" size={23} /><p className="serif text-2xl">One kit, many next projects.</p><p className="mt-2 text-xs leading-relaxed text-[#b8c9b0]">Every kit includes a part-by-part breakdown so you can see what you’re really buying.</p></div></div><div className="grid gap-4 lg:grid-cols-3">{kits.map((kit, index) => <KitCard key={kit.id} kit={kit} index={index} />)}</div></section>;
}

function KitCard({ kit, index }: { kit: typeof kits[number]; index: number }) {
  return <article className="card-lift animate-rise overflow-hidden rounded-2xl border border-[#ddd4c4] bg-[#fbf8f1]" style={{ animationDelay: `${index * 80}ms` }} data-testid={`card-kit-${kit.id}`}><div className={`relative h-32 ${kit.accent === 'sage' ? 'bg-[#abc29b]' : kit.accent === 'clay' ? 'bg-[#d89b73]' : 'bg-[#dbc28d]'}`}><div className="absolute left-5 top-5 grid h-16 w-20 rotate-[-5deg] place-items-center rounded-lg border-2 border-[#1D3B2A]/60 bg-[#f4ecd9]/80 shadow-[5px_5px_0_rgba(29,59,42,.2)]"><Wrench className="text-[#1D3B2A]" size={28} /></div><div className="absolute bottom-4 right-5 rounded-full bg-[#F5F1E8]/70 px-2.5 py-1 text-[10px] font-bold text-[#476148]">Full project</div></div><div className="p-5"><h3 className="serif text-2xl font-semibold">{kit.title}</h3><p className="mt-1 text-xs text-[#748274]">{kit.subtitle}</p><div className="mt-5 flex items-end justify-between"><div><p className="text-[10px] uppercase tracking-[.13em] text-[#879286]">Kit price</p><p className="mt-1 text-xl font-bold text-[#B5651D]">₹{kit.price}</p></div><span className="text-right text-[10px] font-semibold text-[#65815c]">₹{kit.saved} saved<br /><span className="font-normal text-[#879286]">vs buying new</span></span></div><div className="my-4 h-px bg-[#e5ddcf]" /><p className="mb-2 text-[10px] font-bold uppercase tracking-[.13em] text-[#879286]">Inside the kit</p><div className="space-y-2">{kit.parts.map(([part, cost]) => <div key={part} className="flex justify-between text-xs"><span className="text-[#596958]">{part}</span><span className="font-semibold text-[#1D3B2A]">{cost}</span></div>)}</div><button className="press mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#1D3B2A] py-3 text-xs font-bold text-[#F5F1E8] hover:bg-[#31513c]" data-testid={`button-view-kit-${kit.id}`}>View kit details <ChevronRight size={15} /></button></div></article>;
}

function ImpactTracker() {
  const stats = [{ label: 'Rupees recirculated', value: '₹48,760', change: '+12.4%', icon: IndianRupee, color: 'clay', note: 'kept in student pockets' }, { label: 'E-waste diverted', value: '31.8 kg', change: '+8.2 kg', icon: Recycle, color: 'sage', note: 'from the landfill this term' }, { label: 'Verified trades', value: '214', change: '+37', icon: ShieldCheck, color: 'ink', note: 'made across campus' }];
  return <section><div className="mb-7 overflow-hidden rounded-2xl bg-[#1D3B2A] p-6 text-[#F5F1E8] sm:p-8"><div className="relative z-10 max-w-2xl"><div className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.18em] text-[#B7C895]"><Leaf size={14} /> A living ledger</div><h2 className="serif text-4xl font-semibold leading-[1.03] sm:text-5xl">The campus workshop<br /><span className="text-[#B7C895]">is already moving.</span></h2><p className="mt-4 max-w-md text-sm leading-relaxed text-[#b8c9b0]">Impact here isn’t a pledge on a poster. It’s a sensor finding a second project, a calculator changing hands, a kit kept in use.</p></div><div className="pointer-events-none relative -mb-12 mt-[-70px] ml-auto hidden h-48 w-56 opacity-80 md:block"><div className="absolute right-10 top-8 h-28 w-28 rounded-full border border-[#78945d]/60" /><div className="absolute right-4 top-2 h-44 w-44 rounded-full border border-[#78945d]/30" /><div className="absolute right-[84px] top-[52px] h-10 w-10 rounded-full bg-[#B5651D]" /><div className="absolute bottom-4 left-7 h-12 w-36 rotate-[-12deg] border-b-2 border-[#B7C895]" /></div></div><div className="mb-8 grid gap-4 md:grid-cols-3">{stats.map((stat, index) => <StatCard key={stat.label} stat={stat} index={index} />)}</div><div className="grid gap-5 md:grid-cols-[1fr_.8fr]"><div className="rounded-2xl border border-[#ddd4c4] bg-[#fbf8f1] p-5 sm:p-6"><div className="flex items-center justify-between"><div><p className="serif text-xl font-semibold">Trade rhythm</p><p className="mt-1 text-xs text-[#7a8879]">Verified exchanges over the last 6 months</p></div><span className="rounded-full bg-[#e2ead7] px-2.5 py-1 text-[10px] font-bold text-[#4c684c]">+18% vs last term</span></div><div className="mt-8 flex h-36 items-end gap-2 sm:gap-4">{[42, 58, 48, 67, 74, 92].map((height, index) => <div key={height} className="flex flex-1 flex-col items-center gap-2"><div className={`w-full max-w-12 rounded-t-md ${index === 5 ? 'bg-[#B5651D]' : 'bg-[#b9cba6]'}`} style={{ height: `${height}%` }} /><span className="text-[9px] font-semibold text-[#879286]">{['APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP'][index]}</span></div>)}</div></div><div className="rounded-2xl bg-[#DCE5CE] p-5 sm:p-6"><p className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.15em] text-[#476148]"><Sparkles size={14} /> Your contribution</p><div className="flex items-baseline gap-2"><span className="serif text-5xl font-semibold text-[#1D3B2A]">8</span><span className="text-sm text-[#5f735d]">trades this term</span></div><p className="mt-3 text-sm leading-relaxed text-[#5f735d]">You’re in the top 18% of campus circulators. Two more trades gets you to Builder tier.</p><div className="mt-6 h-2 overflow-hidden rounded-full bg-[#b3c5a3]"><div className="h-full w-[68%] rounded-full bg-[#B5651D]" /></div><div className="mt-2 flex justify-between text-[10px] font-semibold text-[#607463]"><span>8 trades</span><span>12 to Builder</span></div></div></div></section>;
}

function StatCard({ stat, index }: { stat: { label: string; value: string; change: string; icon: typeof IndianRupee; color: string; note: string }; index: number }) {
  const Icon = stat.icon;
  return <article className="card-lift animate-rise rounded-2xl border border-[#ddd4c4] bg-[#fbf8f1] p-5" style={{ animationDelay: `${index * 70}ms` }} data-testid={`stat-${stat.label.toLowerCase().replaceAll(' ', '-')}`}><div className="flex items-start justify-between"><div className={`grid h-10 w-10 place-items-center rounded-xl ${stat.color === 'clay' ? 'bg-[#e8bb98] text-[#8b451e]' : stat.color === 'sage' ? 'bg-[#c9d8b9] text-[#4d6c4b]' : 'bg-[#c1d2d0] text-[#496262]'}`}><Icon size={19} /></div><span className="rounded-full bg-[#e4ecd9] px-2 py-1 text-[10px] font-bold text-[#54734d]">{stat.change}</span></div><p className="mt-6 text-[11px] font-semibold uppercase tracking-[.12em] text-[#7b8879]">{stat.label}</p><p className="serif mt-1 text-3xl font-semibold text-[#1D3B2A]">{stat.value}</p><p className="mt-1 text-xs text-[#849080]">{stat.note}</p></article>;
}

function EmptyState({ title, detail, action, onAction }: { title: string; detail: string; action: string; onAction: () => void }) {
  return <div className="rounded-2xl border border-dashed border-[#cfc5b2] bg-[#fbf8f1] py-16 text-center" data-testid="empty-state"><div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-[#e5eadb] text-[#607463]"><Search size={20} /></div><h3 className="serif text-2xl font-semibold">{title}</h3><p className="mx-auto mt-2 max-w-sm text-sm text-[#7a8879]">{detail}</p><button onClick={onAction} className="press mt-5 rounded-lg bg-[#1D3B2A] px-4 py-2.5 text-xs font-bold text-[#F5F1E8]" data-testid="button-clear-filters">{action}</button></div>;
}

export default App;