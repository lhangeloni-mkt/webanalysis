import React, { useState, useEffect, useMemo, useRef, Fragment } from 'react';
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
  Sun,
  Moon,
  AlertCircle,
  Lock,
  Pencil,
  LayoutDashboard,
  Settings as SettingsIcon,
  BarChart3,
  Menu,
  X,
  FileInput,
  TrendingDown,
  TrendingUp,
  Users,
  AlertTriangle,
  Activity,
  Eye,
  Save,
  AlertOctagon,
  Calendar,
  Check,
  FileText
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
import { Bar, Pie, Line } from 'react-chartjs-2';
import type { Entry, Settings, MistakeItem, SecuritySettings, SecurityRecord } from './types';
import { createClient } from './utils/supabase/client';
import Logo from './assets/logo.svg';
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
  mistakes: [
    { label: 'Webinar POST delivered after deadline (If delivered after deadline , rating is automatically 3/5 or lower)', type: 'post', color: 'red' },
    { label: 'URLs (short/direct) & page external title and Page speed -> No marketing terms , avoid using capital letters', type: 'post', color: 'red' },
    { label: 'CTAs in both Emails and landing pages (copyright and function-> where does it redirect)', type: 'post', color: 'red' },
    { label: 'Countdowns , closing dates both Emails and Landing pages (ex. "Registrations close on Sunday 15th of March at 9PM EDT , this is incorrect)', type: 'post', color: 'red' },
    { label: 'Guarantee should be consistent and correct across both emails and pages', type: 'post', color: 'red' },
    { label: 'Checkout (correct offer linked, Card disclaimer text correct)', type: 'post', color: 'red' },
    { label: 'Prices (Pricing is following the requested amount from the Account Manager)', type: 'post', color: 'red' },
    { label: 'Mobile version (all content is coherent with Desktop version)', type: 'post', color: 'red' },
    { label: 'Spelling mistakes in the landing pages and Emails', type: 'post', color: 'red' },
    { label: 'Incorrect currency used in landing pages and emails', type: 'post', color: 'red' },
    { label: 'Incorrect timezones mentioned in Reminder emails, Offer emails and in the landing pages', type: 'post', color: 'red' },
    { label: 'Page or Email not finished, missing content or email fully missing', type: 'post', color: 'red' },
    { label: 'CTA links within email banner images that lead to incorrect pages', type: 'post', color: 'red' },
    { label: 'Emails with banner images that present a different course or a different topic would be incorrect', type: 'post', color: 'red' },
    { label: 'Emails scheduling timing (If timing greater than 2-3 hours)', type: 'post', color: 'red' },
    { label: 'Emails with banner images that have an incorrect page linked within the image', type: 'post', color: 'red' },
    { label: 'Webinar topic (Webinar topic is following the requested narrative from the Account Manager)', type: 'post', color: 'red' },
    { label: 'Segmentation mistakes (e.x Wrong Webinar form selected in emails)', type: 'post', color: 'red' },
    { label: 'Incorrect Upsells being sold instead of requested ones', type: 'post', color: 'red' },
    { label: 'Urgency/Scarcity narrative incorrectly used in pages and emails', type: 'post', color: 'red' },
    { label: 'WebinarJam Slides and WebinarJam Copywriting + Landing page link (ex. copywriting mentions an urgency discount when it does not apply)', type: 'post', color: 'red' },
    { label: 'Timing of the event incorrectly inputted into Webjam', type: 'post', color: 'red' },
    { label: 'Discounted amounts depicted incorrectly (100$ off instead of 50$)', type: 'post', color: 'red' },
    { label: 'Emails and landing pages should not presenting seasonal narrative', type: 'post', color: 'red' },
    { label: 'Design changes on Emails and Checkouts (ex. Thumbnail image is low quality image)', type: 'post', color: 'yellow' },
    { label: 'Amount of Video Lessons , Hours of Content and excercises (Course Content) , should be consistent across all emails , sales pages and offers', type: 'post', color: 'yellow' },
    { label: 'Using COLD offers and pages in an ORG webinar is incorrect | Or using COLD A in one offer and COLD B in another offer (Even if this is done multiple times , it counts as 1 yellow mistake)', type: 'post', color: 'yellow' },
    { label: 'Video settings (fully missing or partially missing)', type: 'post', color: 'yellow' },
    { label: 'Upsell content mistakes (ex. Course has been released but the upsell copy suggests the opposite, or the other way around)', type: 'post', color: 'yellow' },
    { label: 'Spelling mistakes on the FAQ Section of Sales pages', type: 'post', color: 'yellow' },
    { label: 'If webinar happens on the weekend , replay email should be automated', type: 'post', color: 'yellow' },
    { label: 'Footer (terms and conditions, privacy & policy, copyright, and no faq)', type: 'post', color: 'yellow' },
    { label: 'First Quadrant (Header: no spaces, correctly positioned and aligned)', type: 'post', color: 'yellow' },
    { label: 'CTA Size', type: 'post', color: 'yellow' },
    { label: 'Page Distribution', type: 'post', color: 'yellow' },
    { label: 'Timezones (Adding EST instead of EDT)', type: 'post', color: 'yellow' },
    { label: 'URLs (short/direct) & page external title and Page speed', type: 'pre', color: 'red' },
    { label: 'CTAs in both Emails and landing pages (copywriting and function-> where does it redirect)', type: 'pre', color: 'red' },
    { label: 'Countdowns , timezones (Mentioning EST instead of CET)', type: 'pre', color: 'red' },
    { label: 'Date of webinar presented incorrectly (ex. Wednesday 12th 9PM , instead of Friday 9th 1PM)', type: 'pre', color: 'red' },
    { label: 'Spelling mistakes in the landing pages and Emails', type: 'pre', color: 'red' },
    { label: 'Poor syntax & difficulty in understanding some copy components [On pages and emails]', type: 'pre', color: 'red' },
    { label: 'Incorrect timezones mentioned in Invitation emails , confirmation emails', type: 'pre', color: 'red' },
    { label: 'Copywriting within the registration page or thank you page that mentions a different creator or course (ex. Irish language found in Watercolor workshops , or Irish with Mollie mentioned in a different creators webinar)', type: 'pre', color: 'red' },
    { label: 'Page or email not finished or missing content', type: 'pre', color: 'red' },
    { label: 'Mobile version (all content is coherent with Desktop version)', type: 'pre', color: 'red' },
    { label: 'Emails with banner images that present a different course or a different topic would be incorrect', type: 'pre', color: 'red' },
    { label: 'Emails scheduling timing (Invitation emails or Confirmation email)', type: 'pre', color: 'red' },
    { label: 'Webinar topic (Webinar topic is following the requested narrative from the Account Manager)', type: 'pre', color: 'red' },
    { label: 'Segmentation mistakes (e.x Wrong Webinar form selected in invitation emails)', type: 'pre', color: 'red' },
    { label: 'Timing of the event incorrectly inputted into Webjam', type: 'pre', color: 'red' },
    { label: 'Confirmation email incorrectly set up or there is incorrect copywriting', type: 'pre', color: 'red' },
    { label: 'Forms being incorrectly added into registration pages', type: 'pre', color: 'red' },
    { label: 'Invitation emails correctly set up and scheduled', type: 'pre', color: 'red' },
    { label: 'Forms redirecting to incorrect thank you pages', type: 'pre', color: 'red' },
    { label: 'Forms should always be a "Single opt-in"', type: 'pre', color: 'red' },
    { label: 'No two step opt in forms being included in CTAs of Registration pages', type: 'pre', color: 'red' },
    { label: 'Multiple impactful design changes needed in pages and emails (if overall visual appearance of reg page is not desirable)', type: 'pre', color: 'red' },
    { label: 'Invitation emails left unscheduled', type: 'pre', color: 'red' },
    { label: 'Webinar Jam incorrectly set up (Creator\'s images , backgrounds , topic)', type: 'pre', color: 'red' },
    { label: 'Minor design changes in pages and emails (ex. Thumbnail image is low quality image and it has to be updated)', type: 'pre', color: 'yellow' },
    { label: 'Inside of the Calendar, invitation links are missing (ex. Live event link or group chat link missing from Calendar even invitation)', type: 'pre', color: 'yellow' },
    { label: 'Minor Webinar jam waiting room design changes (Background image low quality)', type: 'pre', color: 'yellow' },
    { label: 'Footer (terms and conditions, privacy & policy, copyright, and no faq)', type: 'pre', color: 'yellow' },
    { label: 'CTA Size', type: 'pre', color: 'yellow' },
    { label: 'Page Distribution', type: 'pre', color: 'yellow' },
    { label: 'Timezones (Adding EST instead of EDT)', type: 'pre', color: 'yellow' },
    { label: 'No Show - Track and log no-show events', type: 'mod', color: 'red' },
    { label: 'Communicate Errors - AM', type: 'mod', color: 'red' },
    { label: 'Communicate Errors - WS', type: 'mod', color: 'red' },
    { label: 'Not sharing the offer during moderation', type: 'mod', color: 'red' },
    { label: 'Sharing wrong links', type: 'whatsapp', color: 'red' },
    { label: 'Miscommunication within group chat', type: 'whatsapp', color: 'red' }
  ],
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
  const [mistakeRows, setMistakeRows] = useState<Array<{ mistake: string; count: number }>>(() => {
    if (!entry.mistakes || entry.mistakes.length === 0) return [{ mistake: '', count: 1 }];
    const counts: Record<string, number> = {};
    entry.mistakes.forEach(m => {
      counts[m] = (counts[m] || 0) + 1;
    });
    const rows = Object.entries(counts).map(([mistake, count]) => ({ mistake, count }));
    rows.push({ mistake: '', count: 1 });
    return rows;
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      mistakes: mistakeRows.flatMap(row => row.mistake ? Array(row.count).fill(row.mistake) : [])
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

          {mistakeRows.map((row, i) => (
            <div key={i} style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <MistakeSelect
                    label={`Mistake ${i + 1}`}
                    options={settings.mistakes}
                    value={row.mistake}
                    onChange={val => {
                      let updated = [...mistakeRows];
                      updated[i] = { ...updated[i], mistake: val };
                      if (val !== '' && i === updated.length - 1) {
                        updated.push({ mistake: '', count: 1 });
                      }
                      while (updated.length > 1 && updated[updated.length - 1].mistake === '' && updated[updated.length - 2].mistake === '') {
                        updated.pop();
                      }
                      setMistakeRows(updated);
                    }}
                    required={i === 0}
                  />
                </div>
                {row.mistake !== '' && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0, width: '85px', paddingTop: '1.75rem' }}>
                    <select
                      value={row.count}
                      onChange={e => {
                        let updated = [...mistakeRows];
                        updated[i] = { ...updated[i], count: Number(e.target.value) };
                        setMistakeRows(updated);
                      }}
                      style={{
                        width: '100%',
                        height: '52px',
                        padding: '0.5rem',
                        textAlign: 'center',
                        fontWeight: 600,
                        fontSize: '1rem',
                        backgroundColor: 'var(--bg-color)',
                        color: 'var(--text-main)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        marginBottom: '0.2rem'
                      }}
                      title="Quantity"
                    >
                      {Array.from({ length: 10 }, (_, n) => n + 1).map(n => (
                        <option key={n} value={n}>{n}x</option>
                      ))}
                    </select>
                    {(mistakeRows.length > 1 || row.mistake !== '') && (
                      <span
                        onClick={() => {
                          let updated = mistakeRows.filter((_, idx) => idx !== i);
                          if (updated.length === 0) updated = [{ mistake: '', count: 1 }];
                          setMistakeRows(updated);
                        }}
                        style={{
                          color: 'var(--danger)',
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          fontWeight: '500',
                          paddingRight: '2px'
                        }}
                      >
                        Remove
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" disabled={!mistakeRows[0].mistake} style={{ flex: 1 }}><Save size={18} /> Save Changes</button>
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

function MistakeSelect({
  label,
  options,
  value,
  onChange,
  required = false,
  noColor = false
}: {
  label: string;
  options: MistakeItem[];
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
  noColor?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColor, setSelectedColor] = useState<'red' | 'yellow' | null>(null);

  const uniqueColors = [...new Set(options.map(o => o.color))];
  const hasMixedColors = !noColor && uniqueColors.length > 1;

  const sortedOptions = [...options].sort((a, b) => {
    if (noColor) return 0;
    if (a.color === 'red' && b.color !== 'red') return -1;
    if (a.color !== 'red' && b.color === 'red') return 1;
    return 0;
  });

  const filteredOptions = sortedOptions.filter(opt =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedColor ? opt.color === selectedColor : true)
  );

  const handleOpen = () => {
    if (!isOpen) {
      setSelectedColor(null);
      setSearchTerm('');
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedColor(null);
    setSearchTerm('');
  };

  const getItemColor = (opt: MistakeItem) => {
    if (opt.type === 'mod') return '#3B82F6';
    if (opt.type === 'whatsapp') return '#22C55E';
    return opt.color === 'red' ? '#EF4444' : '#EAB308';
  };

  const modal = isOpen ? (
    <>
      <div className="modal-overlay" onClick={handleClose} style={{ zIndex: 999 }} />
      <div
        className="glass-panel"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
          padding: '1.5rem',
          maxHeight: '65vh',
          width: 'min(90vw, 650px)',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg-color)',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h4 style={{ margin: 0 }}>Select Mistake</h4>
          <button type="button" onClick={handleClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.25rem' }}>
            <X size={20} />
          </button>
        </div>

        {hasMixedColors && (
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <div
              onClick={() => { setSelectedColor(prev => prev === 'red' ? null : 'red'); setSearchTerm(''); }}
              style={{
                flex: 1,
                padding: '0.75rem',
                borderRadius: '10px',
                textAlign: 'center',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                background: selectedColor === 'red' ? '#EF4444' : 'transparent',
                color: selectedColor === 'red' ? 'white' : '#EF4444',
                border: '2px solid #EF4444',
                transition: 'all 0.2s'
              }}
            >
              RED MISTAKE
            </div>
            <div
              onClick={() => { setSelectedColor(prev => prev === 'yellow' ? null : 'yellow'); setSearchTerm(''); }}
              style={{
                flex: 1,
                padding: '0.75rem',
                borderRadius: '10px',
                textAlign: 'center',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                background: selectedColor === 'yellow' ? '#EAB308' : 'transparent',
                color: selectedColor === 'yellow' ? 'white' : '#EAB308',
                border: '2px solid #EAB308',
                transition: 'all 0.2s'
              }}
            >
              YELLOW MISTAKE
            </div>
          </div>
        )}
        <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
          <input
            autoFocus
            style={{ padding: '0.75rem 0.75rem 0.75rem 2.75rem', marginBottom: 0, width: '100%' }}
            placeholder={noColor ? "Search errors..." : selectedColor === 'red' ? "Search RED errors..." : selectedColor === 'yellow' ? "Search YELLOW errors..." : "Search all errors..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {filteredOptions.length > 0 ? (
            filteredOptions.map(opt => (
              <div
                key={opt.label + '-' + opt.type + '-' + opt.color}
                onClick={() => {
                  onChange(opt.label);
                  handleClose();
                }}
                style={{
                  padding: '0.75rem 0.875rem',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.6rem',
                  background: value === opt.label ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                  fontWeight: value === opt.label ? '600' : '400',
                  wordBreak: 'break-word',
                  lineHeight: '1.4',
                  fontSize: '0.9rem',
                  borderLeft: `3px solid ${getItemColor(opt)}`
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = value === opt.label ? 'rgba(59, 130, 246, 0.3)' : 'rgba(128, 128, 128, 0.2)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = value === opt.label ? 'rgba(59, 130, 246, 0.15)' : 'transparent'; }}
              >
                <span style={{
                  flexShrink: 0,
                  fontSize: '0.8rem',
                  lineHeight: '1.6',
                  color: getItemColor(opt)
                }}>●</span>
                <span>{opt.label}</span>
              </div>
            ))
          ) : (
            <div style={{ padding: '1rem', opacity: 0.5, textAlign: 'center' }}>No results found</div>
          )}
        </div>
      </div>
    </>
  ) : null;

  return (
    <div className="form-group" style={{ marginBottom: 0 }}>
      <label>{label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}</label>
      <div
        className="searchable-select-trigger"
        onClick={handleOpen}
        style={{
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.75rem 1rem',
          minHeight: '52px',
          height: 'auto',
          wordBreak: 'break-word',
          whiteSpace: 'normal',
          lineHeight: '1.4'
        }}
      >
        <span style={{ fontSize: '0.95rem', wordBreak: 'break-word', whiteSpace: 'normal', flex: 1, minWidth: 0 }}>{value || 'Select Error'}</span>
        <ChevronDown size={18} style={{ opacity: 0.5, flexShrink: 0, marginLeft: '0.5rem' }} />
      </div>

      {modal}
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

function LoginModal({
  onLogin,
  onCancel
}: {
  onLogin: (email: string, password: string) => Promise<void>;
  onCancel: () => void;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onLogin(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '420px', textAlign: 'left' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Admin Login</h2>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '2rem', fontSize: '0.9rem' }}>
          Sign in with your Supabase credentials to access settings.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="submit" disabled={loading} style={{ flex: 1 }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            <button type="button" className="secondary" onClick={onCancel} style={{ flex: 1 }}>Cancel</button>
          </div>
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

const getEntryType = (entry: Entry, settings: Settings): string => {
  const types = new Set<string>();
  for (const m of entry.mistakes) {
    const found = settings.mistakes.find(sm => sm.label === m);
    if (found) types.add(found.type);
  }
  if (types.size === 1) return types.values().next().value;
  if (types.size > 1) return 'mixed';
  return 'post';
};

const ENTRY_TYPE_LABELS: Record<string, string> = {
  post: 'Post Webinar',
  pre: 'Pre Webinar',
  mod: 'Moderation',
  whatsapp: 'Whatsapp',
  mixed: 'Mixed Types',
  unknown: 'Unknown'
};

const ENTRY_TYPE_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#94a3b8'];

const getWeekRange = (weekOffset: number = 0): { start: string; end: string } => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = new Date(now);
  monday.setDate(now.getDate() - diffToMonday - (weekOffset * 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return {
    start: monday.toISOString().split('T')[0],
    end: sunday.toISOString().split('T')[0]
  };
};

// ==================== SETTINGS SECTION COMPONENT ====================
const SettingsSection = ({ 
  title, 
  items, 
  value, 
  onChange, 
  onAdd, 
  onDelete,
  onEdit
}: { 
  title: string, 
  items: string[], 
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
function DashboardPage({ entries }: { entries: Entry[] }) {
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
    
    const topMistakes = Object.entries(mistakeCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);
    
    const recentEntries = entries.slice(0, 5);
    
    return { totalWebinars, totalMistakes, uniqueCreators, uniquePlanets, topMistakes, recentEntries };
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
          <h3 style={{ marginBottom: '1.5rem' }}>Top Most Common Mistakes</h3>
          {stats.topMistakes.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {stats.topMistakes.map((mistake, index) => (
                <div key={mistake[0]} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--card-bg)', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
                    <span style={{ 
                      width: '26px', 
                      height: '26px', 
                      borderRadius: '50%', 
                      background: index === 0 ? 'var(--danger)' : index === 1 ? 'var(--warning)' : index === 2 ? 'var(--primary)' : 'var(--text-muted)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      flexShrink: 0
                    }}>
                      {index + 1}
                    </span>
                    <span style={{ fontWeight: '500', color: 'var(--text-main)', fontSize: '0.9rem', wordBreak: 'break-word', lineHeight: '1.3' }}>{mistake[0]}</span>
                  </div>
                  <span className="badge" style={{ background: 'var(--danger-light)', color: 'var(--danger)', marginLeft: '0.5rem', flexShrink: 0 }}>
                    {mistake[1]}x
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '2rem 0' }}>
              <BarChart3 size={40} />
              <p>No mistakes recorded yet</p>
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
    creator: ''
  });
  const [mistakeRows, setMistakeRows] = useState<Array<{ mistake: string; count: number }>>([{ mistake: '', count: 1 }]);

  const isFormValid = formData.date && formData.planet && formData.specialist && formData.creator && mistakeRows[0].mistake !== '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    onSave({
      date: formData.date,
      planet: formData.planet,
      specialist: formData.specialist,
      creator: formData.creator,
      mistakes: mistakeRows.flatMap(row => row.mistake ? Array(row.count).fill(row.mistake) : [])
    });
    setFormData({
      date: new Date().toISOString().split('T')[0],
      planet: '',
      specialist: '',
      creator: ''
    });
    setMistakeRows([{ mistake: '', count: 1 }]);
  };

  return (
    <div className="container-narrow">
      <div className="page-header">
        <h1>Post Webinar Entry</h1>
        <p>Add Post Webinar Check Information</p>
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

          {mistakeRows.map((row, i) => (
            <div key={i} style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <MistakeSelect
                    label={`Mistake ${i + 1}`}
                    options={settings.mistakes.filter(m => m.type === 'post')}
                    value={row.mistake}
                    onChange={val => {
                      let updated = [...mistakeRows];
                      updated[i] = { ...updated[i], mistake: val };
                      if (val !== '' && i === updated.length - 1) {
                        updated.push({ mistake: '', count: 1 });
                      }
                      while (updated.length > 1 && updated[updated.length - 1].mistake === '' && updated[updated.length - 2].mistake === '') {
                        updated.pop();
                      }
                      setMistakeRows(updated);
                    }}
                    required={i === 0}
                  />
                </div>
                {row.mistake !== '' && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0, width: '85px', paddingTop: '1.75rem' }}>
                    <select
                      value={row.count}
                      onChange={e => {
                        let updated = [...mistakeRows];
                        updated[i] = { ...updated[i], count: Number(e.target.value) };
                        setMistakeRows(updated);
                      }}
                      style={{
                        width: '100%',
                        height: '52px',
                        padding: '0.5rem',
                        textAlign: 'center',
                        fontWeight: 600,
                        fontSize: '1rem',
                        backgroundColor: 'var(--bg-color)',
                        color: 'var(--text-main)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        marginBottom: '0.2rem'
                      }}
                      title="Quantity"
                    >
                      {Array.from({ length: 10 }, (_, n) => n + 1).map(n => (
                        <option key={n} value={n}>{n}x</option>
                      ))}
                    </select>
                    {(mistakeRows.length > 1 || row.mistake !== '') && (
                      <span
                        onClick={() => {
                          let updated = mistakeRows.filter((_, idx) => idx !== i);
                          if (updated.length === 0) updated = [{ mistake: '', count: 1 }];
                          setMistakeRows(updated);
                        }}
                        style={{
                          color: 'var(--danger)',
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          fontWeight: '500',
                          paddingRight: '2px'
                        }}
                      >
                        Remove
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          <button type="submit" style={{ width: '100%' }} disabled={!isFormValid}>
            <Save size={18} /> Submit Entry
          </button>
        </form>
      </div>
    </div>
  );
}

// ==================== PRE WEBINAR INPUT PAGE ====================
function PreWebinarInputPage({ settings, onSave }: { settings: Settings, onSave: (entry: Omit<Entry, 'id'>) => void }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    planet: '',
    specialist: '',
    creator: ''
  });
  const [mistakeRows, setMistakeRows] = useState<Array<{ mistake: string; count: number }>>([{ mistake: '', count: 1 }]);

  const isFormValid = formData.date && formData.planet && formData.specialist && formData.creator && mistakeRows[0].mistake !== '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    onSave({
      date: formData.date,
      planet: formData.planet,
      specialist: formData.specialist,
      creator: formData.creator,
      mistakes: mistakeRows.flatMap(row => row.mistake ? Array(row.count).fill(row.mistake) : [])
    });
    setFormData({
      date: new Date().toISOString().split('T')[0],
      planet: '',
      specialist: '',
      creator: ''
    });
    setMistakeRows([{ mistake: '', count: 1 }]);
  };

  return (
    <div className="container-narrow">
      <div className="page-header">
        <h1>Pre Webinar Entry</h1>
        <p>Add Pre Webinar Check Information</p>
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

          {mistakeRows.map((row, i) => (
            <div key={i} style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <MistakeSelect
                    label={`Mistake ${i + 1}`}
                    options={settings.mistakes.filter(m => m.type === 'pre')}
                    value={row.mistake}
                    onChange={val => {
                      let updated = [...mistakeRows];
                      updated[i] = { ...updated[i], mistake: val };
                      if (val !== '' && i === updated.length - 1) {
                        updated.push({ mistake: '', count: 1 });
                      }
                      while (updated.length > 1 && updated[updated.length - 1].mistake === '' && updated[updated.length - 2].mistake === '') {
                        updated.pop();
                      }
                      setMistakeRows(updated);
                    }}
                    required={i === 0}
                  />
                </div>
                {row.mistake !== '' && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0, width: '85px', paddingTop: '1.75rem' }}>
                    <select
                      value={row.count}
                      onChange={e => {
                        let updated = [...mistakeRows];
                        updated[i] = { ...updated[i], count: Number(e.target.value) };
                        setMistakeRows(updated);
                      }}
                      style={{
                        width: '100%',
                        height: '52px',
                        padding: '0.5rem',
                        textAlign: 'center',
                        fontWeight: 600,
                        fontSize: '1rem',
                        backgroundColor: 'var(--bg-color)',
                        color: 'var(--text-main)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        marginBottom: '0.2rem'
                      }}
                      title="Quantity"
                    >
                      {Array.from({ length: 10 }, (_, n) => n + 1).map(n => (
                        <option key={n} value={n}>{n}x</option>
                      ))}
                    </select>
                    {(mistakeRows.length > 1 || row.mistake !== '') && (
                      <span
                        onClick={() => {
                          let updated = mistakeRows.filter((_, idx) => idx !== i);
                          if (updated.length === 0) updated = [{ mistake: '', count: 1 }];
                          setMistakeRows(updated);
                        }}
                        style={{
                          color: 'var(--danger)',
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          fontWeight: '500',
                          paddingRight: '2px'
                        }}
                      >
                        Remove
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          <button type="submit" style={{ width: '100%' }} disabled={!isFormValid}>
            <Save size={18} /> Submit Pre Webinar Entry
          </button>
        </form>
      </div>
    </div>
  );
}

// ==================== MODERATION & WHATSAPP PAGES ====================
function ModerationInputPage({ settings, onSave }: { settings: Settings, onSave: (entry: Omit<Entry, 'id'>) => void }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0], planet: '', specialist: '', creator: ''
  });
  const [mistakeRows, setMistakeRows] = useState<Array<{ mistake: string; count: number }>>([{ mistake: '', count: 1 }]);

  const isFormValid = formData.date && formData.planet && formData.specialist && formData.creator && mistakeRows[0].mistake !== '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    onSave({
      date: formData.date, planet: formData.planet, specialist: formData.specialist,
      creator: formData.creator, mistakes: mistakeRows.flatMap(row => row.mistake ? Array(row.count).fill(row.mistake) : [])
    });
    setFormData({ date: new Date().toISOString().split('T')[0], planet: '', specialist: '', creator: '' });
    setMistakeRows([{ mistake: '', count: 1 }]);
  };
  return (
    <div className="container-narrow">
      <div className="page-header">
        <h1>Moderation Entry</h1>
        <p>Add Moderation Check Information</p>
      </div>
      <div className="glass-panel card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Date <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input type="date" required value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Planet <span style={{ color: 'var(--danger)' }}>*</span></label>
            <select required value={formData.planet} onChange={e => setFormData({ ...formData, planet: e.target.value })}>
              <option value="">Select Planet</option>
              {settings.planets.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <SearchableSelect required label="Webinar Specialist" options={settings.specialists} value={formData.specialist}
            onChange={val => setFormData({ ...formData, specialist: val })} placeholder="Search specialist..." />
          <SearchableSelect required label="Creator" options={settings.creators} value={formData.creator}
            onChange={val => setFormData({ ...formData, creator: val })} placeholder="Search creator..." />
          {mistakeRows.map((row, i) => (
            <div key={i} style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <MistakeSelect
                    label={`Mistake ${i + 1}`}
                    options={settings.mistakes.filter(m => m.type === 'mod')}
                    value={row.mistake}
                    onChange={val => {
                      let updated = [...mistakeRows];
                      updated[i] = { ...updated[i], mistake: val };
                      if (val !== '' && i === updated.length - 1) {
                        updated.push({ mistake: '', count: 1 });
                      }
                      while (updated.length > 1 && updated[updated.length - 1].mistake === '' && updated[updated.length - 2].mistake === '') {
                        updated.pop();
                      }
                      setMistakeRows(updated);
                    }}
                    required={i === 0}
                    noColor
                  />
                </div>
                {row.mistake !== '' && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0, width: '85px', paddingTop: '1.75rem' }}>
                    <select
                      value={row.count}
                      onChange={e => {
                        let updated = [...mistakeRows];
                        updated[i] = { ...updated[i], count: Number(e.target.value) };
                        setMistakeRows(updated);
                      }}
                      style={{
                        width: '100%',
                        height: '52px',
                        padding: '0.5rem',
                        textAlign: 'center',
                        fontWeight: 600,
                        fontSize: '1rem',
                        backgroundColor: 'var(--bg-color)',
                        color: 'var(--text-main)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        marginBottom: '0.2rem'
                      }}
                      title="Quantity"
                    >
                      {Array.from({ length: 10 }, (_, n) => n + 1).map(n => (
                        <option key={n} value={n}>{n}x</option>
                      ))}
                    </select>
                    {(mistakeRows.length > 1 || row.mistake !== '') && (
                      <span
                        onClick={() => {
                          let updated = mistakeRows.filter((_, idx) => idx !== i);
                          if (updated.length === 0) updated = [{ mistake: '', count: 1 }];
                          setMistakeRows(updated);
                        }}
                        style={{
                          color: 'var(--danger)',
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          fontWeight: '500',
                          paddingRight: '2px'
                        }}
                      >
                        Remove
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          <button type="submit" style={{ width: '100%' }} disabled={!isFormValid}>
            <Save size={18} /> Submit Entry
          </button>
        </form>
      </div>
    </div>
  );
}

function WhatsappInputPage({ settings, onSave }: { settings: Settings, onSave: (entry: Omit<Entry, 'id'>) => void }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0], planet: '', specialist: '', creator: ''
  });
  const [mistakeRows, setMistakeRows] = useState<Array<{ mistake: string; count: number }>>([{ mistake: '', count: 1 }]);

  const isFormValid = formData.date && formData.planet && formData.specialist && formData.creator && mistakeRows[0].mistake !== '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    onSave({
      date: formData.date, planet: formData.planet, specialist: formData.specialist,
      creator: formData.creator, mistakes: mistakeRows.flatMap(row => row.mistake ? Array(row.count).fill(row.mistake) : [])
    });
    setFormData({ date: new Date().toISOString().split('T')[0], planet: '', specialist: '', creator: '' });
    setMistakeRows([{ mistake: '', count: 1 }]);
  };
  return (
    <div className="container-narrow">
      <div className="page-header">
        <h1>Whatsapp Errors Entry</h1>
        <p>Add Whatsapp Check Information</p>
      </div>
      <div className="glass-panel card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Date <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input type="date" required value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Planet <span style={{ color: 'var(--danger)' }}>*</span></label>
            <select required value={formData.planet} onChange={e => setFormData({ ...formData, planet: e.target.value })}>
              <option value="">Select Planet</option>
              {settings.planets.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <SearchableSelect required label="Webinar Specialist" options={settings.specialists} value={formData.specialist}
            onChange={val => setFormData({ ...formData, specialist: val })} placeholder="Search specialist..." />
          <SearchableSelect required label="Creator" options={settings.creators} value={formData.creator}
            onChange={val => setFormData({ ...formData, creator: val })} placeholder="Search creator..." />
          {mistakeRows.map((row, i) => (
            <div key={i} style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <MistakeSelect
                    label={`Mistake ${i + 1}`}
                    options={settings.mistakes.filter(m => m.type === 'whatsapp')}
                    value={row.mistake}
                    onChange={val => {
                      let updated = [...mistakeRows];
                      updated[i] = { ...updated[i], mistake: val };
                      if (val !== '' && i === updated.length - 1) {
                        updated.push({ mistake: '', count: 1 });
                      }
                      while (updated.length > 1 && updated[updated.length - 1].mistake === '' && updated[updated.length - 2].mistake === '') {
                        updated.pop();
                      }
                      setMistakeRows(updated);
                    }}
                    required={i === 0}
                    noColor
                  />
                </div>
                {row.mistake !== '' && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0, width: '85px', paddingTop: '1.75rem' }}>
                    <select
                      value={row.count}
                      onChange={e => {
                        let updated = [...mistakeRows];
                        updated[i] = { ...updated[i], count: Number(e.target.value) };
                        setMistakeRows(updated);
                      }}
                      style={{
                        width: '100%',
                        height: '52px',
                        padding: '0.5rem',
                        textAlign: 'center',
                        fontWeight: 600,
                        fontSize: '1rem',
                        backgroundColor: 'var(--bg-color)',
                        color: 'var(--text-main)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        marginBottom: '0.2rem'
                      }}
                      title="Quantity"
                    >
                      {Array.from({ length: 10 }, (_, n) => n + 1).map(n => (
                        <option key={n} value={n}>{n}x</option>
                      ))}
                    </select>
                    {(mistakeRows.length > 1 || row.mistake !== '') && (
                      <span
                        onClick={() => {
                          let updated = mistakeRows.filter((_, idx) => idx !== i);
                          if (updated.length === 0) updated = [{ mistake: '', count: 1 }];
                          setMistakeRows(updated);
                        }}
                        style={{
                          color: 'var(--danger)',
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          fontWeight: '500',
                          paddingRight: '2px'
                        }}
                      >
                        Remove
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
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
  const [activeTab, setActiveTab] = useState<'charts' | 'filtered' | 'performance' | 'raw' | 'weekly'>('charts');
  const [filterPlanet, setFilterPlanet] = useState<string>('All');
  const [filterMonth, setFilterMonth] = useState<string>('All');
  const [filterType, setFilterType] = useState<string>('All');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [filterDateStart, setFilterDateStart] = useState<string>(() => getWeekRange(1).start);
  const [filterDateEnd, setFilterDateEnd] = useState<string>(() => getWeekRange(1).end);
  const [compareMode, setCompareMode] = useState(false);
  const [filterDateStart2, setFilterDateStart2] = useState<string>(() => getWeekRange(2).start);
  const [filterDateEnd2, setFilterDateEnd2] = useState<string>(() => getWeekRange(2).end);
  const [showExpandedTable, setShowExpandedTable] = useState(false);
  const [showExpandedChart, setShowExpandedChart] = useState(false);
  const [expandedChartIndex, setExpandedChartIndex] = useState(0);
  const specialistDateRanges = useMemo(() => {
    const ranges: Record<string, { min: string; max: string }> = {};
    entries.forEach(e => {
      if (!ranges[e.specialist]) { ranges[e.specialist] = { min: e.date, max: e.date }; }
      else {
        if (e.date < ranges[e.specialist].min) ranges[e.specialist].min = e.date;
        if (e.date > ranges[e.specialist].max) ranges[e.specialist].max = e.date;
      }
    });
    return ranges;
  }, [entries]);
  const fmtRange = (start: string, end: string) => {
    const fmt = (d: string) => { const [y, m, day] = d.split('-'); return `${day}/${m}`; };
    return `${start ? fmt(start) : '...'} to ${end ? fmt(end) : '...'}`;
  };
  const p1Label = `P1 - ${fmtRange(filterDateStart, filterDateEnd)}`;
  const p2Label = `P2 - ${fmtRange(filterDateStart2, filterDateEnd2)}`;
  const toggleRow = (key: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

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

    const typeCounts: Record<string, number> = {};
    entries.forEach(e => {
      const t = getEntryType(e, settings);
      typeCounts[t] = (typeCounts[t] || 0) + 1;
    });

    const monthlyTypeTrend: Record<string, Record<string, number>> = {};
    entries.forEach(e => {
      const month = getMonthYear(e.date);
      if (!monthlyTypeTrend[month]) monthlyTypeTrend[month] = {};
      const t = getEntryType(e, settings);
      monthlyTypeTrend[month][t] = (monthlyTypeTrend[month][t] || 0) + 1;
    });

    const filteredEntries = entries.filter(e => {
      const planetMatch = filterPlanet === 'All' || e.planet === filterPlanet;
      const monthMatch = filterMonth === 'All' || getMonthYear(e.date) === filterMonth;
      const typeMatch = filterType === 'All' || getEntryType(e, settings) === filterType;
      return planetMatch && monthMatch && typeMatch;
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
      filteredEntries,
      typeCounts,
      monthlyTypeTrend
    };
  }, [entries, filterPlanet, filterMonth, filterType, settings]);

  const weeklyFilteredEntries = useMemo(() => {
    if (!filterDateStart && !filterDateEnd) return entries;
    return entries.filter(e => {
      if (filterDateStart && e.date < filterDateStart) return false;
      if (filterDateEnd && e.date > filterDateEnd) return false;
      return true;
    });
  }, [entries, filterDateStart, filterDateEnd]);

  const weeklyStats = useMemo(() => {
    const specialistMistakes: Record<string, number> = {};
    const creatorMistakes: Record<string, number> = {};
    const mistakeCounts: Record<string, number> = {};
    const typeCounts: Record<string, number> = {};
    const specMistakeMap: Record<string, Record<string, number>> = {};
    const creatorMistakeMap: Record<string, Record<string, number>> = {};
    weeklyFilteredEntries.forEach(e => {
      const t = getEntryType(e, settings);
      typeCounts[t] = (typeCounts[t] || 0) + 1;
      e.mistakes.forEach(m => {
        specialistMistakes[e.specialist] = (specialistMistakes[e.specialist] || 0) + 1;
        creatorMistakes[e.creator] = (creatorMistakes[e.creator] || 0) + 1;
        mistakeCounts[m] = (mistakeCounts[m] || 0) + 1;
        if (!specMistakeMap[e.specialist]) specMistakeMap[e.specialist] = {};
        specMistakeMap[e.specialist][m] = (specMistakeMap[e.specialist][m] || 0) + 1;
        if (!creatorMistakeMap[e.creator]) creatorMistakeMap[e.creator] = {};
        creatorMistakeMap[e.creator][m] = (creatorMistakeMap[e.creator][m] || 0) + 1;
      });
    });
    const entriesArr = Object.entries(specialistMistakes).sort((a, b) => b[1] - a[1]);
    const creatorsArr = Object.entries(creatorMistakes).sort((a, b) => b[1] - a[1]);
    const mistakesArr = Object.entries(mistakeCounts).sort((a, b) => b[1] - a[1]);
    return {
      specialistMistakes, creatorMistakes, mistakeCounts, typeCounts,
      specMistakeMap, creatorMistakeMap,
      totalEntries: weeklyFilteredEntries.length,
      totalMistakes: weeklyFilteredEntries.reduce((sum, e) => sum + e.mistakes.length, 0),
      topSpecialist: entriesArr[0] || null,
      topCreator: creatorsArr[0] || null,
      topMistake: mistakesArr[0] || null,
    };
  }, [weeklyFilteredEntries, settings]);

  const weeklyFilteredEntries2 = useMemo(() => {
    if (!filterDateStart2 && !filterDateEnd2) return entries;
    return entries.filter(e => {
      if (filterDateStart2 && e.date < filterDateStart2) return false;
      if (filterDateEnd2 && e.date > filterDateEnd2) return false;
      return true;
    });
  }, [entries, filterDateStart2, filterDateEnd2]);

  const weeklyStats2 = useMemo(() => {
    const specialistMistakes: Record<string, number> = {};
    const creatorMistakes: Record<string, number> = {};
    const mistakeCounts: Record<string, number> = {};
    const typeCounts: Record<string, number> = {};
    const specMistakeMap: Record<string, Record<string, number>> = {};
    const creatorMistakeMap: Record<string, Record<string, number>> = {};
    weeklyFilteredEntries2.forEach(e => {
      const t = getEntryType(e, settings);
      typeCounts[t] = (typeCounts[t] || 0) + 1;
      e.mistakes.forEach(m => {
        specialistMistakes[e.specialist] = (specialistMistakes[e.specialist] || 0) + 1;
        creatorMistakes[e.creator] = (creatorMistakes[e.creator] || 0) + 1;
        mistakeCounts[m] = (mistakeCounts[m] || 0) + 1;
        if (!specMistakeMap[e.specialist]) specMistakeMap[e.specialist] = {};
        specMistakeMap[e.specialist][m] = (specMistakeMap[e.specialist][m] || 0) + 1;
        if (!creatorMistakeMap[e.creator]) creatorMistakeMap[e.creator] = {};
        creatorMistakeMap[e.creator][m] = (creatorMistakeMap[e.creator][m] || 0) + 1;
      });
    });
    const entriesArr = Object.entries(specialistMistakes).sort((a, b) => b[1] - a[1]);
    const creatorsArr = Object.entries(creatorMistakes).sort((a, b) => b[1] - a[1]);
    const mistakesArr = Object.entries(mistakeCounts).sort((a, b) => b[1] - a[1]);
    return {
      specialistMistakes, creatorMistakes, mistakeCounts, typeCounts,
      specMistakeMap, creatorMistakeMap,
      totalEntries: weeklyFilteredEntries2.length,
      totalMistakes: weeklyFilteredEntries2.reduce((sum, e) => sum + e.mistakes.length, 0),
      topSpecialist: entriesArr[0] || null,
      topCreator: creatorsArr[0] || null,
      topMistake: mistakesArr[0] || null,
    };
  }, [weeklyFilteredEntries2, settings]);

  const weeklyComparisonSpecs = useMemo(() => {
    if (!compareMode) return [];
    const allSpecs = new Set([...Object.keys(weeklyStats.specMistakeMap), ...Object.keys(weeklyStats2.specMistakeMap)]);
    return Array.from(allSpecs).map(spec => {
      const p1 = Object.values(weeklyStats.specMistakeMap[spec] || {}).reduce((s, v) => s + v, 0);
      const p2 = Object.values(weeklyStats2.specMistakeMap[spec] || {}).reduce((s, v) => s + v, 0);
      return { spec, p1, p2, diff: p2 - p1 };
    }).sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));
  }, [compareMode, weeklyStats, weeklyStats2]);

  const mistakeComparisonChartData = useMemo(() => {
    if (!compareMode) return null;
    const allMistakes = [...new Set([...weeklyFilteredEntries, ...weeklyFilteredEntries2].flatMap(e => e.mistakes))].sort();
    const p1Counts = allMistakes.map(m => weeklyFilteredEntries.filter(e => e.mistakes.includes(m)).length);
    const p2Counts = allMistakes.map(m => weeklyFilteredEntries2.filter(e => e.mistakes.includes(m)).length);
    return {
      labels: allMistakes.map(m => m.length > 30 ? m.slice(0, 30) + '...' : m),
      datasets: [
        { label: 'Period 1', data: p1Counts, backgroundColor: 'rgba(59,130,246,0.7)', borderRadius: 6 },
        { label: 'Period 2', data: p2Counts, backgroundColor: 'rgba(245,158,11,0.7)', borderRadius: 6 }
      ]
    };
  }, [compareMode, weeklyFilteredEntries, weeklyFilteredEntries2]);

  const specialistComparisonChartData = useMemo(() => {
    if (!compareMode) return null;
    const allSpecs = [...new Set([...Object.keys(weeklyStats.specMistakeMap), ...Object.keys(weeklyStats2.specMistakeMap)])].sort();
    const p1Counts = allSpecs.map(s => Object.values(weeklyStats.specMistakeMap[s] || {}).reduce((sum, v) => sum + v, 0));
    const p2Counts = allSpecs.map(s => Object.values(weeklyStats2.specMistakeMap[s] || {}).reduce((sum, v) => sum + v, 0));
    return {
      labels: allSpecs,
      datasets: [
        { label: 'Period 1', data: p1Counts, backgroundColor: 'rgba(59,130,246,0.7)', borderRadius: 6 },
        { label: 'Period 2', data: p2Counts, backgroundColor: 'rgba(245,158,11,0.7)', borderRadius: 6 }
      ]
    };
  }, [compareMode, weeklyStats, weeklyStats2]);

  const consolidatedMistakes = useMemo(() => {
    const allMistakes = compareMode
      ? [...new Set([...weeklyFilteredEntries, ...weeklyFilteredEntries2].flatMap(e => e.mistakes))]
      : [...new Set(weeklyFilteredEntries.flatMap(e => e.mistakes))];
    return allMistakes.sort().map(mistake => {
      const mtype = settings.mistakes.find(sm => sm.label === mistake);
      const p1Entries = weeklyFilteredEntries.filter(e => e.mistakes.includes(mistake));
      const p1Specs: Record<string, number> = {};
      const p1Cres: Record<string, number> = {};
      p1Entries.forEach(e => { p1Specs[e.specialist] = (p1Specs[e.specialist] || 0) + 1; p1Cres[e.creator] = (p1Cres[e.creator] || 0) + 1; });
      let p2Count = 0;
      let p2Specs: Record<string, number> = {};
      let p2Cres: Record<string, number> = {};
      let diff = 0;
      if (compareMode) {
        const p2Entries = weeklyFilteredEntries2.filter(e => e.mistakes.includes(mistake));
        p2Count = p2Entries.length;
        p2Specs = {};
        p2Cres = {};
        p2Entries.forEach(e => { p2Specs[e.specialist] = (p2Specs[e.specialist] || 0) + 1; p2Cres[e.creator] = (p2Cres[e.creator] || 0) + 1; });
        diff = p2Count - p1Entries.length;
      }
      return { mistake, type: mtype?.type || 'post', color: mtype?.color || 'red', p1Count: p1Entries.length, p1Specs, p1Cres, p2Count, p2Specs, p2Cres, diff };
    });
  }, [compareMode, weeklyFilteredEntries, weeklyFilteredEntries2, settings]);

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

  const typeLabels = Object.keys(stats.typeCounts).filter(k => k !== 'unknown');
  const typeColors = typeLabels.map(k => ENTRY_TYPE_COLORS[['post', 'pre', 'mod', 'whatsapp', 'mixed'].indexOf(k)] || '#94a3b8');

  const sortedMonths = Object.keys(stats.monthlyTypeTrend).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  const trendTypes = [...new Set(sortedMonths.flatMap(m => Object.keys(stats.monthlyTypeTrend[m])))]
    .filter(t => t !== 'unknown');

  const allSpecialists = Object.entries(stats.specialistMistakes).sort((a, b) => b[1] - a[1]);
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
    allSpecialists: {
      labels: allSpecialists.map(s => s[0]),
      datasets: [{
        label: 'Total Errors',
        data: allSpecialists.map(s => s[1]),
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
      labels: Object.entries(stats.creatorMistakes).sort((a, b) => b[1] - a[1]).map(e => e[0]),
      datasets: [{
        label: 'Total Errors',
        data: Object.entries(stats.creatorMistakes).sort((a, b) => b[1] - a[1]).map(e => e[1]),
        backgroundColor: isDarkMode ? '#60A5FA' : '#3B82F6',
        borderRadius: 8
      }]
    },
    typePie: {
      labels: typeLabels.map(k => ENTRY_TYPE_LABELS[k] || k),
      datasets: [{
        data: typeLabels.map(k => stats.typeCounts[k]),
        backgroundColor: typeColors,
        borderWidth: 0
      }]
    },
    monthlyTrend: {
      labels: sortedMonths,
      datasets: trendTypes.map(t => ({
        label: ENTRY_TYPE_LABELS[t] || t,
        data: sortedMonths.map(m => stats.monthlyTypeTrend[m]?.[t] || 0),
        borderColor: ENTRY_TYPE_COLORS[['post', 'pre', 'mod', 'whatsapp', 'mixed'].indexOf(t)] || '#94a3b8',
        backgroundColor: (ENTRY_TYPE_COLORS[['post', 'pre', 'mod', 'whatsapp', 'mixed'].indexOf(t)] || '#94a3b8') + '33',
        borderWidth: 2,
        tension: 0.3,
        fill: true
      }))
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
          className={`tab-btn ${activeTab === 'filtered' ? 'active' : ''}`}
          onClick={() => setActiveTab('filtered')}
        >
          <Search size={18} /> Filtered Data
        </button>
        <button
          className={`tab-btn ${activeTab === 'performance' ? 'active' : ''}`}
          onClick={() => setActiveTab('performance')}
        >
          <AlertOctagon size={18} /> Performance Overview
        </button>
        <button
          className={`tab-btn ${activeTab === 'raw' ? 'active' : ''}`}
          onClick={() => setActiveTab('raw')}
        >
          <Database size={18} /> Raw Data
        </button>
        <button
          className={`tab-btn ${activeTab === 'weekly' ? 'active' : ''}`}
          onClick={() => setActiveTab('weekly')}
        >
          <Calendar size={18} /> Weekly Report
        </button>
      </div>

      {activeTab === 'filtered' && (
        <div className="grid-3" style={{ marginBottom: '2rem' }}>
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
          <div className="form-group">
            <label>Entry Type</label>
            <select value={filterType} onChange={e => setFilterType(e.target.value)}>
              <option value="All">All Types</option>
              {Object.entries(ENTRY_TYPE_LABELS).filter(([key]) => stats.typeCounts[key] && key !== 'unknown').map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {activeTab === 'charts' && (
        <div className="charts-container">
          <div className="glass-panel chart-card" style={{ cursor: 'pointer' }} onClick={() => { setExpandedChartIndex(0); setShowExpandedChart(true); }}>
            <h3>Most Mistakes Made by Specialists</h3>
            <div style={{ width: '100%', height: '300px', position: 'relative' }}>
              <Bar data={chartData.topSpecialists} options={{
                ...commonOptions,
                plugins: {
                  ...commonOptions.plugins,
                  tooltip: {
                    callbacks: {
                      afterLabel: (context: any) => {
                        const name = context.label;
                        const range = specialistDateRanges[name];
                        return range ? `from ${range.min} to ${range.max}` : '';
                      }
                    }
                  }
                }
              }} />
            </div>
          </div>
          <div className="glass-panel chart-card" style={{ cursor: 'pointer' }} onClick={() => { setExpandedChartIndex(1); setShowExpandedChart(true); }}>
            <h3>Mistake Distribution by Planet</h3>
            <div style={{ width: '100%', height: '300px', position: 'relative' }}>
              <Pie data={chartData.planetPie} options={{ ...commonOptions, scales: undefined, plugins: { ...commonOptions.plugins, legend: { ...commonOptions.plugins.legend, position: 'bottom', labels: { ...commonOptions.plugins.legend.labels, usePointStyle: true, padding: 20 }, onClick: () => {} } } }} />
            </div>
          </div>
          <div className="glass-panel chart-card" style={{ cursor: 'pointer' }} onClick={() => { setExpandedChartIndex(2); setShowExpandedChart(true); }}>
            <h3>Errors per Creator</h3>
            <div style={{ width: '100%', height: '300px', position: 'relative' }}>
              <Bar data={chartData.creatorBar} options={commonOptions} />
            </div>
          </div>
          <div className="glass-panel chart-card" style={{ cursor: 'pointer' }} onClick={() => { setExpandedChartIndex(3); setShowExpandedChart(true); }}>
            <h3>Distribution by Entry Type</h3>
            <div style={{ width: '100%', height: '300px', position: 'relative' }}>
              {typeLabels.length > 0 ? (
                <Pie data={chartData.typePie} options={{ ...commonOptions, scales: undefined, plugins: { ...commonOptions.plugins, legend: { ...commonOptions.plugins.legend, position: 'bottom' } } }} />
              ) : (
                <div className="empty-state"><BarChart3 size={40} /><p>No type data</p></div>
              )}
            </div>
          </div>
          <div className="glass-panel chart-card chart-full-width" style={{ cursor: 'pointer' }} onClick={() => { setExpandedChartIndex(4); setShowExpandedChart(true); }}>
            <h3>Monthly Trend by Entry Type</h3>
            <div style={{ width: '100%', height: '300px', position: 'relative' }}>
              {sortedMonths.length > 0 ? (
                <Line data={chartData.monthlyTrend} options={{
                  ...commonOptions,
                  interaction: { mode: 'index', intersect: false },
                  plugins: {
                    ...commonOptions.plugins,
                    legend: { ...commonOptions.plugins.legend, position: 'bottom' }
                  }
                }} />
              ) : (
                <div className="empty-state"><BarChart3 size={40} /><p>No trend data</p></div>
              )}
            </div>
          </div>
        </div>
      )}
      {showExpandedChart && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
          zIndex: 9999, display: 'flex', flexDirection: 'column',
          padding: '0.5rem', overflow: 'auto'
        }} onClick={() => setShowExpandedChart(false)}>
          <div style={{
            background: 'var(--card-bg)', border: '1px solid var(--glass-border)',
            borderRadius: '12px', padding: '1.5rem',
            width: '85vw', height: '80vh',
            display: 'flex', flexDirection: 'column',
            boxShadow: '0 25px 50px rgba(0,0,0,0.3)', margin: 'auto'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.2rem' }}>
                {expandedChartIndex === 0 ? 'Top 5 Specialists by Errors' :
                 expandedChartIndex === 1 ? 'Mistake Distribution by Planet' :
                 expandedChartIndex === 2 ? 'Errors per Creator' :
                 expandedChartIndex === 3 ? 'Distribution by Entry Type' :
                 'Monthly Trend by Entry Type'}
              </h2>
              <button className="btn btn-sm" onClick={() => setShowExpandedChart(false)}>Close</button>
            </div>
            <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
              {expandedChartIndex === 0 && <Bar data={chartData.allSpecialists} options={{ ...commonOptions, maintainAspectRatio: false, plugins: { ...commonOptions.plugins, tooltip: { callbacks: { afterLabel: (context: any) => { const name = context.label; const range = specialistDateRanges[name]; return range ? `from ${range.min} to ${range.max}` : ''; } } } } }} />}
              {expandedChartIndex === 1 && <Pie data={chartData.planetPie} options={{ ...commonOptions, maintainAspectRatio: false, scales: undefined, plugins: { ...commonOptions.plugins, legend: { ...commonOptions.plugins.legend, position: 'bottom', labels: { ...commonOptions.plugins.legend.labels, usePointStyle: true, padding: 20 }, onClick: () => {} } } }} />}
              {expandedChartIndex === 2 && <Bar data={chartData.creatorBar} options={{ ...commonOptions, maintainAspectRatio: false }} />}
              {expandedChartIndex === 3 && <Pie data={chartData.typePie} options={{ ...commonOptions, maintainAspectRatio: false, scales: undefined, plugins: { ...commonOptions.plugins, legend: { ...commonOptions.plugins.legend, position: 'bottom' } } }} />}
              {expandedChartIndex === 4 && <Line data={chartData.monthlyTrend} options={{ ...commonOptions, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false }, plugins: { ...commonOptions.plugins, legend: { ...commonOptions.plugins.legend, position: 'bottom' } } }} />}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'filtered' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-panel card">
            <h3><BarChart3 size={20} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />Entry Type Summary</h3>
            <div className="table-scroll-container">
              <table>
                <thead>
                  <tr>
                    <th>Entry Type</th>
                    <th>Total Entries</th>
                    <th>% of Total</th>
                  </tr>
                </thead>
                <tbody>
                  {typeLabels.map(t => (
                    <tr key={t}>
                      <td>
                        <span style={{
                          display: 'inline-block',
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          background: ENTRY_TYPE_COLORS[['post', 'pre', 'mod', 'whatsapp', 'mixed'].indexOf(t)] || '#94a3b8',
                          marginRight: '0.5rem',
                          verticalAlign: 'middle'
                        }} />
                        {ENTRY_TYPE_LABELS[t] || t}
                      </td>
                      <td><span className="badge">{stats.typeCounts[t]}</span></td>
                      <td>{Math.round((stats.typeCounts[t] / entries.length) * 100)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="glass-panel card">
            <h3><Search size={20} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />Filtered Specialist Data</h3>
            <div className="table-scroll-container">
              <table>
                <thead>
                  <tr><th>Specialist</th><th>Error</th><th>Count</th></tr>
                </thead>
                <tbody>
                  {Object.entries(stats.filteredSpecMistakeMap)
                    .sort(([, a], [, b]) => Object.values(b).reduce((s, v) => s + v, 0) - Object.values(a).reduce((s, v) => s + v, 0))
                    .map(([spec, mists], gIdx) =>
                    Object.entries(mists).sort(([, a], [, b]) => b - a).map(([m, c], i) => (
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
            <h3><Search size={20} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />Filtered Creator Data</h3>
            <div className="table-scroll-container">
              <table>
                <thead>
                  <tr><th>Creator</th><th>Error</th><th>Count</th></tr>
                </thead>
                <tbody>
                  {Object.entries(stats.filteredCreatorMistakeMap)
                    .sort(([, a], [, b]) => Object.values(b).reduce((s, v) => s + v, 0) - Object.values(a).reduce((s, v) => s + v, 0))
                    .map(([cre, mists], gIdx) =>
                    Object.entries(mists).sort(([, a], [, b]) => b - a).map(([m, c], i) => (
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

      {activeTab === 'performance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-panel card">
            <h3><AlertOctagon size={20} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />Webinar Specialist Performance</h3>
            <div className="table-scroll-container">
              <table style={{ tableLayout: 'fixed' }}>
                <colgroup>
                  <col style={{ width: '33%' }} />
                  <col style={{ width: '37%' }} />
                  <col style={{ width: '17%' }} />
                  <col style={{ width: '13%' }} />
                </colgroup>
                <thead>
                  <tr>
                    <th>Specialist Name</th>
                    <th>Committed Mistakes</th>
                    <th>Type</th>
                    <th>Frequency</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(stats.specMistakeMap)
                    .sort(([aSpec], [bSpec]) => (stats.specialistMistakes[bSpec] || 0) - (stats.specialistMistakes[aSpec] || 0))
                    .map(([spec, mistakes], gIdx) => {
                    const totalErrors = Object.values(mistakes).reduce((a, b) => a + b, 0);
                    const isExpanded = expandedRows.has(spec);
                    const sortedMistakes = Object.entries(mistakes).sort(([, a], [, b]) => b - a);
                    return (
                      <Fragment key={spec}>
                        <tr
                          onClick={() => toggleRow(spec)}
                          style={{ cursor: 'pointer', background: 'rgba(128,128,128,0.03)', userSelect: 'none' }}
                          className={gIdx !== 0 ? 'row-group-divider' : ''}
                        >
                          <td style={{ borderRight: '1px solid var(--glass-border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ fontSize: '0.75rem', opacity: 0.5, transition: 'transform 0.2s', transform: isExpanded ? 'rotate(90deg)' : 'none' }}>▶</span>
                              <div>
                                <strong>{spec}</strong>
                                {isExpanded ? (
                                  <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '600', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    Total Errors <span className="badge" style={{ background: 'var(--danger-light)', color: 'var(--danger)' }}>{totalErrors}</span>
                                  </div>
                                ) : (
                                  <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '600', marginTop: '0.25rem' }}>
                                    {totalErrors} total errors
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td style={{ textAlign: 'center', opacity: 0.5, fontStyle: 'italic', padding: '0.75rem 1rem' }}>{isExpanded ? 'Click to minimize' : 'Click to expand'}</td>
                          <td style={{ textAlign: 'center', padding: '0.75rem 1rem' }}>-</td>
                          <td style={{ textAlign: 'center', padding: '0.75rem 1rem' }}>-</td>
                        </tr>
                        {isExpanded && sortedMistakes.map(([mistake, count]) => {
                          const mType = settings.mistakes.find(sm => sm.label === mistake);
                          return (
                            <tr key={`${spec}-${mistake}`}>
                              <td style={{ borderRight: '1px solid var(--glass-border)', background: 'rgba(128,128,128,0.03)' }} />
                              <td style={{ padding: '0.75rem 1rem' }}>{mistake}</td>
                              <td style={{ textAlign: 'center', padding: '0.75rem 1rem' }}>{mType ? <span className="badge" style={{
                                background: ENTRY_TYPE_COLORS[['post', 'pre', 'mod', 'whatsapp', 'mixed'].indexOf(mType.type)] + '33',
                                color: ENTRY_TYPE_COLORS[['post', 'pre', 'mod', 'whatsapp', 'mixed'].indexOf(mType.type)]
                              }}>{ENTRY_TYPE_LABELS[mType.type]}</span> : <span className="badge" style={{
                                background: ENTRY_TYPE_COLORS[0] + '33',
                                color: ENTRY_TYPE_COLORS[0]
                              }}>{ENTRY_TYPE_LABELS['post']}</span>}</td>
                              <td style={{ textAlign: 'center', padding: '0.75rem 1rem' }}><span className="badge">{count}</span></td>
                            </tr>
                          );
                        })}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', borderTop: '1px solid var(--glass-border)', fontWeight: 700 }}>
              Grand Total
              <span className="badge" style={{ background: 'var(--danger-light)', color: 'var(--danger)' }}>
                {Object.values(stats.specialistMistakes).reduce((a, b) => a + b, 0)}
              </span>
            </div>
          </div>

          <div className="glass-panel card">
            <h3><Users size={20} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />Creator Performance</h3>
            <div className="table-scroll-container">
              <table style={{ tableLayout: 'fixed' }}>
                <colgroup>
                  <col style={{ width: '33%' }} />
                  <col style={{ width: '37%' }} />
                  <col style={{ width: '17%' }} />
                  <col style={{ width: '13%' }} />
                </colgroup>
                <thead>
                  <tr>
                    <th>Creator Name</th>
                    <th>Mistakes</th>
                    <th>Type</th>
                    <th>Frequency</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(stats.creatorMistakeMap)
                    .sort(([aCre], [bCre]) => (stats.creatorMistakes[bCre] || 0) - (stats.creatorMistakes[aCre] || 0))
                    .map(([creator, mistakes], gIdx) => {
                    const totalErrors = Object.values(mistakes).reduce((a, b) => a + b, 0);
                    const isExpanded = expandedRows.has(creator);
                    const sortedMistakes = Object.entries(mistakes).sort(([, a], [, b]) => b - a);
                    return (
                      <Fragment key={creator}>
                        <tr
                          onClick={() => toggleRow(creator)}
                          style={{ cursor: 'pointer', background: 'rgba(128,128,128,0.03)', userSelect: 'none' }}
                          className={gIdx !== 0 ? 'row-group-divider' : ''}
                        >
                          <td style={{ borderRight: '1px solid var(--glass-border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ fontSize: '0.75rem', opacity: 0.5, transition: 'transform 0.2s', transform: isExpanded ? 'rotate(90deg)' : 'none' }}>▶</span>
                              <div>
                                <strong>{creator}</strong>
                                {isExpanded ? (
                                  <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '600', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    Total Errors <span className="badge" style={{ background: 'var(--danger-light)', color: 'var(--danger)' }}>{totalErrors}</span>
                                  </div>
                                ) : (
                                  <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '600', marginTop: '0.25rem' }}>
                                    {totalErrors} total errors
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td style={{ textAlign: 'center', opacity: 0.5, fontStyle: 'italic', padding: '0.75rem 1rem' }}>{isExpanded ? 'Click to minimize' : 'Click to expand'}</td>
                          <td style={{ textAlign: 'center', padding: '0.75rem 1rem' }}>-</td>
                          <td style={{ textAlign: 'center', padding: '0.75rem 1rem' }}>-</td>
                        </tr>
                        {isExpanded && sortedMistakes.map(([mistake, count]) => {
                          const mType = settings.mistakes.find(sm => sm.label === mistake);
                          return (
                            <tr key={`${creator}-${mistake}`}>
                              <td style={{ borderRight: '1px solid var(--glass-border)', background: 'rgba(128,128,128,0.03)' }} />
                              <td style={{ padding: '0.75rem 1rem' }}>{mistake}</td>
                              <td style={{ textAlign: 'center', padding: '0.75rem 1rem' }}>{mType ? <span className="badge" style={{
                                background: ENTRY_TYPE_COLORS[['post', 'pre', 'mod', 'whatsapp', 'mixed'].indexOf(mType.type)] + '33',
                                color: ENTRY_TYPE_COLORS[['post', 'pre', 'mod', 'whatsapp', 'mixed'].indexOf(mType.type)]
                              }}>{ENTRY_TYPE_LABELS[mType.type]}</span> : <span className="badge" style={{
                                background: ENTRY_TYPE_COLORS[0] + '33',
                                color: ENTRY_TYPE_COLORS[0]
                              }}>{ENTRY_TYPE_LABELS['post']}</span>}</td>
                              <td style={{ textAlign: 'center', padding: '0.75rem 1rem' }}><span className="badge">{count}</span></td>
                            </tr>
                          );
                        })}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', borderTop: '1px solid var(--glass-border)', fontWeight: 700 }}>
              Grand Total
              <span className="badge" style={{ background: 'var(--danger-light)', color: 'var(--danger)' }}>
                {Object.values(stats.creatorMistakes).reduce((a, b) => a + b, 0)}
              </span>
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
                {[...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(entry => (
                  <tr key={entry.id}>
                    <td>{entry.date}</td>
                    <td>{entry.planet}</td>
                    <td>{entry.specialist}</td>
                    <td>{entry.creator}</td>
                    <td>{entry.mistakes.join(', ')}</td>
                  </tr>
                ))}
                {entries.length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign: 'center', opacity: 0.5 }}>No records found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {activeTab === 'weekly' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-panel card">
            <div className="filter-row" style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', flexWrap: 'wrap' }}>
              <div className="form-group" style={{ minWidth: '160px' }}>
                <label>Start Date</label>
                <input type="date" value={filterDateStart} onChange={e => setFilterDateStart(e.target.value)} />
              </div>
              <div className="form-group" style={{ minWidth: '160px' }}>
                <label>End Date</label>
                <input type="date" value={filterDateEnd} onChange={e => setFilterDateEnd(e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', paddingBottom: '1px' }}>
                <button className="btn btn-sm" onClick={() => { const r = getWeekRange(1); setFilterDateStart(r.start); setFilterDateEnd(r.end); }}>Last Week</button>
                <button className="btn btn-sm" onClick={() => { const r = getWeekRange(0); setFilterDateStart(r.start); setFilterDateEnd(r.end); }}>This Week</button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingBottom: '1px' }}>
                <button
                  className={`btn btn-sm${compareMode ? ' btn-primary' : ''}`}
                  onClick={() => setCompareMode(!compareMode)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: '22px', height: '22px', borderRadius: '4px',
                    border: compareMode ? '2px solid var(--primary)' : '2px solid var(--glass-border)',
                    background: compareMode ? 'var(--primary)' : 'transparent',
                    transition: 'all 0.2s'
                  }}>
                    {compareMode && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </span>
                  Compare to Other Week
                </button>
              </div>
            </div>
            {compareMode && (
              <div className="filter-row" style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', flexWrap: 'wrap', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--glass-border)' }}>
                <div className="form-group" style={{ minWidth: '160px' }}>
                  <label>Compare Start Date</label>
                  <input type="date" value={filterDateStart2} onChange={e => setFilterDateStart2(e.target.value)} />
                </div>
                <div className="form-group" style={{ minWidth: '160px' }}>
                  <label>Compare End Date</label>
                  <input type="date" value={filterDateEnd2} onChange={e => setFilterDateEnd2(e.target.value)} />
                </div>
              </div>
            )}
          </div>
          {weeklyFilteredEntries.length > 0 ? (
            <>
              <div className="stats-grid" style={{ marginBottom: '0' }}>
                {(() => {
                  const totalEntries = compareMode ? weeklyStats.totalEntries + weeklyStats2.totalEntries : weeklyStats.totalEntries;
                  const totalMistakes = compareMode ? weeklyStats.totalMistakes + weeklyStats2.totalMistakes : weeklyStats.totalMistakes;
                  const specSet = compareMode ? new Set([...Object.keys(weeklyStats.specialistMistakes), ...Object.keys(weeklyStats2.specialistMistakes)]) : new Set(Object.keys(weeklyStats.specialistMistakes));
                  const creSet = compareMode ? new Set([...Object.keys(weeklyStats.creatorMistakes), ...Object.keys(weeklyStats2.creatorMistakes)]) : new Set(Object.keys(weeklyStats.creatorMistakes));
                  const combinedSpecMistakes = compareMode ? (() => {
                    const m: Record<string, number> = {};
                    [...weeklyFilteredEntries, ...weeklyFilteredEntries2].forEach(e => { m[e.specialist] = (m[e.specialist] || 0) + e.mistakes.length; });
                    return Object.entries(m).sort((a, b) => b[1] - a[1])[0] || null;
                  })() : weeklyStats.topSpecialist;
                  const combinedMistakeCounts = compareMode ? (() => {
                    const m: Record<string, number> = {};
                    [...weeklyFilteredEntries, ...weeklyFilteredEntries2].forEach(e => e.mistakes.forEach(mk => { m[mk] = (m[mk] || 0) + 1; }));
                    return Object.entries(m).sort((a, b) => b[1] - a[1])[0] || null;
                  })() : weeklyStats.topMistake;
                  return <>
                    <div className="glass-panel stat-card">
                      <div className="stat-icon primary"><FileText size={20} /></div>
                      <div className="stat-info"><h3>{totalEntries}</h3><p>{compareMode ? 'P1 + P2 Entries' : 'Total Entries'}</p></div>
                    </div>
                    <div className="glass-panel stat-card">
                      <div className="stat-icon danger"><AlertOctagon size={20} /></div>
                      <div className="stat-info"><h3>{totalMistakes}</h3><p>{compareMode ? 'P1 + P2 Mistakes' : 'Total Mistakes'}</p></div>
                    </div>
                    <div className="glass-panel stat-card">
                      <div className="stat-icon warning"><Users size={20} /></div>
                      <div className="stat-info"><h3>{specSet.size}</h3><p>{compareMode ? 'Unique Specialists' : 'Specialists with Errors'}</p></div>
                    </div>
                    <div className="glass-panel stat-card">
                      <div className="stat-icon info"><Users size={20} /></div>
                      <div className="stat-info"><h3>{creSet.size}</h3><p>{compareMode ? 'Unique Creators' : 'Creators with Errors'}</p></div>
                    </div>
                    {combinedSpecMistakes && (
                      <div className="glass-panel stat-card">
                        <div className="stat-icon warning"><TrendingDown size={20} /></div>
                        <div className="stat-info"><h3 style={{ fontSize: '0.85rem', whiteSpace: 'normal', overflow: 'visible', textOverflow: 'clip' }}>{combinedSpecMistakes[0]}</h3><p>Top Specialist ({combinedSpecMistakes[1]} errors)</p></div>
                      </div>
                    )}
                    {combinedMistakeCounts && (
                      <div className="glass-panel stat-card">
                        <div className="stat-icon danger"><AlertTriangle size={20} /></div>
                        <div className="stat-info"><h3 style={{ fontSize: '0.85rem', whiteSpace: 'normal', overflow: 'visible', textOverflow: 'clip' }}>{combinedMistakeCounts[0]}</h3><p>Most Common Error ({combinedMistakeCounts[1]}x)</p></div>
                      </div>
                    )}
                  </>;
                })()}
              </div>
              <div className="glass-panel card" style={{ cursor: 'pointer' }} onClick={() => setShowExpandedTable(true)}>
                <h3><AlertOctagon size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />Consolidated Analysis {compareMode ? `(${p1Label} vs ${p2Label})` : ''}</h3>
                <div className="table-scroll-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Mistake</th>
                        <th>Type</th>
                        <th>Color</th>
                        {compareMode ? (
                          <>
                            <th style={{ background: isDarkMode ? '#1e3a5f' : '#dbeafe' }}>{p1Label}<br />Count</th>
                            <th style={{ background: isDarkMode ? '#1e3a5f' : '#dbeafe' }}>{p1Label}<br />Specialists</th>
                            <th style={{ background: isDarkMode ? '#1e3a5f' : '#dbeafe' }}>{p1Label}<br />Creators</th>
                            <th style={{ background: isDarkMode ? '#3d2e00' : '#fef3c7' }}>{p2Label}<br />Count</th>
                            <th style={{ background: isDarkMode ? '#3d2e00' : '#fef3c7' }}>{p2Label}<br />Specialists</th>
                            <th style={{ background: isDarkMode ? '#3d2e00' : '#fef3c7' }}>{p2Label}<br />Creators</th>
                            <th>Diff</th>
                          </>
                        ) : (
                          <>
                            <th>Count</th>
                            <th>Specialists</th>
                            <th>Creators</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {consolidatedMistakes.map(({ mistake, type, color, p1Count, p1Specs, p1Cres, p2Count, p2Specs, p2Cres, diff }) => {
                        const typeIdx = ['post', 'pre', 'mod', 'whatsapp'].indexOf(type);
                        const bgColor = ENTRY_TYPE_COLORS[typeIdx] || '#94a3b8';
                        const colorDot = color === 'red' ? '#EF4444' : '#EAB308';
                        return !compareMode ? (
                          <tr key={mistake}>
                            <td style={{ fontSize: '0.85rem' }}>{mistake}</td>
                            <td><span className="badge" style={{ background: bgColor + '33', color: bgColor }}>{ENTRY_TYPE_LABELS[type] || type}</span></td>
                            <td style={{ textAlign: 'center' }}><span style={{ display: 'inline-block', width: '18px', height: '18px', borderRadius: '50%', background: colorDot, verticalAlign: 'middle' }} /></td>
                            <td style={{ textAlign: 'center' }}><span className="badge">{p1Count}</span></td>
                            <td style={{ fontSize: '0.9rem' }}>{Object.entries(p1Specs).map(([s, c], i) => <span key={s}>{i > 0 ? ', ' : ''}{s} <span className="badge">{c}</span></span>)}</td>
                            <td style={{ fontSize: '0.9rem' }}>{Object.entries(p1Cres).map(([cr, c], i) => <span key={cr}>{i > 0 ? ', ' : ''}{cr} <span className="badge">{c}</span></span>)}</td>
                          </tr>
                        ) : (
                          <tr key={mistake}>
                            <td style={{ fontSize: '0.85rem' }}>{mistake}</td>
                            <td><span className="badge" style={{ background: bgColor + '33', color: bgColor }}>{ENTRY_TYPE_LABELS[type] || type}</span></td>
                            <td style={{ textAlign: 'center' }}><span style={{ display: 'inline-block', width: '18px', height: '18px', borderRadius: '50%', background: colorDot, verticalAlign: 'middle' }} /></td>
                            <td style={{ background: isDarkMode ? '#1a2e4a' : '#eff6ff', textAlign: 'center' }}><span className="badge">{p1Count}</span></td>
                            <td style={{ background: isDarkMode ? '#1a2e4a' : '#eff6ff', fontSize: '0.9rem' }}>{Object.entries(p1Specs).map(([s, c], i) => <span key={s}>{i > 0 ? ', ' : ''}{s} <span className="badge">{c}</span></span>)}</td>
                            <td style={{ background: isDarkMode ? '#1a2e4a' : '#eff6ff', fontSize: '0.9rem' }}>{Object.entries(p1Cres).map(([cr, c], i) => <span key={cr}>{i > 0 ? ', ' : ''}{cr} <span className="badge">{c}</span></span>)}</td>
                            <td style={{ background: isDarkMode ? '#2a2000' : '#fffbeb', textAlign: 'center' }}><span className="badge">{p2Count}</span></td>
                            <td style={{ background: isDarkMode ? '#2a2000' : '#fffbeb', fontSize: '0.9rem' }}>{Object.entries(p2Specs).map(([s, c], i) => <span key={s}>{i > 0 ? ', ' : ''}{s} <span className="badge">{c}</span></span>)}</td>
                            <td style={{ background: isDarkMode ? '#2a2000' : '#fffbeb', fontSize: '0.9rem' }}>{Object.entries(p2Cres).map(([cr, c], i) => <span key={cr}>{i > 0 ? ', ' : ''}{cr} <span className="badge">{c}</span></span>)}</td>
                            <td style={{ color: diff > 0 ? 'var(--danger)' : diff < 0 ? 'var(--success)' : 'inherit', fontWeight: 700 }}>{diff > 0 ? `+${diff}` : `${diff}`}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              {compareMode && (
                <div className="glass-panel card">
                  <h3><TrendingUp size={20} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />Period Comparison</h3>
                  <p style={{ opacity: 0.6, marginBottom: '1rem', fontSize: '0.85rem' }}>
                    Period 1: {filterDateStart || 'earliest'} to {filterDateEnd || 'latest'} |
                    Period 2: {filterDateStart2 || 'earliest'} to {filterDateEnd2 || 'latest'}
                  </p>
                  <div className="stats-grid" style={{ marginBottom: '1rem' }}>
                    <div className="glass-panel stat-card" style={{ padding: '0.75rem' }}>
                      <div className="stat-icon primary" style={{ width: '32px', height: '32px' }}><FileText size={16} /></div>
                      <div className="stat-info"><h3 style={{ fontSize: '1.1rem' }}>{weeklyStats.totalEntries} <span style={{ opacity: 0.5, fontSize: '0.8rem' }}>vs</span> {weeklyStats2.totalEntries}</h3><p>Total Entries</p></div>
                    </div>
                    <div className="glass-panel stat-card" style={{ padding: '0.75rem' }}>
                      <div className="stat-icon danger" style={{ width: '32px', height: '32px' }}><AlertOctagon size={16} /></div>
                      <div className="stat-info"><h3 style={{ fontSize: '1.1rem' }}>{weeklyStats.totalMistakes} <span style={{ opacity: 0.5, fontSize: '0.8rem' }}>vs</span> {weeklyStats2.totalMistakes}</h3><p>Total Mistakes</p></div>
                    </div>
                    <div className="glass-panel stat-card" style={{ padding: '0.75rem' }}>
                      <div className="stat-icon warning" style={{ width: '32px', height: '32px' }}><Users size={16} /></div>
                      <div className="stat-info"><h3 style={{ fontSize: '1.1rem' }}>{Object.keys(weeklyStats.specialistMistakes).length} <span style={{ opacity: 0.5, fontSize: '0.8rem' }}>vs</span> {Object.keys(weeklyStats2.specialistMistakes).length}</h3><p>Active Specialists</p></div>
                    </div>
                  </div>
                  <div className="table-scroll-container">
                    <table>
                      <thead>
                        <tr><th>Specialist</th><th>Period 1</th><th>Period 2</th><th>Diff</th></tr>
                      </thead>
                      <tbody>
                        {weeklyComparisonSpecs.map(({ spec, p1, p2, diff }) => (
                          <tr key={spec}>
                            <td style={{ fontWeight: 600 }}>{spec}</td>
                            <td>{p1}</td>
                            <td>{p2}</td>
                            <td style={{ color: diff > 0 ? 'var(--danger)' : diff < 0 ? 'var(--success)' : 'inherit', fontWeight: 700 }}>
                              {diff > 0 ? `+${diff}` : `${diff}`}
                            </td>
                          </tr>
                        ))}
                        {weeklyComparisonSpecs.length === 0 && (
                          <tr><td colSpan={4} style={{ textAlign: 'center', opacity: 0.5 }}>No data to compare</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {compareMode && mistakeComparisonChartData && specialistComparisonChartData && (
                <div className="charts-container">
                  <div className="glass-panel chart-card chart-full-width">
                    <h3>Mistakes Comparison: P1 vs P2</h3>
                    <div style={{ width: '100%', height: '300px', position: 'relative' }}>
                      <Bar data={mistakeComparisonChartData} options={commonOptions} />
                    </div>
                  </div>
                  <div className="glass-panel chart-card chart-full-width">
                    <h3>Specialist Comparison: P1 vs P2</h3>
                    <div style={{ width: '100%', height: '300px', position: 'relative' }}>
                      <Bar data={specialistComparisonChartData} options={commonOptions} />
                    </div>
                  </div>
                </div>
              )}
              <div className="glass-panel card">
                <h3><FileText size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />Detailed Entries</h3>
                <div className="table-scroll-container" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  <table>
                    <thead><tr><th>Date</th><th>Planet</th><th>Specialist</th><th>Creator</th><th>Mistakes</th></tr></thead>
                    <tbody>
                      {[...weeklyFilteredEntries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(e => (
                        <tr key={e.id}>
                          <td>{e.date}</td><td>{e.planet}</td><td>{e.specialist}</td><td>{e.creator}</td>
                          <td style={{ fontSize: '0.85rem' }}>{e.mistakes.join('; ')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="glass-panel card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ margin: 0 }}>Export Report</h3>
                  <p style={{ margin: '0.25rem 0 0', opacity: 0.6, fontSize: '0.85rem' }}>Download weekly data for analysis in Excel or Google Sheets</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn" onClick={() => {
                    const esc = (v: string) => v.includes(',') || v.includes('"') || v.includes('\n') ? '"' + v.replace(/"/g, '""') + '"' : v;
                    const lines: string[] = ['\uFEFF'];
                    const reportTitle = compareMode ? `Weekly Report: ${p1Label} vs ${p2Label}` : `Weekly Report: ${filterDateStart || 'earliest'} to ${filterDateEnd || 'latest'}`;
                    lines.push(reportTitle);
                    lines.push(`Generated: ${new Date().toISOString().split('T')[0]}`);
                    lines.push('');

                    // Summary Statistics
                    const sTotalEntries = compareMode ? weeklyStats.totalEntries + weeklyStats2.totalEntries : weeklyStats.totalEntries;
                    const sTotalMistakes = compareMode ? weeklyStats.totalMistakes + weeklyStats2.totalMistakes : weeklyStats.totalMistakes;
                    const sSpecs = compareMode ? new Set([...Object.keys(weeklyStats.specialistMistakes), ...Object.keys(weeklyStats2.specialistMistakes)]) : new Set(Object.keys(weeklyStats.specialistMistakes));
                    const sCres = compareMode ? new Set([...Object.keys(weeklyStats.creatorMistakes), ...Object.keys(weeklyStats2.creatorMistakes)]) : new Set(Object.keys(weeklyStats.creatorMistakes));
                    const sTopSpec = compareMode ? (() => { const m: Record<string, number> = {}; [...weeklyFilteredEntries, ...weeklyFilteredEntries2].forEach(e => { m[e.specialist] = (m[e.specialist] || 0) + e.mistakes.length; }); return Object.entries(m).sort((a, b) => b[1] - a[1])[0] || null; })() : weeklyStats.topSpecialist;
                    const sTopMist = compareMode ? (() => { const m: Record<string, number> = {}; [...weeklyFilteredEntries, ...weeklyFilteredEntries2].forEach(e => e.mistakes.forEach(mk => { m[mk] = (m[mk] || 0) + 1; })); return Object.entries(m).sort((a, b) => b[1] - a[1])[0] || null; })() : weeklyStats.topMistake;
                    lines.push('=== Summary Statistics ===');
                    lines.push(['Metric', 'Value'].join(','));
                    lines.push(['Total Entries', sTotalEntries].join(','));
                    lines.push(['Total Mistakes', sTotalMistakes].join(','));
                    lines.push(['Unique Specialists', sSpecs.size].join(','));
                    lines.push(['Unique Creators', sCres.size].join(','));
                    if (sTopSpec) lines.push(['Top Specialist', `${sTopSpec[0]} (${sTopSpec[1]} errors)`].join(','));
                    if (sTopMist) lines.push(['Most Common Error', `${sTopMist[0]} (${sTopMist[1]}x)`].join(','));
                    lines.push('');

                    // Consolidated Analysis
                    lines.push(compareMode
                      ? '=== Consolidated Analysis ===, ' + [p1Label + ' Count', p1Label + ' Specialists', p1Label + ' Creators', p2Label + ' Count', p2Label + ' Specialists', p2Label + ' Creators', 'Diff'].join(',')
                      : '=== Consolidated Analysis ===');
                    const caHeaders = compareMode
                      ? ['Mistake', 'Type', 'Color', 'P1 Count', 'P1 Specialists', 'P1 Creators', 'P2 Count', 'P2 Specialists', 'P2 Creators', 'Diff']
                      : ['Mistake', 'Type', 'Color', 'Count', 'Specialists', 'Creators'];
                    lines.push(caHeaders.join(','));
                    consolidatedMistakes.forEach(({ mistake, type, color, p1Count, p1Specs, p1Cres, p2Count, p2Specs, p2Cres, diff }) => {
                      const p1SpecStr = Object.entries(p1Specs).map(([s, c]) => `${s}(${c})`).join('; ');
                      const p1CreStr = Object.entries(p1Cres).map(([cr, c]) => `${cr}(${c})`).join('; ');
                      const colorStr = color === 'red' ? 'Red' : 'Yellow';
                      if (compareMode) {
                        const p2SpecStr = Object.entries(p2Specs).map(([s, c]) => `${s}(${c})`).join('; ');
                        const p2CreStr = Object.entries(p2Cres).map(([cr, c]) => `${cr}(${c})`).join('; ');
                        lines.push([mistake, type, colorStr, p1Count, p1SpecStr, p1CreStr, p2Count, p2SpecStr, p2CreStr, diff].map(v => esc(String(v))).join(','));
                      } else {
                        lines.push([mistake, type, colorStr, p1Count, p1SpecStr, p1CreStr].map(v => esc(String(v))).join(','));
                      }
                    });
                    lines.push('');

                    // Raw Data
                    lines.push('=== Raw Data ===');
                    const rawHeaders = ['Date', 'Planet', 'Specialist', 'Creator', 'Mistake', 'Mistake Type', 'Entry Type'];
                    lines.push(rawHeaders.join(','));
                    const rawEntries = compareMode ? [...weeklyFilteredEntries, ...weeklyFilteredEntries2] : weeklyFilteredEntries;
                    rawEntries.forEach(e => {
                      const type = getEntryType(e, settings);
                      e.mistakes.forEach(m => {
                        const mType = settings.mistakes.find(sm => sm.label === m)?.type || '';
                        const eType = ENTRY_TYPE_LABELS[type] || type;
                        lines.push(rawHeaders.map(h => {
                          const val = h === 'Date' ? e.date : h === 'Planet' ? e.planet : h === 'Specialist' ? e.specialist : h === 'Creator' ? e.creator : h === 'Mistake' ? m : h === 'Mistake Type' ? mType : eType;
                          return esc(val);
                        }).join(','));
                      });
                    });
                    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `weekly_report_${filterDateStart || 'all'}_to_${filterDateEnd || 'all'}.csv`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}>
                    <Download size={16} /> Export CSV
                  </button>
                </div>
              </div>
              {showExpandedTable && (
                <div style={{
                  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                  background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
                  zIndex: 9999, display: 'flex', flexDirection: 'column',
                  padding: '0.5rem', overflow: 'auto'
                }} onClick={() => setShowExpandedTable(false)}>
                  <div style={{
                    background: 'var(--card-bg)', border: '1px solid var(--glass-border)',
                    borderRadius: '12px', padding: '1rem',
                    width: '85vw', maxHeight: '80vh',
                    display: 'flex', flexDirection: 'column',
                    boxShadow: '0 25px 50px rgba(0,0,0,0.3)', margin: 'auto'
                  }} onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Consolidated Analysis {compareMode ? `(${p1Label} vs ${p2Label})` : ''}</h2>
                      <button className="btn btn-sm" onClick={() => setShowExpandedTable(false)}>Close</button>
                    </div>
                    <div style={{ overflow: 'auto' }}>
                      <table>
                        <thead>
                          <tr>
                            <th>Mistake</th>
                            <th>Type</th>
                            <th>Color</th>
                            {compareMode ? (
                              <>
                                <th style={{ background: isDarkMode ? '#1e3a5f' : '#dbeafe' }}>{p1Label}<br />Count</th>
                                <th style={{ background: isDarkMode ? '#1e3a5f' : '#dbeafe' }}>{p1Label}<br />Specialists</th>
                                <th style={{ background: isDarkMode ? '#1e3a5f' : '#dbeafe' }}>{p1Label}<br />Creators</th>
                                <th style={{ background: isDarkMode ? '#3d2e00' : '#fef3c7' }}>{p2Label}<br />Count</th>
                                <th style={{ background: isDarkMode ? '#3d2e00' : '#fef3c7' }}>{p2Label}<br />Specialists</th>
                                <th style={{ background: isDarkMode ? '#3d2e00' : '#fef3c7' }}>{p2Label}<br />Creators</th>
                                <th>Diff</th>
                              </>
                            ) : (
                              <>
                                <th>Count</th>
                                <th>Specialists</th>
                                <th>Creators</th>
                              </>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {consolidatedMistakes.map(({ mistake, type, color, p1Count, p1Specs, p1Cres, p2Count, p2Specs, p2Cres, diff }) => {
                            const typeIdx = ['post', 'pre', 'mod', 'whatsapp'].indexOf(type);
                            const bgColor = ENTRY_TYPE_COLORS[typeIdx] || '#94a3b8';
                            const colorDot = color === 'red' ? '#EF4444' : '#EAB308';
                            return !compareMode ? (
                              <tr key={mistake}>
                                <td style={{ fontSize: '0.85rem' }}>{mistake}</td>
                                <td><span className="badge" style={{ background: bgColor + '33', color: bgColor }}>{ENTRY_TYPE_LABELS[type] || type}</span></td>
                                <td style={{ textAlign: 'center' }}><span style={{ display: 'inline-block', width: '18px', height: '18px', borderRadius: '50%', background: colorDot, verticalAlign: 'middle' }} /></td>
                                <td style={{ textAlign: 'center' }}><span className="badge">{p1Count}</span></td>
                                <td style={{ fontSize: '0.9rem' }}>{Object.entries(p1Specs).map(([s, c], i) => <span key={s}>{i > 0 ? ', ' : ''}{s} <span className="badge">{c}</span></span>)}</td>
                                <td style={{ fontSize: '0.9rem' }}>{Object.entries(p1Cres).map(([cr, c], i) => <span key={cr}>{i > 0 ? ', ' : ''}{cr} <span className="badge">{c}</span></span>)}</td>
                              </tr>
                            ) : (
                              <tr key={mistake}>
                                <td style={{ fontSize: '0.85rem' }}>{mistake}</td>
                                <td><span className="badge" style={{ background: bgColor + '33', color: bgColor }}>{ENTRY_TYPE_LABELS[type] || type}</span></td>
                                <td style={{ textAlign: 'center' }}><span style={{ display: 'inline-block', width: '18px', height: '18px', borderRadius: '50%', background: colorDot, verticalAlign: 'middle' }} /></td>
                                <td style={{ background: isDarkMode ? '#1a2e4a' : '#eff6ff', textAlign: 'center' }}><span className="badge">{p1Count}</span></td>
                                <td style={{ background: isDarkMode ? '#1a2e4a' : '#eff6ff', fontSize: '0.9rem' }}>{Object.entries(p1Specs).map(([s, c], i) => <span key={s}>{i > 0 ? ', ' : ''}{s} <span className="badge">{c}</span></span>)}</td>
                                <td style={{ background: isDarkMode ? '#1a2e4a' : '#eff6ff', fontSize: '0.9rem' }}>{Object.entries(p1Cres).map(([cr, c], i) => <span key={cr}>{i > 0 ? ', ' : ''}{cr} <span className="badge">{c}</span></span>)}</td>
                                <td style={{ background: isDarkMode ? '#2a2000' : '#fffbeb', textAlign: 'center' }}><span className="badge">{p2Count}</span></td>
                                <td style={{ background: isDarkMode ? '#2a2000' : '#fffbeb', fontSize: '0.9rem' }}>{Object.entries(p2Specs).map(([s, c], i) => <span key={s}>{i > 0 ? ', ' : ''}{s} <span className="badge">{c}</span></span>)}</td>
                                <td style={{ background: isDarkMode ? '#2a2000' : '#fffbeb', fontSize: '0.9rem' }}>{Object.entries(p2Cres).map(([cr, c], i) => <span key={cr}>{i > 0 ? ', ' : ''}{cr} <span className="badge">{c}</span></span>)}</td>
                                <td style={{ color: diff > 0 ? 'var(--danger)' : diff < 0 ? 'var(--success)' : 'inherit', fontWeight: 700 }}>{diff > 0 ? `+${diff}` : `${diff}`}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="glass-panel card">
              <div className="empty-state">
                <FileText size={40} />
                <p>No entries found for the selected date range.</p>
                <p style={{ opacity: 0.5, fontSize: '0.85rem' }}>Try selecting a different range or click "All Time" to view all data.</p>
              </div>
            </div>
          )}
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
  onUpdate: (key: keyof Settings, val: string[] | MistakeItem[]) => void,
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
  const [mistakeTypeFilter, setMistakeTypeFilter] = useState<'post' | 'pre' | 'mod' | 'whatsapp'>('post');
  const [mistakeColorFilter, setMistakeColorFilter] = useState<'red' | 'yellow'>('red');
  const [mistakeSearchTerm, setMistakeSearchTerm] = useState('');

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
    if (key === 'mistakes') {
      if (settings.mistakes.some(m => m.label === inputs[field] && m.type === mistakeTypeFilter)) {
        showToast('Entry already exists in this registry.', 'warning');
        return;
      }
      onUpdate('mistakes', [...settings.mistakes, { label: inputs[field], type: mistakeTypeFilter, color: mistakeColorFilter }]);
    } else {
      if ((settings[key] as string[]).includes(inputs[field])) {
        showToast('Entry already exists in this registry.', 'warning');
        return;
      }
      onUpdate(key, [...(settings[key] as string[]), inputs[field]].sort((a, b) => a.localeCompare(b)));
    }
    setInputs({ ...inputs, [field]: '' });
    showToast(`${key} added successfully!`, 'success');
  };

  const removeItem = () => {
    if (registryToDelete) {
      const key = registryToDelete.key;
      const val = registryToDelete.val;
      setRegistryToDelete(null);
      if (key === 'mistakes') {
        onUpdate('mistakes', settings.mistakes.filter(m => m.label !== val));
      } else {
        onUpdate(key, (settings[key] as string[]).filter(v => v !== val));
      }
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
    
    if (key === 'mistakes') {
      const updated = settings.mistakes.map(m =>
        m.label === oldVal ? { ...m, label: trimmedVal } : m
      );
      await onUpdate('mistakes', updated);
    } else {
      const updated = (settings[key] as string[]).map(v =>
        v === oldVal ? trimmedVal : v
      );
      await onUpdate(key, updated);
    }
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
          <SettingsIcon size={18} /> Configuration
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
            <div className="glass-panel card" style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Mistake Registry</h3>
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                <select
                  value={mistakeTypeFilter}
                  onChange={e => setMistakeTypeFilter(e.target.value as 'post' | 'pre' | 'mod' | 'whatsapp')}
                  style={{ padding: '0.75rem', fontSize: '1rem', flex: '0 0 auto', width: 'auto' }}>
                  <option value="post">POST</option>
                  <option value="pre">PRE</option>
                  <option value="mod">MODERATION</option>
                  <option value="whatsapp">WHATSAPP</option>
                </select>
                <div style={{ display: 'flex', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                  <button
                    type="button"
                    onClick={() => setMistakeColorFilter('red')}
                    style={{
                      padding: '0.75rem 1rem',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                      background: mistakeColorFilter === 'red' ? '#EF4444' : 'transparent',
                      color: mistakeColorFilter === 'red' ? 'white' : '#EF4444',
                      border: mistakeColorFilter === 'red' ? '2px solid #EF4444' : '2px solid #EF4444',
                      transition: 'all 0.2s'
                    }}
                  >
                    RED
                  </button>
                  <button
                    type="button"
                    onClick={() => setMistakeColorFilter('yellow')}
                    style={{
                      padding: '0.75rem 1rem',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                      background: mistakeColorFilter === 'yellow' ? '#EAB308' : 'transparent',
                      color: mistakeColorFilter === 'yellow' ? 'white' : '#EAB308',
                      border: mistakeColorFilter === 'yellow' ? '2px solid #EAB308' : '2px solid #EAB308',
                      transition: 'all 0.2s'
                    }}
                  >
                    YELLOW
                  </button>
                </div>
                <input 
                  placeholder="Add mistake..."
                  value={inputs.mistake}
                  onChange={e => setInputs({...inputs, mistake: e.target.value})}
                  style={{ padding: '0.75rem', fontSize: '1rem', flex: 1 }}
                />
                <button onClick={() => addItem('mistakes', 'mistake')} style={{ padding: '0.75rem 1rem' }}><Plus size={18} /></button>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                  <input 
                    placeholder={`Search ${mistakeTypeFilter.toUpperCase()} mistakes...`}
                    value={mistakeSearchTerm}
                    onChange={e => setMistakeSearchTerm(e.target.value)}
                    style={{ padding: '0.75rem 0.75rem 0.75rem 2.2rem', fontSize: '1rem', width: '100%' }}
                  />
                </div>
                <div style={{ display: 'flex', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                  <button
                    type="button"
                    onClick={() => setMistakeColorFilter('red')}
                    style={{
                      padding: '0.5rem 1rem',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                      background: mistakeColorFilter === 'red' ? '#EF4444' : 'transparent',
                      color: mistakeColorFilter === 'red' ? 'white' : '#EF4444',
                      border: '2px solid #EF4444',
                      transition: 'all 0.2s'
                    }}
                  >
                    RED
                  </button>
                  <button
                    type="button"
                    onClick={() => setMistakeColorFilter('yellow')}
                    style={{
                      padding: '0.5rem 1rem',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                      background: mistakeColorFilter === 'yellow' ? '#EAB308' : 'transparent',
                      color: mistakeColorFilter === 'yellow' ? 'white' : '#EAB308',
                      border: '2px solid #EAB308',
                      transition: 'all 0.2s'
                    }}
                  >
                    YELLOW
                  </button>
                </div>
              </div>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {settings.mistakes
                  .filter(m => m.type === mistakeTypeFilter)
                  .filter(m => m.label.toLowerCase().includes(mistakeSearchTerm.toLowerCase()))
                  .filter(m => m.color === mistakeColorFilter)
                  .map(m => (
                  <div key={m.label + '-' + m.color} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: m.color === 'red' ? '#EF4444' : '#EAB308',
                        flexShrink: 0
                      }} />
                      {m.label}
                    </span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => setEditRegistryItem({ key: 'mistakes', oldVal: m.label, newVal: m.label })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)' }}>
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => setRegistryToDelete({ key: 'mistakes', val: m.label })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e74c3c' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
                  onChange={e => setPasswordForm({...passwordForm, target: e.target.value as 'analysis' | 'settings'})}
                >
                  <option value="analysis">Analysis Page</option>
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
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'input' | 'analysis' | 'settings' | 'pre-webinar' | 'moderation' | 'whatsapp'>('dashboard');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [entries, setEntries] = useState<Entry[]>(() => {
    try {
      const cached = localStorage.getItem('cached_webinar_entries');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const yellowLookup = new Set(
    INITIAL_SETTINGS.mistakes.filter(m => m.color === 'yellow').map(m => m.label + '||' + m.type)
  );

  const enrichMistakeColor = (m: { label: string; type?: string; color?: string }): MistakeItem => ({
    label: m.label,
    type: (m.type as MistakeItem['type']) || 'post',
    color: m.color || (yellowLookup.has(m.label + '||' + (m.type || 'post')) ? 'yellow' : 'red')
  });

  const migrateMistakes = (data: unknown): MistakeItem[] => {
    if (!Array.isArray(data)) return INITIAL_SETTINGS.mistakes;
    if (data.length > 0 && typeof data[0] === 'string') {
      return data.map((m: string) => {
        try {
          const parsed = JSON.parse(m);
          if (parsed && parsed.label && parsed.type) return enrichMistakeColor(parsed);
        } catch { /* ignore parse errors */ }
        return { label: m, type: 'post', color: 'red' };
      });
    }
    return (data as any[]).map(m => enrichMistakeColor(m));
  };

  const ensureColorField = (data: MistakeItem[]): MistakeItem[] =>
    data.map(m => m.color ? m : enrichMistakeColor(m));

  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const cached = localStorage.getItem('cached_webinar_settings');
      if (!cached) return INITIAL_SETTINGS;
      const parsed = JSON.parse(cached);
      if (parsed.mistakes && Array.isArray(parsed.mistakes) && parsed.mistakes.length > 0) {
        if (typeof parsed.mistakes[0] === 'string') {
          parsed.mistakes = migrateMistakes(parsed.mistakes);
          try { localStorage.setItem('cached_webinar_settings', JSON.stringify(parsed)); } catch { /* storage full */ }
        } else if (!parsed.mistakes[0].color) {
          parsed.mistakes = ensureColorField(parsed.mistakes);
          try { localStorage.setItem('cached_webinar_settings', JSON.stringify(parsed)); } catch { /* storage full */ }
        }
      }
      if (parsed.specialists) parsed.specialists = [...parsed.specialists].sort((a, b) => a.localeCompare(b));
      if (parsed.creators) parsed.creators = [...parsed.creators].sort((a, b) => a.localeCompare(b));
      return parsed;
    } catch {
      return INITIAL_SETTINGS;
    }
  });
  const [security, setSecurity] = useState<SecuritySettings>(() => {
    try {
      const cached = localStorage.getItem('cached_webinar_security');
      return cached ? JSON.parse(cached) : INITIAL_SECURITY;
    } catch {
      return INITIAL_SECURITY;
    }
  });
  const [isLoading, setIsLoading] = useState(() => {
    try {
      const hasEntries = localStorage.getItem('cached_webinar_entries');
      const hasSettings = localStorage.getItem('cached_webinar_settings');
      return !(hasEntries && hasSettings);
    } catch {
      return true;
    }
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('app_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [user, setUser] = useState<any>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

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
      const hasEntries = localStorage.getItem('cached_webinar_entries');
      const hasSettings = localStorage.getItem('cached_webinar_settings');
      if (!hasEntries || !hasSettings) {
        setIsLoading(true);
      }
      try {
        const [entriesRes, settingsRes, securityRes] = await Promise.all([
          supabase
            .from('webinar_entries')
            .select('*')
            .order('date', { ascending: false }),
          supabase
            .from('webinar_settings')
            .select('*')
            .single(),
          supabase
            .from('webinar_security')
            .select('*')
            .single()
        ]);

        if (entriesRes.data) {
          setEntries(entriesRes.data);
          try {
            localStorage.setItem('cached_webinar_entries', JSON.stringify(entriesRes.data));
          } catch (err) {
            console.error('Failed to cache entries:', err);
          }
        }

        if (settingsRes.data) {
          const freshSettings = {
            planets: settingsRes.data.planets,
            specialists: settingsRes.data.specialists,
            creators: settingsRes.data.creators,
            mistakes: migrateMistakes(settingsRes.data.mistakes)
          };
          setSettings(freshSettings);
          try {
            localStorage.setItem('cached_webinar_settings', JSON.stringify(freshSettings));
          } catch (err) {
            console.error('Failed to cache settings:', err);
          }
        }

        if (securityRes.data) {
          const freshSecurity = {
            passwords: securityRes.data.passwords,
            history: securityRes.data.history || []
          };
          setSecurity(freshSecurity);
          try {
            localStorage.setItem('cached_webinar_security', JSON.stringify(freshSecurity));
          } catch (err) {
            console.error('Failed to cache security:', err);
          }
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
            setEntries(prev => {
              const updated = [payload.new as Entry, ...prev];
              try {
                localStorage.setItem('cached_webinar_entries', JSON.stringify(updated));
              } catch (err) {
                console.error('Failed to cache entries:', err);
              }
              return updated;
            });
          } else if (payload.eventType === 'UPDATE') {
            setEntries(prev => {
              const updated = prev.map(e => e.id === payload.new.id ? (payload.new as Entry) : e);
              try {
                localStorage.setItem('cached_webinar_entries', JSON.stringify(updated));
              } catch (err) {
                console.error('Failed to cache entries:', err);
              }
              return updated;
            });
          } else if (payload.eventType === 'DELETE') {
            setEntries(prev => {
              const updated = prev.filter(e => e.id !== payload.old.id);
              try {
                localStorage.setItem('cached_webinar_entries', JSON.stringify(updated));
              } catch (err) {
                console.error('Failed to cache entries:', err);
              }
              return updated;
            });
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'webinar_settings' },
        (payload) => {
          if (payload.new) {
            setSettings(prev => {
              const updated = {
                planets: Array.isArray(payload.new.planets) ? payload.new.planets : prev.planets,
                specialists: Array.isArray(payload.new.specialists) ? payload.new.specialists : prev.specialists,
                creators: Array.isArray(payload.new.creators) ? payload.new.creators : prev.creators,
                mistakes: Array.isArray(payload.new.mistakes) ? migrateMistakes(payload.new.mistakes) : prev.mistakes
              };
              try {
                localStorage.setItem('cached_webinar_settings', JSON.stringify(updated));
              } catch (err) {
                console.error('Failed to cache settings:', err);
              }
              return updated;
            });
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'webinar_security' },
        (payload) => {
          if (payload.new && payload.new.passwords) {
            setSecurity(() => {
              const updated = {
                passwords: payload.new.passwords,
                history: payload.new.history || []
              };
              try {
                localStorage.setItem('cached_webinar_security', JSON.stringify(updated));
              } catch (err) {
                console.error('Failed to cache security:', err);
              }
              return updated;
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
            parsed.map((e: Record<string, unknown>) => ({
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

  // Auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setShowLoginModal(false);
    showToast('Admin login successful!', 'success');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    showToast('Logged out successfully.', 'info');
  };

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
    setEntries(prev => prev.filter(e => e.id !== id));
    const { error } = await supabase
      .from('webinar_entries')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Delete entry error:', error.message);
      showToast('Error deleting entry.', 'error');
    }
  };

  const updateSettings = async (key: keyof Settings, value: string[] | MistakeItem[]) => {
    const previousSettings = settings;
    const sorted = key !== 'mistakes' && Array.isArray(value) ? [...value].sort((a, b) => a.localeCompare(b)) : value;
    setSettings(prev => ({ ...prev, [key]: sorted }));
    
    const { data, error } = await supabase
      .from('webinar_settings')
      .update({ [key]: sorted })
      .eq('id', 1)
      .select();
    
    if (error || !data || data.length === 0) {
      console.error('Update settings error:', error?.message || 'No rows updated. Check database RLS policies.');
      showToast('Settings not saved! (DB Write Blocked)', 'error');
      // Revert local state if DB update failed
      setSettings(previousSettings);
    }
  };

  const updatePasswords = async (target: 'analysis' | 'settings', newPass: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      showToast('You must be logged in to change security settings.', 'error');
      return;
    }

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

    const { data, error } = await supabase
      .from('webinar_security')
      .update({ 
        passwords: newPasswords,
        history: newHistory
      })
      .eq('id', 1)
      .select();

    if (error) {
      console.error('Update passwords error:', error.message);
      showToast(`Security settings not saved! ${error.message}`, 'error');
    } else if (!data || data.length === 0) {
      console.error('No rows updated. Check database RLS policies.');
      showToast('Security settings not saved! (DB Write Blocked)', 'error');
    } else {
      setSecurity({
        passwords: newPasswords,
        history: newHistory
      });
      showToast('Password updated successfully!', 'success');
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
    } catch {
      showToast('Error importing file.', 'error');
    }
  };

  // Auto-expand prep section when on entry pages
  useEffect(() => {
    if (['pre-webinar', 'input'].includes(currentPage)) {
      setExpandedSection('prep');
    }
  }, [currentPage]);

  const handleNavigate = (page: string) => {
    setCurrentPage(page as 'dashboard' | 'input' | 'analysis' | 'settings' | 'pre-webinar' | 'moderation' | 'whatsapp');
    setSidebarOpen(false);
    if (!['pre-webinar', 'input'].includes(page)) {
      setExpandedSection(null);
    }
  };

  return (
    <div className="layout">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <img src={Logo} alt="Logo" style={{ width: '40px', height: '40px' }} />
            <span>Webinar Mistake Analysis</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div
            className={`nav-item ${currentPage === 'dashboard' && !expandedSection ? 'active' : ''}`}
            onClick={() => handleNavigate('dashboard')}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </div>
          <div className="nav-section">
            <div
              className={`nav-item ${['pre-webinar', 'input'].includes(currentPage) || expandedSection === 'prep' ? 'active' : ''}`}
              onClick={() => setExpandedSection(expandedSection === 'prep' ? null : 'prep')}
              style={{ cursor: 'pointer' }}
            >
              <FileInput size={20} />
              <span>Preparation New Entry</span>
              <ChevronDown
                size={16}
                style={{ marginLeft: 'auto', transition: 'transform 0.2s', transform: expandedSection === 'prep' ? 'rotate(180deg)' : '' }}
              />
            </div>
            {expandedSection === 'prep' && (
              <div className="nav-submenu">
                <div className={`nav-subitem ${currentPage === 'pre-webinar' ? 'active' : ''}`} onClick={() => handleNavigate('pre-webinar')}>Pre Webinar</div>
                <div className={`nav-subitem ${currentPage === 'input' ? 'active' : ''}`} onClick={() => handleNavigate('input')}>Post Webinar</div>
              </div>
            )}
          </div>
          <div
            className={`nav-item ${currentPage === 'moderation' && !expandedSection ? 'active' : ''}`}
            onClick={() => handleNavigate('moderation')}
          >
            <Activity size={20} />
            <span>Moderation New Entry</span>
          </div>
          <div
            className={`nav-item ${currentPage === 'whatsapp' && !expandedSection ? 'active' : ''}`}
            onClick={() => handleNavigate('whatsapp')}
          >
            <AlertTriangle size={20} />
            <span>Whatsapp Errors New Entry</span>
          </div>
          <div
            className={`nav-item ${currentPage === 'analysis' && !expandedSection ? 'active' : ''}`}
            onClick={() => handleNavigate('analysis')}
          >
            <BarChart3 size={20} />
            <span>Analysis</span>
          </div>
          {user ? (
            <div
              className={`nav-item ${currentPage === 'settings' && !expandedSection ? 'active' : ''}`}
              onClick={() => handleNavigate('settings')}
            >
              <SettingsIcon size={20} />
              <span>Settings</span>
            </div>
          ) : (
            <div
              className="nav-item"
              onClick={() => setShowLoginModal(true)}
            >
              <Lock size={20} />
              <span>Admin Login</span>
            </div>
          )}
        </nav>

        <div className="sidebar-footer" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {user && (
            <button className="logout-btn" onClick={handleLogout}>
              <Lock size={16} />
              <div className="logout-text">
                <span>Logout</span>
                <span className="logout-email">{user.email}</span>
              </div>
            </button>
          )}
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
        <div className="logo-container" style={{ fontSize: '0.95rem' }}>
          <img src={Logo} alt="Logo" style={{ width: '28px', height: '28px' }} />
          <span style={{ marginLeft: '0.5rem' }}>WMA</span>
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
              {currentPage === 'dashboard' && <DashboardPage entries={entries} />}
              
              {currentPage === 'input' && <DataInputPage settings={settings} onSave={addEntry} />}
              
              {currentPage === 'pre-webinar' && <PreWebinarInputPage settings={settings} onSave={addEntry} />}
              
              {currentPage === 'moderation' && <ModerationInputPage settings={settings} onSave={addEntry} />}
              
              {currentPage === 'whatsapp' && <WhatsappInputPage settings={settings} onSave={addEntry} />}
              
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

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal
          onLogin={handleLogin}
          onCancel={() => setShowLoginModal(false)}
        />
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
