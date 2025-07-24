import { useState, useEffect } from 'react';
import { ArrowLeft, Edit, User, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { type VotingSession, type Candidate, type ElectionPosition, POSITION_LABELS, POSITION_ORDER } from '@/types/voting';
import { useToast } from '@/hooks/use-toast';

interface VoteReviewProps {
  session: VotingSession;
  onBack: () => void;
  onEditPosition: (position: ElectionPosition) => void;
  onSubmit: (voterId: string) => Promise<void>;
}

export const VoteReview = ({ session, onBack, onEditPosition, onSubmit }: VoteReviewProps) => {
  const [candidates, setCandidates] = useState<Record<string, Candidate>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const candidateIds = Object.values(session.selections);
        if (candidateIds.length === 0) return;

        const { data, error } = await supabase
          .from('candidates')
          .select('*')
          .in('id', candidateIds);

        if (error) throw error;
        
        const candidateMap = (data || []).reduce((acc, candidate) => {
          acc[candidate.id] = candidate;
          return acc;
        }, {} as Record<string, Candidate>);
        
        setCandidates(candidateMap);
      } catch (error) {
        console.error('Error fetching candidates:', error);
        toast({
          title: "Error",
          description: "Failed to load candidate information.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [session.selections, toast]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Create voter record
      const { data: voterData, error: voterError } = await supabase
        .from('voters')
        .insert({
          name: session.voterName,
          role: session.role,
        })
        .select()
        .single();

      if (voterError) throw voterError;

      // Create vote records
      const points = session.role === 'hod' ? 50 : 30;
      const votes = Object.entries(session.selections).map(([position, candidateId]) => ({
        voter_id: voterData.id,
        candidate_id: candidateId,
        position: position as ElectionPosition,
        points,
      }));

      const { error: votesError } = await supabase
        .from('votes')
        .insert(votes);

      if (votesError) throw votesError;

      await onSubmit(voterData.id);
      
      toast({
        title: "Success!",
        description: "Your votes have been submitted successfully.",
      });
    } catch (error) {
      console.error('Error submitting votes:', error);
      toast({
        title: "Error",
        description: "Failed to submit votes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Loading vote summary...</p>
        </div>
      </div>
    );
  }

  const voteWeight = session.role === 'hod' ? 50 : 30;
  const totalVotes = Object.keys(session.selections).length;

  return (
    <div className="max-w-4xl mx-auto">
      <Button 
        variant="ghost" 
        className="mb-6"
        onClick={onBack}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Voting
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">Review Your Votes</h1>
        <p className="text-lg text-muted-foreground">
          Please review your selections before submitting
        </p>
      </div>

      <div className="space-y-6">
        {/* Voter Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {session.role === 'hod' ? (
                <Crown className="w-5 h-5" />
              ) : (
                <User className="w-5 h-5" />
              )}
              <span>Voter Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <Badge variant={session.role === 'hod' ? 'default' : 'secondary'} className="mt-1">
                  {session.role === 'hod' ? 'Head of Department' : 'Staff Member'}
                </Badge>
              </div>
              {session.voterName && (
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{session.voterName}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Vote Weight</p>
                <p className="font-medium text-primary">{voteWeight} points per position</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vote Selections */}
        <Card>
          <CardHeader>
            <CardTitle>Your Selections ({totalVotes} positions)</CardTitle>
            <CardDescription>
              Total impact: {totalVotes * voteWeight} points across all positions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {POSITION_ORDER.map((position) => {
                const candidateId = session.selections[position];
                const candidate = candidateId ? candidates[candidateId] : null;
                
                return (
                  <div 
                    key={position}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{POSITION_LABELS[position]}</h4>
                      {candidate ? (
                        <p className="text-muted-foreground">{candidate.name}</p>
                      ) : (
                        <p className="text-destructive">No selection made</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{voteWeight} pts</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditPosition(position)}
                        className="text-primary"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="text-center pt-6">
          <Button 
            size="lg" 
            onClick={handleSubmit}
            disabled={submitting || totalVotes === 0}
            className="px-12"
          >
            {submitting ? 'Submitting...' : `Submit All Votes (${totalVotes * voteWeight} points)`}
          </Button>
          {totalVotes === 0 && (
            <p className="text-sm text-destructive mt-2">
              Please make at least one selection before submitting
            </p>
          )}
        </div>
      </div>
    </div>
  );
};