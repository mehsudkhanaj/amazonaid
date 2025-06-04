
"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { investmentSuggestions, type InvestmentSuggestionsInput, type InvestmentSuggestionsOutput } from "@/ai/flows/investment-suggestions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lightbulb, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  income: z.coerce.number().positive({ message: "Income must be a positive number." }),
  expenses: z.coerce.number().positive({ message: "Expenses must be a positive number." }),
  investmentGoals: z.string().min(10, { message: "Please describe your investment goals in at least 10 characters." }),
  riskTolerance: z.enum(['low', 'medium', 'high']),
  currentInvestments: z.string().optional(),
});

export default function InvestmentsPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<InvestmentSuggestionsOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      riskTolerance: 'medium',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setSuggestions(null);
    try {
      const result = await investmentSuggestions(values as InvestmentSuggestionsInput);
      setSuggestions(result);
      toast({ title: "Suggestions Generated", description: "AI has provided investment insights." });
    } catch (error: any) {
      console.error("Error generating suggestions:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to generate investment suggestions.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <AppHeader title="AI Investment Insights" />
      <main className="flex-1 p-6 space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center"><Lightbulb className="mr-2 h-6 w-6 text-accent" />Unlock Your Investment Potential</CardTitle>
            <CardDescription className="font-body">Provide your financial details, and our AI will generate personalized investment suggestions to help you achieve your goals.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="income"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-body">Monthly Income ($)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 5000" {...field} className="font-body" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="expenses"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-body">Monthly Expenses ($)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 3000" {...field} className="font-body" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="investmentGoals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-body">Investment Goals</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Save for retirement, buy a house in 5 years, grow wealth..." {...field} className="font-body min-h-[100px]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="riskTolerance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-body">Risk Tolerance</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="font-body">
                            <SelectValue placeholder="Select your risk tolerance" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currentInvestments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-body">Current Investments (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Stocks in AAPL, S&P 500 ETF, Bitcoin..." {...field} className="font-body" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full md:w-auto bg-accent hover:bg-accent/90 font-body" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  Generate Suggestions
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {isLoading && (
          <div className="flex justify-center items-center p-10">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="ml-4 text-lg font-body text-muted-foreground">Generating your personalized insights...</p>
          </div>
        )}

        {suggestions && !isLoading && (
          <Card className="shadow-lg animate-in fade-in-50 duration-500">
            <CardHeader>
              <CardTitle className="font-headline text-primary flex items-center"><Sparkles className="mr-2 h-6 w-6" />Your AI Investment Suggestions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold font-headline mb-2">Suggestions:</h3>
                <p className="text-foreground/90 whitespace-pre-wrap font-body bg-secondary/50 p-4 rounded-md">{suggestions.suggestions}</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold font-headline mb-2">Reasoning:</h3>
                <p className="text-foreground/90 whitespace-pre-wrap font-body bg-secondary/50 p-4 rounded-md">{suggestions.reasoning}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

