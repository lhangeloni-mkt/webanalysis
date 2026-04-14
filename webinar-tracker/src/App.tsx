import React, { useState, useEffect, useMemo, useRef } from 'react';
import { nanoid } from 'nanoid';
import {
  Plus,
  Download,
  Upload,
  Trash2,
  Database,
  Search,
  ChevronDown,
  CheckCircle2,
  FileText,
  Sun,
  Moon,
  AlertCircle,
  Lock,
  Pencil,
  LayoutDashboard,
  Settings,
  BarChart3,
  Menu,
  X,
  FileInput,
  TrendingUp,
  Calendar,
  Users,
  AlertTriangle,
  Activity,
  Eye,
  Save,
  Check
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
// @ts-ignore
import { Bar, Pie } from 'react-chartjs-2';
import type { Entry, Settings, SecuritySettings, SecurityRecord } from './types';
import { createClient } from './utils/supabase/client';
import './styles.css';

const supabase = createClient();

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const INITIAL_SETTINGS: Settings = {
  specialists: ['John Doe', 'Jane Smith'],
  creators: [
    'monetincelle', '9monkeys', 'a.zhuravel_on_hands', 'adamrichesart', 'agatadelbarco',
    'akangshaspalette', 'alemanicia', 'alleyc.eng.speaking.life', 'angiebryantart', 'anniwoodeco',
    'arabo_semplicemente', 'Artistjodysteel', 'artofalan', 'basque.in.english', 'benxartist',
    'bkartchitect01', 'buboosenchan', 'c.austinart', 'caleb_arredondo_', 'carliannecreates',
    'carov_art', 'chelzd_art', 'cindylaneart', 'colouring_the_rainbow', 'coreanoconfloriana',
    'danieltaylorart', 'danmumforddraws', 'deuza_art', 'eddie.tb', 'elvira.engleskijezik',
    'englischmitemily', 'englishwithmartina', 'erick.centeno', 'estonianwithgrete', 'ethernautics',
    'Excel met Jochem', 'Excel with Alvaro', 'Excel with Carita', 'florian_mas_art', 'foodillustration.studio',
    'Francese con Laura', 'Französisch mit Mélanie', 'godtaughtartist', 'greekmama.says', 'haitiancreolewithjean',
    'inmybackyardnz', 'iristinunin', 'italianoconlaura', 'italianoconsimone', 'italienisch_mit_clara',
    'japanischmitceline', 'jennummi', 'jesscurrierstudio', 'jmac_mua', 'josetrujilloart',
    'kailaleeannart_', 'kandaem', 'katfishdraws', 'konbiniart', 'krauserdhm', 'kristythepainter',
    'larapickle', 'limba.turca.cu.iulia', 'lisa_lebofsky', 'Lithuanian with Marta', 'magyarize_com',
    'mahoney_artworks', 'malaywithainur.am', 'manicmoth', 'marilu.draws', 'mi_amiga_italiana',
    'mielzy.png', 'miketoneydesign', 'miss_atoyan', 'mrmattzan', 'nbs_artnwood', 'nokunnskap',
    'norvegia_nel_cuore', 'Norwegisch mit Ådne', 'olga.koelsch', 'Orensje', 'pangurban_',
    'paulcombs_artist', 'pencyleando', 'Pergliamicibarto', 'persianwithelaheh', 'playattentionnow',
    'queenjagart', 'Rabbit_rivulet', 'racketballs', 'rainlandstudios', 'rocheboisdaniel',
    'rodgontheartist', 'rpancoast_art', 'sicilian_with_ilaria', 'spanskmedfrancisca', 'speakviking',
    'studyinbgschool', 'Swiss German with Sevi', 'sydneynicoleaddams', 'sylviecorreia_prof', 'tammykayeart',
    'Tani Pinta', 'themightierpencil', 'thesneakyartist', 'thespicydonut', 'thetyleredlin',
    'trytryagain_', 'turkishteachersema', 'ukrainianwithmykola', 'valeriesyposz', 'whateverjesss',
    'whoisjillea', 'xhosalessons', 'yeoni_korean', 'zeidsalfitiart'
  ],
  mistakes: ['Mic Issue', 'Late Start', 'Slide Deck Error', 'Audio Delay'],
  planets: ['Jupiter', 'Saturn', 'Innovation/LP', 'Mars', 'Uranus']
};

const INITIAL_SECURITY: SecuritySettings = {
  passwords: {
    analysis: '123',
    settings: '321'
  },
  history: []
};

// ==================== TOAST NOTIFICATIONS ====================
type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

function ToastContainer({ toasts, removeToast }: { toasts: Toast[], removeToast: (id: string) => void }) {
  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast ${toast.type}`} onClick={() => removeToast(toast.id)}>
          {toast.type === 'success' && <CheckCircle2 size={20} color="var(--success)" />}
          {toast.type === 'error' && <AlertCircle size={20} color="var(--danger)" />}
          {toast.type === 'warning' && <AlertTriangle size={20} color="var(--warning)" />}
          {toast.type === 'info' && <Activity size={20} color="var(--info)" />}
          <span className="toast-message">{toast.message}</span>
        </div>
      ))}
    </div>
  );
}

// ==================== MODALS ====================
function EditRecordModal({
  entry,
  settings,
  onSave,
  onCancel
}: {
  entry: Entry;
  settings: Settings;
  onSave: (entry: Entry) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({ ...entry });
  const [mistake1, setMistake1] = useState(entry.mistakes[0] || '');
  const [mistake2, setMistake2] = useState(entry.mistakes[1] || '');
  const [mistake3, setMistake3] = useState(entry.mistakes[2] || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      mistakes: [mistake1, mistake2, mistake3].filter(m => m !== '')
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '600px', textAlign: 'left' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Edit Recording</h2>
        <form onSubmit={handleSave}>
          <div className="grid-2">
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Planet</label>
              <select
                value={formData.planet}
                onChange={e => setFormData({ ...formData, planet: e.target.value })}
                required
              >
                {settings.planets.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <SearchableSelect
            label="Specialist"
            options={settings.specialists}
            value={formData.specialist}
            onChange={val => setFormData({ ...formData, specialist: val })}
            required
          />

          <SearchableSelect
            label="Creator"
            options={settings.creators}
            value={formData.creator}
            onChange={val => setFormData({ ...formData, creator: val })}
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Err 1</label>
              <select value={mistake1} onChange={e => setMistake1(e.target.value)} required>
                <option value="">Select</option>
                {settings.mistakes.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Err 2</label>
              <select value={mistake2} onChange={e => setMistake2(e.target.value)}>
                <option value="">None</option>
                {settings.mistakes.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Err 3</label>
              <select value={mistake3} onChange={e => setMistake3(e.target.value)}>
                <option value="">None</option>
                {settings.mistakes.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" style={{ flex: 1 }}><Save size={18} /> Save Changes</button>
            <button type="button" className="secondary" onClick={onCancel} style={{ flex: 1 }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteConfirmationModal({
  onConfirm,
  onCancel
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ padding: '2.5rem' }}>
        <div className="modal-icon danger">
          <AlertCircle size={32} />
        </div>
        <h2 style={{ marginBottom: '1rem' }}>Delete</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Are you sure you want to proceed with this deletion? This action cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="confirm-delete-btn" onClick={onConfirm} style={{ padding: '1rem 2.5rem' }}>
            <Check size={18} /> YES
          </button>
          <button className="cancel-delete-btn" onClick={onCancel} style={{ padding: '1rem 2.5rem' }}>
            <X size={18} /> NO
          </button>
        </div>
      </div>
    </div>
  );
}

function SuccessModal({
  onAddAnother,
  onGoToAnalysis
}: {
  onAddAnother: () => void;
  onGoToAnalysis: () => void;
}) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-icon success">
          <CheckCircle2 size={32} />
        </div>
        <h2>Data Recorded</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
          The recording has been successfully pushed to the registry.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button onClick={onAddAnother} style={{ width: '100%' }}>
            <Plus size={18} /> Add Another Entry
          </button>
          <button className="secondary" onClick={onGoToAnalysis} style={{ width: '100%' }}>
            <Eye size={18} /> View Analysis
          </button>
        </div>
      </div>
    </div>
  );
}

function SearchableSelect({
  label,
  options,
  value,
  onChange,
  placeholder = "Search...",
  required = false
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(opt =>
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="form-group" ref={wrapperRef} style={{ position: 'relative' }}>
      <label>{label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}</label>
      <div
        className="searchable-select-trigger"
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem 1rem' }}
      >
        <span style={{ fontSize: '1rem' }}>{value || 'Select an option'}</span>
        <ChevronDown size={18} style={{ opacity: 0.5 }} />
      </div>

      {isOpen && (
        <div
          className="glass-panel"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 100,
            marginTop: '0.5rem',
            padding: '1rem',
            maxHeight: '300px',
            overflowY: 'auto',
            background: 'var(--bg-color)',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
            <input
              autoFocus
              style={{ 
                padding: '0.75rem 0.75rem 0.75rem 2.75rem', 
                marginBottom: 0,
                width: '100%'
              }}
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map(opt => (
                <div
                  key={opt}
                  onClick={() => {
                    onChange(opt);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  style={{
                    padding: '0.875rem',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    background: value === opt ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                    fontWeight: value === opt ? '600' : '400'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(128, 128, 128, 0.05)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = value === opt ? 'rgba(59, 130, 246, 0.1)' : 'transparent')}
                >
                  {opt}
                </div>
              ))
            ) : (
              <div style={{ padding: '1rem', opacity: 0.5, textAlign: 'center' }}>No results found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function PasswordGateway({ 
  target, 
  correctPassword, 
  onUnlock 
}: { 
  target: string, 
  correctPassword: string, 
  onUnlock: () => void 
}) {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === correctPassword) {
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="password-gateway-container">
      <div className="glass-panel password-card">
        <div className="password-icon">
          <Lock size={32} />
        </div>
        <h2 style={{ marginBottom: '1rem' }}>Locked Section</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
          Please enter the password to access <strong>{target}</strong> information.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <input 
              type="password" 
              placeholder="Enter password..." 
              value={input}
              onChange={e => setInput(e.target.value)}
              autoFocus
              style={{ textAlign: 'center', borderColor: error ? 'var(--danger)' : undefined }}
            />
          </div>
          {error && <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Incorrect password. Please try again.</p>}
          <button type="submit" style={{ width: '100%' }}><Lock size={18} /> Unlock Access</button>
        </form>
      </div>
    </div>
  );
}

// ==================== HELPER FUNCTIONS ====================
const getMonthYear = (dateStr: string) => {
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

// ==================== SETTINGS SECTION COMPONENT ====================
const SettingsSection = ({ 
  title, 
  items, 
  keyName, 
  value, 
  onChange, 
  onAdd, 
  onDelete,
  onEdit
}: { 
  title: string, 
  items: string[], 
  keyName: keyof Settings, 
  value: string, 
  onChange: (val: string) => void, 
  onAdd: () => void, 
  onDelete: (val: string) => void,
  onEdit: (oldVal: string) => void
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredItems = items.filter(item => 
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="glass-panel card" style={{ marginBottom: '1rem' }}>
      <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>{title}</h3>
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
        <input 
          placeholder={`Add ${title.toLowerCase()}...`}
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ padding: '0.75rem', fontSize: '1rem' }}
        />
        <button onClick={onAdd} style={{ padding: '0.75rem 1rem' }}><Plus size={18} /></button>
      </div>
      <div style={{ position: 'relative', marginBottom: '1rem' }}>
        <Search 
          size={16} 
          style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} 
        />
        <input
          type="text"
          placeholder={`Search ${title.toLowerCase()}...`}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ padding: '0.75rem 0.75rem 0.75rem 2.75rem', fontSize: '1rem', width: '100%' }}
        />
      </div>
      <div className="scroll-list">
        {filteredItems.map(item => (
          <div key={item} className="list-item">
            <span style={{ fontSize: '0.95rem' }}>{item}</span>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button className="icon-only secondary" onClick={() => onEdit(item)} title="Edit">
                <Pencil size={14} />
              </button>
              <button className="icon-only" onClick={() => onDelete(item)} title="Delete" style={{ background: 'var(--danger-light)', color: 'var(--danger)' }}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {filteredItems.length === 0 && (
          <div style={{ padding: '1rem', opacity: 0.3, textAlign: 'center' }}>
            {items.length === 0 ? 'No items added' : 'No results found'}
          </div>
        )}
      </div>
    </div>
  );
};

// ==================== DASHBOARD COMPONENT ====================
function DashboardPage({ entries, settings, onNavigate }: { entries: Entry[], settings: Settings, onNavigate: (page: string) => void }) {
  const stats = useMemo(() => {
    const totalWebinars = entries.length;
    const totalMistakes = entries.reduce((acc, e) => acc + e.mistakes.length, 0);
    const uniqueCreators = new Set(entries.map(e => e.creator)).size;
    const uniquePlanets = new Set(entries.map(e => e.planet)).size;
    
    const mistakeCounts: Record<string, number> = {};
    entries.forEach(e => {
      e.mistakes.forEach(m => {
        mistakeCounts[m] = (mistakeCounts[m] || 0) + 1;
      });
    });
    
    const topMistake = Object.entries(mistakeCounts).sort((a, b) => b[1] - a[1])[0];
    
    const recentEntries = entries.slice(0, 5);
    
    return { totalWebinars, totalMistakes, uniqueCreators, uniquePlanets, topMistake, recentEntries };
  }, [entries]);

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's an overview of your webinar data.</p>
      </div>

      <div className="stats-grid">
        <div className="glass-panel stat-card">
          <div className="stat-icon primary">
            <FileText size={24} />
          </div>
          <div className="stat-info">
            <h3>{stats.totalWebinars}</h3>
            <p>Total Webinars</p>
          </div>
        </div>
        
        <div className="glass-panel stat-card">
          <div className="stat-icon danger">
            <AlertTriangle size={24} />
          </div>
          <div className="stat-info">
            <h3>{stats.totalMistakes}</h3>
            <p>Total Mistakes</p>
          </div>
        </div>
        
        <div className="glass-panel stat-card">
          <div className="stat-icon success">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <h3>{stats.uniqueCreators}</h3>
            <p>Active Creators</p>
          </div>
        </div>
        
        <div className="glass-panel stat-card">
          <div className="stat-icon warning">
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <h3>{stats.uniquePlanets}</h3>
            <p>Planets</p>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="glass-panel card">
          <h3>Recent Activity</h3>
          <div className="activity-feed">
            {stats.recentEntries.length > 0 ? (
              stats.recentEntries.map(entry => (
                <div key={entry.id} className="activity-item">
                  <div className="activity-dot"></div>
                  <div className="activity-content">
                    <p>
                      <strong>{entry.specialist}</strong> recorded on <strong>{entry.planet}</strong>
                    </p>
                    <span className="activity-time">{formatDate(entry.date)}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <FileText size={48} />
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </div>

        <div className="glass-panel card">
          <h3>Quick Actions</h3>
          <div className="quick-actions">
            <div className="quick-action-btn" onClick={() => onNavigate('input')}>
              <FileInput size={32} />
              <span>New Entry</span>
            </div>
            <div className="quick-action-btn" onClick={() => onNavigate('analysis')}>
              <BarChart3 size={32} />
              <span>View Analysis</span>
            </div>
            <div className="quick-action-btn" onClick={() => onNavigate('settings')}>
              <Settings size={32} />
              <span>Settings</span>
            </div>
          </div>
          
          {stats.topMistake && (
            <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Most Common Mistake</p>
              <p style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--danger)' }}>
                {stats.topMistake[0]} <span style={{ fontSize: '0.95rem', fontWeight: '500', color: 'var(--text-muted)' }}>({stats.topMistake[1]} times)</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==================== INPUT PAGE ====================
function DataInputPage({ settings, onSave }: { settings: Settings, onSave: (entry: Omit<Entry, 'id'>) => void }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    planet: '',
    specialist: '',
    creator: '',
    mistake1: '',
    mistake2: '',
    mistake3: ''
  });

  const isFormValid = formData.date && formData.planet && formData.specialist && formData.creator && formData.mistake1;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    onSave({
      date: formData.date,
      planet: formData.planet,
      specialist: formData.specialist,
      creator: formData.creator,
      mistakes: [formData.mistake1, formData.mistake2, formData.mistake3].filter(m => m !== '')
    });
    setFormData({
      date: new Date().toISOString().split('T')[0],
      planet: '',
      specialist: '',
      creator: '',
      mistake1: '',
      mistake2: '',
      mistake3: ''
    });
  };

  return (
    <div className="container-narrow">
      <div className="page-header">
        <h1>Entry Log</h1>
        <p>Record a new webinar session</p>
      </div>
      
      <div className="glass-panel card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Date <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Planet <span style={{ color: 'var(--danger)' }}>*</span></label>
            <select
              required
              value={formData.planet}
              onChange={e => setFormData({ ...formData, planet: e.target.value })}
            >
              <option value="">Select Planet</option>
              {settings.planets.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <SearchableSelect
            required
            label="Webinar Specialist"
            options={settings.specialists}
            value={formData.specialist}
            onChange={val => setFormData({ ...formData, specialist: val })}
            placeholder="Search specialist..."
          />

          <SearchableSelect
            required
            label="Creator"
            options={settings.creators}
            value={formData.creator}
            onChange={val => setFormData({ ...formData, creator: val })}
            placeholder="Search creator..."
          />

          <div className="form-group">
            <label>Mistake 1 <span style={{ color: 'var(--danger)' }}>*</span></label>
            <select
              required
              value={formData.mistake1}
              onChange={e => setFormData({ ...formData, mistake1: e.target.value })}
            >
              <option value="">Select Error</option>
              {settings.mistakes.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Mistake 2 (Optional)</label>
            <select
              value={formData.mistake2}
              onChange={e => setFormData({ ...formData, mistake2: e.target.value })}
            >
              <option value="">None</option>
              {settings.mistakes.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Mistake 3 (Optional)</label>
            <select
              value={formData.mistake3}
              onChange={e => setFormData({ ...formData, mistake3: e.target.value })}
            >
              <option value="">None</option>
              {settings.mistakes.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <button type="submit" style={{ width: '100%' }} disabled={!isFormValid}>
            <Save size={18} /> Submit Entry
          </button>
        </form>
      </div>
    </div>
  );
}

// ==================== ANALYSIS PAGE ====================
function DataAnalysisPage({ entries, settings }: { entries: Entry[], settings: Settings }) {
  const [activeTab, setActiveTab] = useState<'charts' | 'detailed' | 'filtered' | 'raw'>('charts');
  const [filterPlanet, setFilterPlanet] = useState<string>('All');
  const [filterMonth, setFilterMonth] = useState<string>('All');

  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    entries.forEach(e => {
      months.add(getMonthYear(e.date));
    });
    return Array.from(months).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  }, [entries]);

  const stats = useMemo(() => {
    const specialistMistakes: Record<string, number> = {};
    const planetMistakes: Record<string, number> = {};
    const creatorMistakes: Record<string, number> = {};
    const mistakeCounts: Record<string, number> = {};

    const specMistakeMap: Record<string, Record<string, number>> = {};
    const creatorMistakeMap: Record<string, Record<string, number>> = {};

    entries.forEach(e => {
      e.mistakes.forEach(m => {
        specialistMistakes[e.specialist] = (specialistMistakes[e.specialist] || 0) + 1;
        planetMistakes[e.planet] = (planetMistakes[e.planet] || 0) + 1;
        creatorMistakes[e.creator] = (creatorMistakes[e.creator] || 0) + 1;
        mistakeCounts[m] = (mistakeCounts[m] || 0) + 1;

        if (!specMistakeMap[e.specialist]) specMistakeMap[e.specialist] = {};
        specMistakeMap[e.specialist][m] = (specMistakeMap[e.specialist][m] || 0) + 1;

        if (!creatorMistakeMap[e.creator]) creatorMistakeMap[e.creator] = {};
        creatorMistakeMap[e.creator][m] = (creatorMistakeMap[e.creator][m] || 0) + 1;
      });
    });

    const filteredEntries = entries.filter(e => {
      const planetMatch = filterPlanet === 'All' || e.planet === filterPlanet;
      const monthMatch = filterMonth === 'All' || getMonthYear(e.date) === filterMonth;
      return planetMatch && monthMatch;
    });

    const filteredSpecMistakeMap: Record<string, Record<string, number>> = {};
    const filteredCreatorMistakeMap: Record<string, Record<string, number>> = {};

    filteredEntries.forEach(e => {
      e.mistakes.forEach(m => {
        if (!filteredSpecMistakeMap[e.specialist]) filteredSpecMistakeMap[e.specialist] = {};
        filteredSpecMistakeMap[e.specialist][m] = (filteredSpecMistakeMap[e.specialist][m] || 0) + 1;

        if (!filteredCreatorMistakeMap[e.creator]) filteredCreatorMistakeMap[e.creator] = {};
        filteredCreatorMistakeMap[e.creator][m] = (filteredCreatorMistakeMap[e.creator][m] || 0) + 1;
      });
    });

    return {
      specialistMistakes,
      planetMistakes,
      creatorMistakes,
      mistakeCounts,
      specMistakeMap,
      creatorMistakeMap,
      filteredSpecMistakeMap,
      filteredCreatorMistakeMap,
      filteredEntries
    };
  }, [entries, filterPlanet, filterMonth]);

  const top5Specialists = Object.entries(stats.specialistMistakes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const isDarkMode = document.body.classList.contains('dark') ||
    (!document.body.classList.contains('light') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const chartTextColor = isDarkMode ? '#94a3b8' : '#64748b';
  const chartGridColor = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: chartTextColor, font: { weight: '600' } }
      }
    },
    scales: {
      y: {
        grid: { color: chartGridColor },
        ticks: { color: chartTextColor }
      },
      x: {
        grid: { display: false },
        ticks: { color: chartTextColor }
      }
    }
  };

  const chartData = {
    topSpecialists: {
      labels: top5Specialists.map(s => s[0]),
      datasets: [{
        label: 'Total Errors',
        data: top5Specialists.map(s => s[1]),
        backgroundColor: isDarkMode ? '#60A5FA' : '#3B82F6',
        borderRadius: 8
      }]
    },
    planetPie: {
      labels: Object.keys(stats.planetMistakes),
      datasets: [{
        data: Object.values(stats.planetMistakes),
        backgroundColor: [
          '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'
        ],
        borderWidth: 0
      }]
    },
    creatorBar: {
      labels: Object.keys(stats.creatorMistakes),
      datasets: [{
        label: 'Total Errors',
        data: Object.values(stats.creatorMistakes),
        backgroundColor: isDarkMode ? '#60A5FA' : '#3B82F6',
        borderRadius: 8
      }]
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Data Analysis</h1>
        <p>View and analyze webinar performance metrics</p>
      </div>

      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="glass-panel stat-card">
          <div className="stat-icon primary">
            <FileText size={24} />
          </div>
          <div className="stat-info">
            <h3>{entries.length}</h3>
            <p>Total Recorded</p>
          </div>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'charts' ? 'active' : ''}`}
          onClick={() => setActiveTab('charts')}
        >
          <BarChart3 size={18} /> Charts
        </button>
        <button
          className={`tab-btn ${activeTab === 'detailed' ? 'active' : ''}`}
          onClick={() => setActiveTab('detailed')}
        >
          <FileText size={18} /> Details
        </button>
        <button
          className={`tab-btn ${activeTab === 'filtered' ? 'active' : ''}`}
          onClick={() => setActiveTab('filtered')}
        >
          <Search size={18} /> Filter
        </button>
        <button
          className={`tab-btn ${activeTab === 'raw' ? 'active' : ''}`}
          onClick={() => setActiveTab('raw')}
        >
          <Database size={18} /> Raw Data
        </button>
      </div>

      {(activeTab === 'filtered' || activeTab === 'raw') && (
        <div className="grid-2" style={{ marginBottom: '2rem' }}>
          <div className="form-group">
            <label>Planet</label>
            <select value={filterPlanet} onChange={e => setFilterPlanet(e.target.value)}>
              <option value="All">All Planets</option>
              {settings.planets.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Calendar Month</label>
            <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)}>
              <option value="All">All Library</option>
              {availableMonths.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>
      )}

      {activeTab === 'charts' && (
        <div className="charts-container">
          <div className="glass-panel chart-card">
            <h3>Top 5 Specialists by Errors</h3>
            <div style={{ width: '100%', height: '300px', position: 'relative' }}>
              <Bar data={chartData.topSpecialists} options={commonOptions} />
            </div>
          </div>
          <div className="glass-panel chart-card">
            <h3>Mistake Distribution by Planet</h3>
            <div style={{ width: '100%', height: '300px', position: 'relative' }}>
              <Pie data={chartData.planetPie} options={{ ...commonOptions, scales: undefined }} />
            </div>
          </div>
          <div className="glass-panel chart-card">
            <h3>Errors per Creator</h3>
            <div style={{ width: '100%', height: '300px', position: 'relative' }}>
              <Bar data={chartData.creatorBar} options={commonOptions} />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'detailed' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-panel card">
            <h3>Specialist Performance</h3>
            <div className="table-scroll-container">
              <table>
                <thead>
                  <tr>
                    <th>Specialist Name</th>
                    <th>Committed Mistake</th>
                    <th>Frequency</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(stats.specMistakeMap).map(([spec, mistakes], gIdx) => 
                    Object.entries(mistakes).map(([mistake, count], idx) => (
                      <tr key={`${spec}-${mistake}`} className={idx === 0 && gIdx !== 0 ? 'row-group-divider' : ''}>
                        <td style={{ borderRight: '1px solid var(--glass-border)', background: 'rgba(128,128,128,0.03)' }}>{idx === 0 ? <strong>{spec}</strong> : ''}</td>
                        <td>{mistake}</td>
                        <td><span className="badge">{count}</span></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="glass-panel card">
            <h3>Creator Breakdown</h3>
            <div className="table-scroll-container">
              <table>
                <thead>
                  <tr>
                    <th>Creator Name</th>
                    <th>Mistake Name</th>
                    <th>Frequency</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(stats.creatorMistakeMap).map(([creator, mistakes], gIdx) => 
                    Object.entries(mistakes).map(([mistake, count], idx) => (
                      <tr key={`${creator}-${mistake}`} className={idx === 0 && gIdx !== 0 ? 'row-group-divider' : ''}>
                        <td style={{ borderRight: '1px solid var(--glass-border)', background: 'rgba(128,128,128,0.03)' }}>{idx === 0 ? <strong>{creator}</strong> : ''}</td>
                        <td>{mistake}</td>
                        <td><span className="badge">{count}</span></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'filtered' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-panel card">
            <h3>Filtered Specialist Data</h3>
            <div className="table-scroll-container">
              <table>
                <thead>
                  <tr><th>Specialist</th><th>Error</th><th>Count</th></tr>
                </thead>
                <tbody>
                  {Object.entries(stats.filteredSpecMistakeMap).map(([spec, mists], gIdx) => 
                    Object.entries(mists).map(([m, c], i) => (
                      <tr key={`${spec}-${m}`} className={i === 0 && gIdx !== 0 ? 'row-group-divider' : ''}>
                        <td style={{ borderRight: '1px solid var(--glass-border)', background: 'rgba(128,128,128,0.03)' }}>{i === 0 ? spec : ''}</td>
                        <td>{m}</td>
                        <td>{c}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="glass-panel card">
            <h3>Filtered Creator Data</h3>
            <div className="table-scroll-container">
              <table>
                <thead>
                  <tr><th>Creator</th><th>Error</th><th>Count</th></tr>
                </thead>
                <tbody>
                  {Object.entries(stats.filteredCreatorMistakeMap).map(([cre, mists], gIdx) => 
                    Object.entries(mists).map(([m, c], i) => (
                      <tr key={`${cre}-${m}`} className={i === 0 && gIdx !== 0 ? 'row-group-divider' : ''}>
                        <td style={{ borderRight: '1px solid var(--glass-border)', background: 'rgba(128,128,128,0.03)' }}>{i === 0 ? cre : ''}</td>
                        <td>{m}</td>
                        <td>{c}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'raw' && (
        <div className="glass-panel card">
          <h3>Full Database Export</h3>
          <div className="table-scroll-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Planet</th>
                  <th>Specialist</th>
                  <th>Creator</th>
                  <th>Mistakes</th>
                </tr>
              </thead>
              <tbody>
                {stats.filteredEntries.map(entry => (
                  <tr key={entry.id}>
                    <td>{entry.date}</td>
                    <td>{entry.planet}</td>
                    <td>{entry.specialist}</td>
                    <td>{entry.creator}</td>
                    <td>{entry.mistakes.join(', ')}</td>
                  </tr>
                ))}
                {stats.filteredEntries.length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign: 'center', opacity: 0.5 }}>No records found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== SETTINGS PAGE ====================
function SettingsPage({ 
  settings, 
  entries,
  security,
  onUpdate,
  onUpdateEntry,
  onDeleteEntry,
  onUpdatePasswords,
  onExport,
  onImport,
  showToast
}: { 
  settings: Settings, 
  entries: Entry[],
  security: SecuritySettings,
  onUpdate: (key: keyof Settings, val: string[]) => void,
  onUpdateEntry: (entry: Entry) => void,
  onDeleteEntry: (id: string) => void,
  onUpdatePasswords: (target: 'analysis' | 'settings', newPass: string) => void,
  onExport: () => void,
  onImport: (content: string) => void,
  showToast: (message: string, type: ToastType) => void
}) {
  const [activeTab, setActiveTab] = useState<'config' | 'database' | 'security'>('config');
  const [inputs, setInputs] = useState({
    specialist: '',
    creator: '',
    mistake: '',
    planet: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    target: 'analysis' as 'analysis' | 'settings',
    newPass: '',
    currentPass1: '',
    currentPass2: ''
  });

  const [confirmDelete, setConfirmDelete] = useState<{ id: string, type: 'entry' | 'registry' } | null>(null);
  const [registryToDelete, setRegistryToDelete] = useState<{ key: keyof Settings, val: string } | null>(null);
  const [editRecord, setEditRecord] = useState<Entry | null>(null);
  const [editRegistryItem, setEditRegistryItem] = useState<{ key: keyof Settings, oldVal: string, newVal: string } | null>(null);

  const addItem = (key: keyof Settings, field: keyof typeof inputs) => {
    if (!inputs[field]) return;
    if (settings[key].includes(inputs[field])) {
        showToast('Entry already exists in this registry.', 'warning');
        return;
    }
    onUpdate(key, [...settings[key], inputs[field]]);
    setInputs({ ...inputs, [field]: '' });
    showToast(`${key} added successfully!`, 'success');
  };

  const removeItem = () => {
    if (registryToDelete) {
      const key = registryToDelete.key;
      const val = registryToDelete.val;
      setRegistryToDelete(null);
      onUpdate(key, settings[key].filter(v => v !== val));
      showToast('Item deleted successfully!', 'success');
    } else if (confirmDelete?.type === 'entry') {
      const id = confirmDelete.id;
      setConfirmDelete(null);
      onDeleteEntry(id);
      showToast('Entry deleted successfully!', 'success');
    }
  };

  const saveEditRegistryItem = async () => {
    if (!editRegistryItem) return;
    const trimmedVal = editRegistryItem.newVal.trim();
    if (!trimmedVal) return;
    
    const oldVal = editRegistryItem.oldVal;
    const key = editRegistryItem.key;
    
    setEditRegistryItem(null);
    
    if (trimmedVal === oldVal) {
      return;
    }
    
    const updated = settings[key].map(v =>
      v === oldVal ? trimmedVal : v
    );
    await onUpdate(key, updated);
    showToast('Item updated successfully!', 'success');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    const currentPass = security.passwords[passwordForm.target];
    
    if (passwordForm.currentPass1 !== currentPass || passwordForm.currentPass2 !== currentPass) {
      showToast('Current password does not match.', 'error');
      return;
    }

    if (!passwordForm.newPass) {
      showToast('Please enter a new password.', 'warning');
      return;
    }

    onUpdatePasswords(passwordForm.target, passwordForm.newPass);
    setPasswordForm({ ...passwordForm, newPass: '', currentPass1: '', currentPass2: '' });
    showToast('Password updated successfully!', 'success');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      onImport(event.target?.result as string);
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <div className="page-header">
        <h1>Global Settings</h1>
        <p>Manage your webinar tracking configuration</p>
      </div>

      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'config' ? 'active' : ''}`}
          onClick={() => setActiveTab('config')}
        >
          <Settings size={18} /> Configuration
        </button>
        <button
          className={`tab-btn ${activeTab === 'database' ? 'active' : ''}`}
          onClick={() => setActiveTab('database')}
        >
          <Database size={18} /> Database
        </button>
        <button
          className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <Lock size={18} /> Security
        </button>
      </div>
      
      {activeTab === 'config' && (
        <>
          <div className="grid-2">
            <SettingsSection 
                title="Webinar Specialist" 
                items={settings.specialists} 
                keyName="specialists" 
                value={inputs.specialist}
                onChange={val => setInputs({...inputs, specialist: val})}
                onAdd={() => addItem('specialists', 'specialist')}
                onDelete={val => setRegistryToDelete({ key: 'specialists', val })}
                onEdit={val => setEditRegistryItem({ key: 'specialists', oldVal: val, newVal: val })}
            />
            <SettingsSection 
                title="Creator" 
                items={settings.creators} 
                keyName="creators" 
                value={inputs.creator}
                onChange={val => setInputs({...inputs, creator: val})}
                onAdd={() => addItem('creators', 'creator')}
                onDelete={val => setRegistryToDelete({ key: 'creators', val })}
                onEdit={val => setEditRegistryItem({ key: 'creators', oldVal: val, newVal: val })}
            />
            <SettingsSection 
                title="Mistake Registry" 
                items={settings.mistakes} 
                keyName="mistakes" 
                value={inputs.mistake}
                onChange={val => setInputs({...inputs, mistake: val})}
                onAdd={() => addItem('mistakes', 'mistake')}
                onDelete={val => setRegistryToDelete({ key: 'mistakes', val })}
                onEdit={val => setEditRegistryItem({ key: 'mistakes', oldVal: val, newVal: val })}
            />
            <SettingsSection 
                title="Planetary List" 
                items={settings.planets} 
                keyName="planets" 
                value={inputs.planet}
                onChange={val => setInputs({...inputs, planet: val})}
                onAdd={() => addItem('planets', 'planet')}
                onDelete={val => setRegistryToDelete({ key: 'planets', val })}
                onEdit={val => setEditRegistryItem({ key: 'planets', oldVal: val, newVal: val })}
            />
          </div>

          <div style={{ marginTop: '3rem', padding: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem', borderTop: '1px solid var(--glass-border)' }}>
              <button className="secondary" onClick={onExport} style={{ fontSize: '0.95rem' }}>
                  <Download size={18} /> Export Settings
              </button>
              <label className="secondary" style={{ cursor: 'pointer', fontSize: '0.95rem' }}>
                  <Upload size={18} /> Import Settings
                  <input type="file" hidden onChange={handleImportFile} accept=".json" />
              </label>
          </div>
        </>
      )}

      {activeTab === 'database' && (
        <div className="glass-panel card">
          <h3>Database Records</h3>
          <div className="table-scroll-container">
            <table style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(128,128,128,0.05)' }}>
                  <th>Date</th>
                  <th>Planet</th>
                  <th>Specialist</th>
                  <th>Creator</th>
                  <th>Errors</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.map(e => (
                  <tr key={e.id}>
                    <td style={{ fontSize: '0.9rem' }}>{e.date}</td>
                    <td style={{ fontSize: '0.9rem' }}>{e.planet}</td>
                    <td style={{ fontSize: '0.9rem' }}>{e.specialist}</td>
                    <td style={{ fontSize: '0.9rem' }}>{e.creator}</td>
                    <td style={{ fontSize: '0.85rem' }}>{e.mistakes.join(', ')}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button 
                          className="small secondary" 
                          onClick={() => setEditRecord(e)}
                        >
                          <Pencil size={14} /> Edit
                        </button>
                        <button 
                          className="small" 
                          onClick={() => setConfirmDelete({ id: e.id, type: 'entry' })}
                          style={{ background: 'var(--danger-light)', color: 'var(--danger)' }}
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {entries.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: '4rem', opacity: 0.5 }}>No records in the database.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="grid-2">
          <div className="glass-panel card">
            <h3>Change Password</h3>
            <form onSubmit={handlePasswordChange}>
              <div className="form-group">
                <label>Manage Section</label>
                <select 
                  value={passwordForm.target} 
                  onChange={e => setPasswordForm({...passwordForm, target: e.target.value as any})}
                >
                  <option value="analysis">Analysis Page</option>
                  <option value="settings">Settings Page</option>
                </select>
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input 
                  type="password"
                  placeholder="Enter new password"
                  value={passwordForm.newPass}
                  onChange={e => setPasswordForm({...passwordForm, newPass: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Current Password</label>
                <input 
                  type="password"
                  placeholder="Verify password"
                  value={passwordForm.currentPass1}
                  onChange={e => setPasswordForm({...passwordForm, currentPass1: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Repeat Current Password</label>
                <input 
                  type="password"
                  placeholder="Repeat verification"
                  value={passwordForm.currentPass2}
                  onChange={e => setPasswordForm({...passwordForm, currentPass2: e.target.value})}
                  required
                />
              </div>
              <button type="submit" style={{ width: '100%' }}><Lock size={18} /> Update Security</button>
            </form>
          </div>

          <div className="glass-panel card">
            <h3>Audit History</h3>
            <div className="table-scroll-container">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Section</th>
                    <th>Last</th>
                    <th>Current</th>
                  </tr>
                </thead>
                <tbody>
                  {security.history.map(item => (
                    <tr key={item.id}>
                      <td style={{ fontSize: '0.8rem' }}>{item.date}</td>
                      <td style={{ textTransform: 'capitalize', fontSize: '0.9rem' }}>{item.target}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>{item.lastPassword}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.9rem', fontWeight: 600 }}>{item.newPassword}</td>
                    </tr>
                  ))}
                  {security.history.length === 0 && (
                    <tr><td colSpan={4} style={{ textAlign: 'center', padding: '3rem', opacity: 0.4 }}>No history logs found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {(confirmDelete || registryToDelete) && (
        <DeleteConfirmationModal 
          onConfirm={removeItem} 
          onCancel={() => {
            setConfirmDelete(null);
            setRegistryToDelete(null);
          }} 
        />
      )}

      {editRecord && (
        <EditRecordModal 
          entry={editRecord} 
          settings={settings} 
          onSave={(u) => {
            onUpdateEntry(u);
            setEditRecord(null);
            showToast('Entry updated successfully!', 'success');
          }} 
          onCancel={() => setEditRecord(null)} 
        />
      )}

      {editRegistryItem && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '440px' }}>
            <div className="modal-icon">
              <Pencil size={28} />
            </div>
            <h2 style={{ marginBottom: '0.5rem' }}>Edit Item</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>
              Editing: <strong>{editRegistryItem.oldVal}</strong>
            </p>
            <div className="form-group" style={{ textAlign: 'left' }}>
              <label>New Value</label>
              <input
                autoFocus
                value={editRegistryItem.newVal}
                onChange={e => setEditRegistryItem({ ...editRegistryItem, newVal: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && saveEditRegistryItem()}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button onClick={saveEditRegistryItem} style={{ flex: 1 }}><Save size={18} /> Save</button>
              <button className="secondary" onClick={() => setEditRegistryItem(null)} style={{ flex: 1 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== MAIN APP ====================
export default function App() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'input' | 'analysis' | 'settings'>('dashboard');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('app_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [entries, setEntries] = useState<Entry[]>([]);
  const [settings, setSettings] = useState<Settings>(INITIAL_SETTINGS);
  const [security, setSecurity] = useState<SecuritySettings>(INITIAL_SECURITY);

  const [sessionUnlocked, setSessionUnlocked] = useState({
    analysis: false,
    settings: false
  });

  // Toast function
  const showToast = (message: string, type: ToastType) => {
    const id = nanoid();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data: entriesData } = await supabase
          .from('webinar_entries')
          .select('*')
          .order('date', { ascending: false });
        
        if (entriesData) setEntries(entriesData);

        const { data: settingsData } = await supabase
          .from('webinar_settings')
          .select('*')
          .single();
        
        if (settingsData) {
          setSettings({
            planets: settingsData.planets,
            specialists: settingsData.specialists,
            creators: settingsData.creators,
            mistakes: settingsData.mistakes
          });
        }

        const { data: securityData } = await supabase
          .from('webinar_security')
          .select('*')
          .single();
        
        if (securityData) {
          setSecurity({
            passwords: securityData.passwords,
            history: securityData.history || []
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Realtime subscriptions
  useEffect(() => {
    const channel = supabase.channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'webinar_entries' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setEntries(prev => [payload.new as Entry, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setEntries(prev => prev.map(e => e.id === payload.new.id ? (payload.new as Entry) : e));
          } else if (payload.eventType === 'DELETE') {
            setEntries(prev => prev.filter(e => e.id !== payload.old.id));
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'webinar_settings' },
        (payload) => {
          if (payload.new && Array.isArray(payload.new.planets) && Array.isArray(payload.new.specialists) && Array.isArray(payload.new.creators) && Array.isArray(payload.new.mistakes)) {
            setSettings({
              planets: payload.new.planets,
              specialists: payload.new.specialists,
              creators: payload.new.creators,
              mistakes: payload.new.mistakes
            });
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'webinar_security' },
        (payload) => {
          if (payload.new && payload.new.passwords) {
            setSecurity({
              passwords: payload.new.passwords,
              history: payload.new.history || []
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Migration logic
  useEffect(() => {
    const migrateData = async () => {
      const localEntries = localStorage.getItem('webinar_entries');
      const hasMigrated = localStorage.getItem('supabase_migrated');

      if (localEntries && !hasMigrated && entries.length === 0 && !isLoading) {
        const parsed = JSON.parse(localEntries);
        if (parsed.length > 0) {
          const { error } = await supabase.from('webinar_entries').insert(
            parsed.map((e: any) => ({
              date: e.date,
              planet: e.planet,
              specialist: e.specialist,
              creator: e.creator,
              mistakes: e.mistakes
            }))
          );
          if (!error) {
            localStorage.setItem('supabase_migrated', 'true');
            const { data } = await supabase.from('webinar_entries').select('*');
            if (data) setEntries(data);
          }
        }
      }
    };
    if (!isLoading) migrateData();
  }, [isLoading, entries.length]);

  // Theme
  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  // Data operations
  const addEntry = async (entry: Omit<Entry, 'id'>) => {
    const { error } = await supabase
      .from('webinar_entries')
      .insert([entry]);
    
    if (!error) {
      setShowSuccessModal(true);
    }
  };

  const updateEntry = async (updatedEntry: Entry) => {
    const { error } = await supabase
      .from('webinar_entries')
      .update(updatedEntry)
      .eq('id', updatedEntry.id);
    
    if (error) {
      console.error('Update entry error:', error.message);
      showToast('Error updating entry.', 'error');
    }
  };

  const deleteEntry = async (id: string) => {
    const { error } = await supabase
      .from('webinar_entries')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Delete entry error:', error.message);
      showToast('Error deleting entry.', 'error');
    }
  };

  const updateSettings = async (key: keyof Settings, value: string[]) => {
    const { error } = await supabase
      .from('webinar_settings')
      .update({ [key]: value })
      .eq('id', 1);
    
    if (error) {
      console.error('Update settings error:', error.message);
      showToast('Settings not saved!', 'error');
    }
  };

  const updatePasswords = async (target: 'analysis' | 'settings', newPass: string) => {
    const lastPass = security.passwords[target];
    const newRecord: SecurityRecord = {
      id: nanoid(),
      date: new Date().toLocaleString(),
      target,
      lastPassword: lastPass,
      newPassword: newPass
    };
    
    const newPasswords = { ...security.passwords, [target]: newPass };
    const newHistory = [newRecord, ...security.history];

    const { error } = await supabase
      .from('webinar_security')
      .update({ 
        passwords: newPasswords,
        history: newHistory
      })
      .eq('id', 1);

    if (!error) {
      setSecurity({
        passwords: newPasswords,
        history: newHistory
      });
    }
  };

  const exportData = () => {
    const data = JSON.stringify({ entries, settings }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `webinar_data_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast('Data exported successfully!', 'success');
  };

  const importData = (content: string) => {
    try {
      const data = JSON.parse(content);
      if (data.entries && data.settings) {
        setEntries(data.entries);
        setSettings(data.settings);
        showToast('Data imported successfully!', 'success');
      }
    } catch (err) {
      showToast('Error importing file.', 'error');
    }
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as any);
    setSidebarOpen(false);
  };

  return (
    <div className="layout">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-icon">
              <FileText size={24} />
            </div>
            <span>Webinar Tracker</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div
            className={`nav-item ${currentPage === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNavigate('dashboard')}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </div>
          <div
            className={`nav-item ${currentPage === 'input' ? 'active' : ''}`}
            onClick={() => handleNavigate('input')}
          >
            <FileInput size={20} />
            <span>New Entry</span>
          </div>
          <div
            className={`nav-item ${currentPage === 'analysis' ? 'active' : ''}`}
            onClick={() => handleNavigate('analysis')}
          >
            <BarChart3 size={20} />
            <span>Analysis</span>
          </div>
          <div
            className={`nav-item ${currentPage === 'settings' ? 'active' : ''}`}
            onClick={() => handleNavigate('settings')}
          >
            <Settings size={20} />
            <span>Settings</span>
          </div>
        </nav>

        <div className="sidebar-footer">
          <button className="theme-toggle" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
            {theme === 'light' ? <><Moon size={18} /> <span>Dark Mode</span></> : <><Sun size={18} /> <span>Light Mode</span></>}
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)}></div>}

      {/* Mobile Header */}
      <div className="mobile-header">
        <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
          <Menu size={24} />
        </button>
        <div className="logo-container" style={{ fontSize: '1rem' }}>
          <span>Webinar Tracker</span>
        </div>
        <button className="mobile-menu-btn" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="container">
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '1rem' }}>
              <div className="loading-spinner">
                <div className="spinner"></div>
              </div>
              <p style={{ opacity: 0.5 }}>Connecting to database...</p>
            </div>
          ) : (
            <>
              {currentPage === 'dashboard' && <DashboardPage entries={entries} settings={settings} onNavigate={handleNavigate} />}
              
              {currentPage === 'input' && <DataInputPage settings={settings} onSave={addEntry} />}
              
              {currentPage === 'analysis' && (
                !sessionUnlocked.analysis ? (
                  <PasswordGateway 
                    target="Analysis" 
                    correctPassword={security.passwords.analysis} 
                    onUnlock={() => setSessionUnlocked({ ...sessionUnlocked, analysis: true })}
                  />
                ) : (
                  <DataAnalysisPage entries={entries} settings={settings} />
                )
              )}
              
              {currentPage === 'settings' && (
                !sessionUnlocked.settings ? (
                  <PasswordGateway 
                    target="Settings" 
                    correctPassword={security.passwords.settings} 
                    onUnlock={() => setSessionUnlocked({ ...sessionUnlocked, settings: true })}
                  />
                ) : (
                  <SettingsPage 
                    settings={settings} 
                    entries={entries}
                    security={security}
                    onUpdate={updateSettings} 
                    onUpdateEntry={updateEntry}
                    onDeleteEntry={deleteEntry}
                    onUpdatePasswords={updatePasswords}
                    onExport={exportData} 
                    onImport={importData}
                    showToast={showToast}
                  />
                )
              )}
            </>
          )}
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <SuccessModal
          onAddAnother={() => setShowSuccessModal(false)}
          onGoToAnalysis={() => {
            setShowSuccessModal(false);
            setCurrentPage('analysis');
          }}
        />
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
