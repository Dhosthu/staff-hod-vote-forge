import { useState } from 'react';
import { ArrowLeft, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface NameEntryProps {
  onNameSubmit: (name: string) => void;
  onBack: () => void;
}

export const NameEntry = ({ onNameSubmit, onBack }: NameEntryProps) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onNameSubmit(name.trim());
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Button 
        variant="ghost" 
        className="mb-6"
        onClick={onBack}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Role Selection
      </Button>

      <Card>
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
            <User className="w-12 h-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Enter Your Name</CardTitle>
          <CardDescription className="text-lg">
            Please provide your full name for the voting record
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-base">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="mt-2 text-lg py-3"
                required
                autoFocus
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={!name.trim()}
            >
              Continue to Voting
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};