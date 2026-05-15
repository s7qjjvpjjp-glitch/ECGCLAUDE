export interface CatarinaAge {
  totalDays: number;
  months: number;
  weeks: number;
  remainingDays: number;
  label: string;
}

export type DevelopmentDomain = 'motor' | 'cognitive' | 'social' | 'language';

export interface Milestone {
  id: string;
  domain: DevelopmentDomain;
  title: string;
  description: string;
  howToStimulate: string;
}

export interface MonthMilestones {
  month: number;
  motor: Milestone[];
  cognitive: Milestone[];
  social: Milestone[];
  language: Milestone[];
  tips: string[];
  summary: string;
}

export type NutritionPhase =
  | 'exclusive_breastfeeding'
  | 'complementary_start'
  | 'complementary_progressing'
  | 'complementary_advanced'
  | 'family_food_transition'
  | 'family_food';

export interface FoodItem {
  name: string;
  emoji: string;
  notes?: string;
}

export interface NutritionGuide {
  month: number;
  phase: NutritionPhase;
  phaseLabel: string;
  summary: string;
  breastfeedingNote: string;
  mealsPerDay: number;
  allowed: FoodItem[];
  introduce: FoodItem[];
  avoid: FoodItem[];
  portions: string;
  texture: string;
}

export type VaccineStatus = 'done' | 'due' | 'upcoming' | 'overdue';

export interface VaccineEvent {
  id: string;
  name: string;
  fullName: string;
  ageMonths: number;
  ageLabel: string;
  description: string;
  susProvided: boolean;
  gracePeriodDays: number;
  doses?: string;
}

export interface VaccineRecord {
  vaccineId: string;
  doneAt: string;
  note?: string;
}

export interface VaccineWithStatus extends VaccineEvent {
  status: VaccineStatus;
  dueDate: Date;
  doneAt?: string;
}

export type MaterialType = 'link' | 'note';

export interface Material {
  id: string;
  type: MaterialType;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

export interface NotificationPreferences {
  enabled: boolean;
  permissionState: 'default' | 'granted' | 'denied';
  subscribedAt?: string;
  vaccineReminderDaysBefore: number;
}

export interface AppState {
  vaccines: VaccineRecord[];
  materials: Material[];
  notifications: NotificationPreferences;
  lastVisited: string;
}
