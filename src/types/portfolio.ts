export type HotspotActionType =
  | 'scroll'
  | 'mailto'
  | 'tel'
  | 'external'
  | 'modal-event'
  | 'modal-scenario'
  | 'modal-contact'
  | 'modal-research';

export interface HotspotItem {
  id: string;
  /** Bounding box as percentages (0–100) relative to the section slice */
  x: number;
  y: number;
  width: number;
  height: number;
  /** Short title shown in the cursor-following link preview */
  title: string;
  /** Subtitle / role / context shown under the title */
  subtitle: string;
  /** Exact URL or link label displayed in the floating cursor pill */
  linkText: string;
  /** Action triggered on click */
  actionType: HotspotActionType;
  /** Target section ID, URL, email, phone, or modal content ID */
  target: string;
  /** Accent style for hover highlight */
  variant?: 'crimson' | 'dark' | 'light';
}

export interface PortfolioSectionConfig {
  id: string;
  navId?: string;
  title: string;
  imageSrc: string;
  width: number;
  height: number;
  /** Whether this slice starts with a horizontal ticker ribbon that can animate live */
  hasTopRibbon?: boolean;
  /** Top ribbon height in % of the slice */
  topRibbonHeightPct?: number;
  hotspots: HotspotItem[];
}

export interface ModalDetailContent {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  role: string;
  timeline?: string;
  metrics?: { label: string; value: string }[];
  highlights: string[];
  deliverables?: string[];
  partners?: string[];
  previewUrlLabel?: string;
  externalUrl?: string;
}

export interface ScenarioChallenge {
  id: 'business' | 'hr' | 'legal';
  name: string;
  badge: string;
  prompt: string;
  options: {
    id: string;
    label: string;
    isOptimal: boolean;
    feedback: string;
  }[];
}
