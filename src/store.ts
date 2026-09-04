import { Submission } from './types';

const STORAGE_KEY = 'curedame_submissions';

export const getSubmissions = (): Submission[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};


export const saveSubmission = async (submission: Submission) => {
  const submissions = getSubmissions();
  const index = submissions.findIndex(s => s.id === submission.id);
  if (index >= 0) {
    submissions[index] = submission;
  } else {
    submissions.push(submission);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
};

export const updateComment = (submissionId: string, questionId: string, comment: string) => {
  const submissions = getSubmissions();
  const submission = submissions.find(s => s.id === submissionId);
  if (submission) {
    if (!submission.comments) submission.comments = {};
    submission.comments[questionId] = comment;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
  }
};

export const startInterview = (submissionId: string, pastorName: string) => {
  const submissions = getSubmissions();
  const submission = submissions.find(s => s.id === submissionId);
  if (submission) {
    submission.status = 'interviewing';
    submission.interviewerName = pastorName;
    submission.interviewDate = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
  }
};

export const updateGlobalObservations = (submissionId: string, observations: string) => {
  const submissions = getSubmissions();
  const submission = submissions.find(s => s.id === submissionId);
  if (submission) {
    submission.globalObservations = observations;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
  }
};

export const completeInterview = (submissionId: string) => {
  const submissions = getSubmissions();
  const submission = submissions.find(s => s.id === submissionId);
  if (submission) {
    submission.status = 'completed';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
  }
};

export const assignInterview = (submissionId: string, newPastorName: string) => {
  const submissions = getSubmissions();
  const submission = submissions.find(s => s.id === submissionId);
  if (submission) {
    submission.interviewerName = newPastorName;
    if (submission.status === 'new' || !submission.status) {
      submission.status = 'interviewing';
      submission.interviewDate = new Date().toISOString();
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
  }
};
