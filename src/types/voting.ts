export type VoterRole = 'staff' | 'hod';

export type ElectionPosition = 
  | 'vice_president' 
  | 'secretary' 
  | 'joint_secretary' 
  | 'associate_secretary' 
  | 'joint_treasurer';

export interface Voter {
  id: string;
  name?: string;
  role: VoterRole;
  created_at: string;
}

export interface Candidate {
  id: string;
  name: string;
  position: ElectionPosition;
  created_at: string;
}

export interface Vote {
  id: string;
  voter_id: string;
  candidate_id: string;
  position: ElectionPosition;
  points: number;
  created_at: string;
}

export interface VotingSession {
  role: VoterRole;
  voterName?: string;
  voterId?: string;
  selections: Record<ElectionPosition, string>;
}

export const POSITION_LABELS: Record<ElectionPosition, string> = {
  vice_president: 'Vice President',
  secretary: 'Secretary',
  joint_secretary: 'Joint Secretary',
  associate_secretary: 'Associate Secretary',
  joint_treasurer: 'Joint Treasurer',
};

export const POSITION_ORDER: ElectionPosition[] = [
  'vice_president',
  'secretary', 
  'joint_secretary',
  'associate_secretary',
  'joint_treasurer',
];