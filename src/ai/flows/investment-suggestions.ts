// InvestmentSuggestions story
'use server';
/**
 * @fileOverview AI-powered investment suggestion flow.
 *
 * - investmentSuggestions - A function that provides investment suggestions based on user financial data.
 * - InvestmentSuggestionsInput - The input type for the investmentSuggestions function.
 * - InvestmentSuggestionsOutput - The return type for the investmentSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InvestmentSuggestionsInputSchema = z.object({
  income: z.number().describe('The user\u0027s monthly income.'),
  expenses: z.number().describe('The user\u0027s monthly expenses.'),
  investmentGoals: z.string().describe('The user\u0027s investment goals.'),
  riskTolerance: z
    .enum(['low', 'medium', 'high'])
    .describe('The user\u0027s risk tolerance.'),
  currentInvestments: z
    .string()
    .optional()
    .describe('The user\u0027s current investments.'),
});
export type InvestmentSuggestionsInput = z.infer<
  typeof InvestmentSuggestionsInputSchema
>;

const InvestmentSuggestionsOutputSchema = z.object({
  suggestions: z
    .string()
    .describe('Personalized investment suggestions based on user data.'),
  reasoning: z
    .string()
    .describe('Explanation of why the suggestions were made.'),
});
export type InvestmentSuggestionsOutput = z.infer<
  typeof InvestmentSuggestionsOutputSchema
>;

export async function investmentSuggestions(
  input: InvestmentSuggestionsInput
): Promise<InvestmentSuggestionsOutput> {
  return investmentSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'investmentSuggestionsPrompt',
  input: {schema: InvestmentSuggestionsInputSchema},
  output: {schema: InvestmentSuggestionsOutputSchema},
  prompt: `You are an AI investment advisor. Based on the user's financial information and goals, provide personalized investment suggestions.

Income: {{income}}
Expenses: {{expenses}}
Investment Goals: {{investmentGoals}}
Risk Tolerance: {{riskTolerance}}
Current Investments: {{currentInvestments}}

Respond with investment suggestions and the reasoning behind them.`,
});

const investmentSuggestionsFlow = ai.defineFlow(
  {
    name: 'investmentSuggestionsFlow',
    inputSchema: InvestmentSuggestionsInputSchema,
    outputSchema: InvestmentSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
