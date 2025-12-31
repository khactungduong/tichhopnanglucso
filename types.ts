
export enum ProcessingMode {
  AUTO = 'AUTO',
  MANUAL = 'MANUAL'
}

export interface DigitalCompetency {
  id: string;
  name: string;
  indicators: {
    code: string;
    description: string;
  }[];
}

export interface LessonPlanData {
  title: string;
  content: string;
}

export interface IntegrationResult {
  markdown: string;
  originalText: string;
}
