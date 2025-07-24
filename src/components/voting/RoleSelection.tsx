import { Users, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type VoterRole } from '@/types/voting';

interface RoleSelectionProps {
  onRoleSelect: (role: VoterRole) => void;
}

export const RoleSelection = ({ onRoleSelect }: RoleSelectionProps) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">Student Election Voting System</h1>
        <p className="text-xl text-muted-foreground">Choose your role to begin voting</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onRoleSelect('staff')}>
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
              <Users className="w-12 h-12 text-primary" />
            </div>
            <CardTitle className="text-2xl">Staff Member</CardTitle>
            <CardDescription className="text-lg">Vote as a faculty or staff member</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="bg-muted p-4 rounded-lg mb-6">
              <p className="font-semibold text-lg text-primary">30 Points</p>
              <p className="text-sm text-muted-foreground">Weight per vote</p>
            </div>
            <Button className="w-full" size="lg">
              Continue as Staff
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onRoleSelect('hod')}>
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 p-4 bg-accent/10 rounded-full w-fit">
              <Crown className="w-12 h-12 text-accent-foreground" />
            </div>
            <CardTitle className="text-2xl">Head of Department</CardTitle>
            <CardDescription className="text-lg">Vote as the HOD</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="bg-muted p-4 rounded-lg mb-6">
              <p className="font-semibold text-lg text-primary">50 Points</p>
              <p className="text-sm text-muted-foreground">Weight per vote</p>
            </div>
            <Button className="w-full" size="lg" variant="secondary">
              Continue as HOD
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};