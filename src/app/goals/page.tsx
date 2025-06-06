"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext"; // Auth context should return currentUser
import { AppHeader } from "@/components/layout/AppHeader";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Target, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/firebase";
import {
  collection, addDoc, onSnapshot, query, serverTimestamp
} from "firebase/firestore";

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  motivation: string;
}

export default function GoalsPage() {
  const { currentUser } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: "",
    targetAmount: "",
    deadline: "",
    motivation: ""
  });

  useEffect(() => {
    if (currentUser) {
      const goalsRef = collection(db, "users", currentUser.uid, "goals");
      const q = query(goalsRef);
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const goalsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })) as Goal[];
        setGoals(goalsList);
      });

      return () => unsubscribe();
    } else {
      setGoals([]);
    }
  }, [currentUser]);

  const handleAddGoal = async () => {
    if (!currentUser || !newGoal.name || !newGoal.targetAmount || !newGoal.deadline) return;

    try {
      const goalsRef = collection(db, "users", currentUser.uid, "goals");

      await addDoc(goalsRef, {
        name: newGoal.name,
        targetAmount: parseFloat(newGoal.targetAmount),
        deadline: newGoal.deadline,
        motivation: newGoal.motivation,
        currentAmount: 0,
        createdAt: serverTimestamp()
      });

      setNewGoal({ name: "", targetAmount: "", deadline: "", motivation: "" });
      setIsModalOpen(false);

    } catch (error) {
      console.error("Error adding goal:", error);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <AppHeader title="Financial Goals" />
      <main className="flex-1 p-6 space-y-6">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-headline">Set and Track Your Goals</CardTitle>
              <CardDescription className="font-body">
                Define your financial aspirations and monitor your progress.
              </CardDescription>
            </div>
            <Button className="font-body bg-primary hover:bg-primary/90" onClick={() => setIsModalOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Goal
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {goals.map((goal) => {
                const progress = (goal.currentAmount / goal.targetAmount) * 100;
                return (
                  <Card key={goal.id} className="shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="font-headline flex items-center">
                            <Target className="mr-2 h-5 w-5 text-accent" />
                            {goal.name}
                          </CardTitle>
                          <CardDescription className="font-body">
                            Target: ${goal.targetAmount.toLocaleString()} by {goal.deadline}
                          </CardDescription>
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
                      {progress >= 50 && (
                        <div className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-md flex items-center">
                          <Zap className="h-5 w-5 text-green-600 mr-2" />
                          <p className="text-sm font-semibold text-green-700 font-body">
                            {goal.motivation}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Goal</DialogTitle>
              <DialogDescription>
                Define a new financial goal to start tracking.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Goal Name</Label>
                <Input
                  id="name"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="targetAmount" className="text-right">Target Amount</Label>
                <Input
                  id="targetAmount"
                  type="number"
                  value={newGoal.targetAmount}
                  onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="deadline" className="text-right">Target Date</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="motivation" className="text-right">Motivation</Label>
                <Input
                  id="motivation"
                  value={newGoal.motivation}
                  onChange={(e) => setNewGoal({ ...newGoal, motivation: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={handleAddGoal}
                disabled={!newGoal.name.trim() || !newGoal.targetAmount.trim() || !newGoal.deadline.trim()}
              >
                Add Goal
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
