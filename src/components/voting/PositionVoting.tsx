import { useState, useEffect } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { type ElectionPosition, type Candidate, POSITION_LABELS } from '@/types/voting';
import { useToast } from '@/hooks/use-toast';

interface PositionVotingProps {
  position: ElectionPosition;
  currentPosition: number;
  totalPositions: number;
  selectedCandidateId?: string;
  onVoteSelect: (candidateId: string) => void;
  onBack: () => void;
}

export const PositionVoting = ({ 
  position, 
  currentPosition, 
  totalPositions,
  selectedCandidateId,
  onVoteSelect, 
  onBack 
}: PositionVotingProps) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const { data, error } = await supabase
          .from('candidates')
          .select('*')
          .eq('position', position)
          .order('name');

        if (error) throw error;
        setCandidates(data || []);
      } catch (error) {
        console.error('Error fetching candidates:', error);
        toast({
          title: "Error",
          description: "Failed to load candidates. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [position, toast]);

  const progress = (currentPosition / totalPositions) * 100;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Loading candidates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Button 
        variant="ghost" 
        className="mb-6"
        onClick={onBack}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Vote for {POSITION_LABELS[position]}
            </h1>
            <p className="text-muted-foreground">
              Position {currentPosition} of {totalPositions}
            </p>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {currentPosition}/{totalPositions}
          </Badge>
        </div>
        <Progress value={progress} className="w-full" />
      </div>

      {candidates.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              No candidates found for this position.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          <p className="text-lg text-muted-foreground mb-4">
            Select one candidate for {POSITION_LABELS[position]}:
          </p>
          
          {candidates.map((candidate) => (
            <Card 
              key={candidate.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedCandidateId === candidate.id 
                  ? 'ring-2 ring-primary bg-primary/5' 
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => onVoteSelect(candidate.id)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{candidate.name}</CardTitle>
                    <CardDescription className="text-base">
                      Candidate for {POSITION_LABELS[position]}
                    </CardDescription>
                  </div>
                  {selectedCandidateId === candidate.id && (
                    <div className="flex items-center space-x-2">
                      <Check className="w-6 h-6 text-primary" />
                      <Badge variant="default">Selected</Badge>
                    </div>
                  )}
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {selectedCandidateId && (
        <div className="mt-8 text-center">
          <Button 
            size="lg" 
            onClick={() => onVoteSelect(selectedCandidateId)}
            className="px-8"
          >
            {currentPosition < totalPositions ? 'Next Position' : 'Review Votes'}
          </Button>
        </div>
      )}
    </div>
  );
};