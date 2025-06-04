
import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileText, BarChart3, PieChart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock data for demonstration
const mockExpenses = [
  { id: "1", date: "2024-07-15", category: "Groceries", item: "Milk, Bread, Eggs", amount: 25.50, store: "SuperMart" },
  { id: "2", date: "2024-07-14", category: "Utilities", item: "Electricity Bill", amount: 75.00, store: "Power Co." },
  { id: "3", date: "2024-07-12", category: "Transport", item: "Gasoline", amount: 40.00, store: "Gas Station" },
  { id: "4", date: "2024-07-10", category: "Entertainment", item: "Movie Tickets", amount: 30.00, store: "Cinema" },
];


export default function ExpensesPage() {
  return (
    <div className="flex-1 flex flex-col">
      <AppHeader title="Expense Tracker" />
      <main className="flex-1 p-6 space-y-6">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-headline">Manage Your Expenses</CardTitle>
              <CardDescription className="font-body">Track, categorize, and analyze your spending.</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="font-body">
                <FileText className="mr-2 h-4 w-4" /> Generate Report (PDF)
              </Button>
              <Button className="font-body bg-primary hover:bg-primary/90">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Expense
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Add expense form placeholder */}
            <div className="mb-6 p-4 border rounded-lg bg-muted/20">
              <h3 className="text-lg font-semibold font-headline mb-2">Add New Expense</h3>
              <form className="grid md:grid-cols-3 gap-4">
                <Input placeholder="Item/Service (e.g., Groceries)" className="font-body"/>
                <Input type="number" placeholder="Amount (e.g., 45.50)" className="font-body"/>
                <Input type="date" className="font-body"/>
                {/* More fields: category, store, notes etc. */}
              </form>
               <p className="text-sm text-muted-foreground mt-2 font-body">Full form coming soon.</p>
            </div>

            <h3 className="text-xl font-semibold font-headline mb-4">Recent Expenses</h3>
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-headline">Date</TableHead>
                  <TableHead className="font-headline">Category</TableHead>
                  <TableHead className="font-headline">Item</TableHead>
                  <TableHead className="font-headline">Store/Vendor</TableHead>
                  <TableHead className="text-right font-headline">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-body">{expense.date}</TableCell>
                    <TableCell className="font-body">{expense.category}</TableCell>
                    <TableCell className="font-body">{expense.item}</TableCell>
                    <TableCell className="font-body">{expense.store}</TableCell>
                    <TableCell className="text-right font-body">${expense.amount.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
             <p className="text-sm text-muted-foreground mt-4 font-body">Dynamic expense table and full CRUD functionality coming soon.</p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline">Spending by Category</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center bg-muted/50 rounded-md">
               <PieChart className="h-16 w-16 text-muted-foreground" />
               <p className="ml-2 text-muted-foreground font-body">Category pie chart coming soon</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline">Monthly Spending Trend</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center bg-muted/50 rounded-md">
              <BarChart3 className="h-16 w-16 text-muted-foreground" />
              <p className="ml-2 text-muted-foreground font-body">Spending trend chart coming soon</p>
            </CardContent>
          </Card>
        </div>
         <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Grocery Price Tracker</CardTitle>
            <CardDescription className="font-body">Monitor dynamic pricing for your common grocery items. (Feature coming soon)</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground font-body">This section will allow you to input grocery items and track their prices over time from different stores.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
