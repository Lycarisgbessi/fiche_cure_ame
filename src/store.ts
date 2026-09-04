import { Submission } from './types';

export const getSubmissions = async (): Promise<Submission[]> => {
  const res = await fetch('/api/submissions');
  if (!res.ok) return [];
  return res.json();
};

export const addSubmission = async (submission: Submission) => {
  const res = await fetch('/api/submissions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(submission)
  });
  return res.json();
};

export const updateComment = async (submissionId: string, questionId: string, text: string) => {
  
};

export const startInterview = async (submissionId: string, pastorName: string) => {
  await fetch('/api/submissions', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: submissionId,
      status: 'interviewing',
      interviewerName: pastorName
    })
  });
};

export const completeInterview = async (submissionId: string) => {
  await fetch('/api/submissions', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: submissionId,
      status: 'completed'
    })
  });
};

export const assignInterview = async (submissionId: string, newPastorName: string) => {
  await fetch('/api/submissions', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: submissionId,
      interviewerName: newPastorName,
      status: 'interviewing'
    })
  });
};

export const getUsers = async () => {
  const r = await fetch('/api/users');
  return r.json();
};

export const createUser = async (data: any) => {
  const r = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return r;
};

export const updateGlobalObservations = async (id: string, obs: string) => {
  await fetch('/api/submissions', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, globalObservations: obs })
  });
};