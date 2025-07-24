import { useState, useEffect } from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
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
  const [localSelection, setLocalSelection] = useState<string>(selectedCandidateId || '');
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

  useEffect(() => {
    setLocalSelection(selectedCandidateId || '');
  }, [selectedCandidateId]);

  const progress = (currentPosition / totalPositions) * 100;

  const handleNext = () => {
    if (localSelection) {
      onVoteSelect(localSelection);
    }
  };

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
        <div className="space-y-6">
          <p className="text-lg text-muted-foreground">
            Select one candidate for {POSITION_LABELS[position]}:
          </p>
          
          <RadioGroup 
            value={localSelection} 
            onValueChange={setLocalSelection}
            className="space-y-4"
          >
            {candidates.map((candidate) => (
              <div key={candidate.id}>
                <Card className="transition-all hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <RadioGroupItem 
                        value={candidate.id} 
                        id={candidate.id}
                        className="mt-1"
                      />
                      <Label 
                        htmlFor={candidate.id} 
                        className="flex-1 cursor-pointer"
                      >
                        <div>
                          <h3 className="text-xl font-semibold">{candidate.name}</h3>
                          <p className="text-muted-foreground">
                            Candidate for {POSITION_LABELS[position]}
                          </p>
                        </div>
                      </Label>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}

      <div className="mt-8 text-center">
        <Button 
          size="lg" 
          onClick={handleNext}
          disabled={!localSelection}
          className="px-8"
        >
          <ChevronRight className="w-4 h-4 mr-2" />
          {currentPosition < totalPositions ? 'Next Position' : 'Review Votes'}
        </Button>
        
        {!localSelection && (
          <p className="text-sm text-muted-foreground mt-2">
            Please select a candidate to continue
          </p>
        )}
      </div>
    </div>
  );
};