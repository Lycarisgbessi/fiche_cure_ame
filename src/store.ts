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
  // To avoid overriding all comments, we might need to fetch first, but let's assume we send the delta
  // or we can fetch current, merge, and send.
  // Actually the API accepts a `comments` object. We can just send the updated `comments` object from the component.
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
