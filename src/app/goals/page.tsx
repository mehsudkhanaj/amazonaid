
import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Target, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Mock data for demonstration
const mockGoals = [
  { id: "1", name: "Emergency Fund", targetAmount: 5000, currentAmount: 2500, deadline: "2024-12-31", motivation: "Be prepared for anything!" },
  { id: "2", name: "Vacation to Hawaii", targetAmount: 3000, currentAmount: 1200, deadline: "2025-06-30", motivation: "Sun, sand, and relaxation await!" },
  { id: "3", name: "New Laptop", targetAmount: 1500, currentAmount: 1450, deadline: "2024-09-01", motivation: "Almost there! Power up your productivity." },
];

export default function GoalsPage() {
  return (
    <div className="flex-1 flex flex-col">
      <AppHeader title="Financial Goals" />
      <main className="flex-1 p-6 space-y-6">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-headline">Set and Track Your Goals</CardTitle>
              <CardDescription className="font-body">Define your financial aspirations and monitor your progress.</CardDescription>
            </div>
            <Button className="font-body bg-primary hover:bg-primary/90">
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Goal
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground font-body mb-6">Goal creation and editing functionality coming soon.</p>
            
            <div className="space-y-6">
              {mockGoals.map((goal) => {
                const progress = (goal.currentAmount / goal.targetAmount) * 100;
                return (
                  <Card key={goal.id} className="shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="font-headline flex items-center"><Target className="mr-2 h-5 w-5 text-accent" />{goal.name}</CardTitle>
                          <CardDescription className="font-body">Target: ${goal.targetAmount.toLocaleString()} by {goal.deadline}</CardDescription>
                        </div>
                        <span className="text-lg font-semibold font-body text-primary">
                          {progress.toFixed(0)}%
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Progress value={progress} className="w-full h-3 mb-2" />
                      <div className="flex justify-between text-sm font-body text-muted-foreground">
                        <span>${goal.currentAmount.toLocaleString()} raised</span>
                        <span>${(goal.targetAmount - goal.currentAmount).toLocaleString()} to go</span>
                      </div>
                      {progress >= 50 && ( // Example milestone
                        <div className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-md flex items-center">
                          <Zap className="h-5 w-5 text-green-600 mr-2"/>
                          <p className="text-sm font-semibold text-green-700 font-body">{goal.motivation}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
