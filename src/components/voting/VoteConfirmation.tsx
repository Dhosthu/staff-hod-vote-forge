import { CheckCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type VotingSession } from '@/types/voting';

interface VoteConfirmationProps {
  session: VotingSession;
  onStartOver: () => void;
}

export const VoteConfirmation = ({ session, onStartOver }: VoteConfirmationProps) => {
  const voteWeight = session.role === 'hod' ? 50 : 30;
  const totalPositions = Object.keys(session.selections).length;
  const totalPoints = totalPositions * voteWeight;

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <div className="mx-auto mb-6 p-4 bg-green-100 rounded-full w-fit">
          <CheckCircle className="w-16 h-16 text-green-600" />
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Votes Submitted Successfully!
        </h1>
        <p className="text-xl text-muted-foreground">
          Thank you for participating in the student elections
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Vote Summary</CardTitle>
          <CardDescription>Your contribution to the election</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{totalPositions}</p>
              <p className="text-sm text-muted-foreground">Positions Voted</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{voteWeight}</p>
              <p className="text-sm text-muted-foreground">Points Per Vote</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{totalPoints}</p>
              <p className="text-sm text-muted-foreground">Total Points Cast</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <p className="text-lg text-muted-foreground">
          Your votes have been securely recorded and will be counted towards the final results.
        </p>
        
        <div className="bg-muted p-6 rounded-lg">
          <h3 className="font-semibold mb-2">Important Notes:</h3>
          <ul className="text-sm text-muted-foreground space-y-1 text-left">
            <li>• Your votes are final and cannot be changed</li>
            <li>• Each voter can only vote once per position</li>
            <li>• Results will be announced after the voting period ends</li>
            <li>• All votes are confidential and secure</li>
          </ul>
        </div>

        <Button 
          variant="outline" 
          onClick={onStartOver}
          className="mt-8"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Start New Voting Session
        </Button>
      </div>
    </div>
  );
};