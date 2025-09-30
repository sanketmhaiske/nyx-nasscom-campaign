import { LucideIcon } from 'lucide-react';

export interface SubStep {
  name: string;
  status: 'pending' | 'running' | 'completed' | 'error';
}

export interface WorkflowStep {
  name: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  subSteps: SubStep[];
  type: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  activeInstances: number;
  successRate: number;
  completedCount: number;
  steps: WorkflowStep[];
}

export interface WorkflowCardProps {
  workflow: Workflow;
}

export interface CreativeAsset {
  url: string;
  aspectRatio: string;
  type: 'image' | 'video';
  name: string;
  size: string;
  dimensions: string;
}

export interface GeneratedContent {
  headlines: string[];
  descriptions: string[];
  captions: string[];
}

export interface CampaignConfig {
  name: string;
  brandPersona: string;
  targetDemographic: {
    ageRange: { min: number; max: number };
    gender: string[];
    locations: string[];
  };
  adPlatforms: {
    [key: string]: { selected: boolean; budget: number };
  };
  budget: {
    total: number;
    currency: string;
  };
  dates: {
    start: string;
    end: string;
  };
}

export type WorkflowStepStatus = 'pending' | 'running' | 'completed' | 'error';

export interface StepType {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  subSteps: { name: string; status: WorkflowStep['status'] }[];
  type: string;
}
