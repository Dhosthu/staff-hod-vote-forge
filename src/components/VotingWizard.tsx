import { useState } from 'react';
import { RoleSelection } from './voting/RoleSelection';
import { NameEntry } from './voting/NameEntry';
import { PositionVoting } from './voting/PositionVoting';
import { VoteReview } from './voting/VoteReview';
import { VoteConfirmation } from './voting/VoteConfirmation';
import { type VotingSession, type VoterRole, type ElectionPosition, POSITION_ORDER } from '@/types/voting';

export const VotingWizard = () => {
  const [currentStep, setCurrentStep] = useState<'role' | 'name' | 'voting' | 'review' | 'confirmation'>('role');
  const [currentPositionIndex, setCurrentPositionIndex] = useState(0);
  const [session, setSession] = useState<VotingSession>({
    role: 'staff',
    selections: {} as Record<ElectionPosition, string>,
  });

  const handleRoleSelect = (role: VoterRole) => {
    setSession({ ...session, role });
    if (role === 'hod') {
      setCurrentStep('voting');
    } else {
      setCurrentStep('name');
    }
  };

  const handleNameSubmit = (name: string) => {
    setSession({ ...session, voterName: name });
    setCurrentStep('voting');
  };

  const handleVoteSelect = (candidateId: string) => {
    const position = POSITION_ORDER[currentPositionIndex];
    const newSelections = { ...session.selections, [position]: candidateId };
    setSession({ ...session, selections: newSelections });
    
    if (currentPositionIndex < POSITION_ORDER.length - 1) {
      setCurrentPositionIndex(currentPositionIndex + 1);
    } else {
      setCurrentStep('review');
    }
  };

  const handleBack = () => {
    if (currentStep === 'voting' && currentPositionIndex > 0) {
      setCurrentPositionIndex(currentPositionIndex - 1);
    } else if (currentStep === 'voting' && currentPositionIndex === 0) {
      if (session.role === 'staff') {
        setCurrentStep('name');
      } else {
        setCurrentStep('role');
      }
    } else if (currentStep === 'name') {
      setCurrentStep('role');
    } else if (currentStep === 'review') {
      setCurrentPositionIndex(POSITION_ORDER.length - 1);
      setCurrentStep('voting');
    }
  };

  const handleEditPosition = (position: ElectionPosition) => {
    const index = POSITION_ORDER.indexOf(position);
    setCurrentPositionIndex(index);
    setCurrentStep('voting');
  };

  const handleSubmitVotes = async (voterId: string) => {
    setSession({ ...session, voterId });
    setCurrentStep('confirmation');
  };

  const handleStartOver = () => {
    setCurrentStep('role');
    setCurrentPositionIndex(0);
    setSession({
      role: 'staff',
      selections: {} as Record<ElectionPosition, string>,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        {currentStep === 'role' && (
          <RoleSelection onRoleSelect={handleRoleSelect} />
        )}
        
        {currentStep === 'name' && (
          <NameEntry 
            onNameSubmit={handleNameSubmit}
            onBack={handleBack}
          />
        )}
        
        {currentStep === 'voting' && (
          <PositionVoting
            position={POSITION_ORDER[currentPositionIndex]}
            currentPosition={currentPositionIndex + 1}
            totalPositions={POSITION_ORDER.length}
            selectedCandidateId={session.selections[POSITION_ORDER[currentPositionIndex]]}
            onVoteSelect={handleVoteSelect}
            onBack={handleBack}
          />
        )}
        
        {currentStep === 'review' && (
          <VoteReview
            session={session}
            onBack={handleBack}
            onEditPosition={handleEditPosition}
            onSubmit={handleSubmitVotes}
          />
        )}
        
        {currentStep === 'confirmation' && (
          <VoteConfirmation
            session={session}
            onStartOver={handleStartOver}
          />
        )}
      </div>
    </div>
  );
};