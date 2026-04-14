export interface Entry {
  id: string;
  date: string;
  planet: string;
  specialist: string;
  creator: string;
  mistakes: string[]; // List of mistakes (Mistake 1, 2, 3)
}

export interface Settings {
  specialists: string[];
  creators: string[];
  mistakes: string[];
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
