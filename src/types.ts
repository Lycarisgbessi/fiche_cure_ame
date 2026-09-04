export type QuestionType =
  | 'text'
  | 'textarea'
  | 'radio'
  | 'multi-select'
  | 'yes-no-details'
  | 'yes-no-who';

export interface Question {
  id: string;
  label: string;
  type: QuestionType;
  options?: string[];
  placeholder?: string;
}

export interface Section {
  id: string;
  title: string;
  description?: string | string[];
  questions: Question[];
}

export interface Submission {
  id: string;
  date: string;
  faithfulName: string;
  answers: Record<string, any>;
  comments: Record<string, string>;
  status: 'new' | 'interviewing' | 'completed';
  interviewerName?: string;
  globalObservations?: string;
  interviewDate?: string;
}
