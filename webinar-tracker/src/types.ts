export interface MistakeItem {
  label: string;
  type: 'post' | 'pre' | 'mod' | 'whatsapp';
  color: 'red' | 'yellow';
}

export interface Entry {
  id: string;
  date: string;
  planet: string;
  specialist: string;
  creator: string;
  mistakes: string[];
}

export interface Settings {
  specialists: string[];
  creators: string[];
  mistakes: MistakeItem[];
  planets: string[];
}

export interface SecurityRecord {
  id: string;
  date: string;
  target: 'analysis' | 'settings';
  lastPassword: string;
  newPassword: string;
}

export interface SecuritySettings {
  passwords: {
    analysis: string;
    settings: string;
  };
  history: SecurityRecord[];
}
