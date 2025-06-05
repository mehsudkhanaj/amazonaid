"use client"; // Add this directive for client-side interactivity

import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {  Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react"; // Import useState
import jsPDF from 'jspdf'; // Import jsPDF
import { BarChart3, FileText, PieChart, PlusCircle } from "lucide-react";

// Define the type for an expense
interface Expense {
  id: string;
  date: string;
  category: string; // Added category
  item: string;
  amount: number;
  store: string; // Added store
}

// Mock data for demonstration (will be replaced by database data)
const initialExpenses: Expense[] = [
  { id: "1", date: "2024-07-15", category: "Groceries", item: "Milk, Bread, Eggs", amount: 25.50, store: "SuperMart" },
  { id: "2", date: "2024-07-14", category: "Utilities", item: "Electricity Bill", amount: 75.00, store: "Power Co." },
  { id: "3", date: "2024-07-12", category: "Transport", item: "Gasoline", amount: 40.00, store: "Gas Station" },
  { id: "4", date: "2024-07-10", category: "Entertainment", item: "Movie Tickets", amount: 30.00, store: "Cinema" },
];

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses); // State to hold expenses
  const [newItem, setNewItem] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newCategory, setNewCategory] = useState(""); // State for category
  const [newStore, setNewStore] = useState(""); // State for store

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!newItem || !newAmount || !newDate || !newCategory || !newStore) {
      alert("Please fill in all fields");
      return;
    }

    const newExpense: Expense = {
      id: Date.now().toString(), // Simple unique ID for now
      date: newDate,
      category: newCategory,
      item: newItem,
      amount: parseFloat(newAmount),
      store: newStore,
    };

    // In a real application, you would send this data to your backend API to save to the database.
    // For this example, we'll just add it to the local state.
    setExpenses([...expenses, newExpense]);

    // Clear the form
    setNewItem("");
    setNewAmount("");
    setNewDate("");
    setNewCategory("");
    setNewStore("");
  };

  // PDF generation logic using jsPDF
  const handleGenerateReport = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("Expense Report", 14, 22);

    // Add expenses data (simple table format)
    let yPos = 30;
    doc.setFontSize(12);
    doc.text("Date", 14, yPos);
    doc.text("Category", 40, yPos);
    doc.text("Item", 70, yPos);
    doc.text("Store", 120, yPos);
    doc.text("Amount", 170, yPos, { align: "right" });

    yPos += 5;
    doc.setLineWidth(0.5);
    doc.line(14, yPos, 196, yPos); // Draw a line

    yPos += 5;
    expenses.forEach((expense) => {
      doc.text(expense.date, 14, yPos);
      doc.text(expense.category, 40, yPos);
      doc.text(expense.item, 70, yPos);
      doc.text(expense.store, 120, yPos);
      doc.text(`$${expense.amount.toFixed(2)}`, 170, yPos, { align: "right" });
      yPos += 7;
    });

    // Save the PDF with a filename
    doc.save("expense_report.pdf");
  };

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
              <Button variant="outline" className="font-body" onClick={handleGenerateReport}>
                <FileText className="mr-2 h-4 w-4" /> Generate Report (PDF)
              </Button>
              {/* The 'Add Expense' button next to Generate Report could trigger a modal or navigate to a dedicated add page if the form is elsewhere */}
            </div>
          </CardHeader>
          <CardContent>
            {/* Add expense form */}
            <div className="mb-6 p-4 border rounded-lg bg-muted/20">
              <h3 className="text-lg font-semibold font-headline mb-2">Add New Expense</h3>
              <form className="grid md:grid-cols-3 gap-4" onSubmit={handleAddExpense}> {/* Add onSubmit handler */}
                <Input
                  placeholder="Item/Service (e.g., Groceries)"
                  className="font-body"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                />
                 {/* Added Category Input */}
                <Input
                  placeholder="Category (e.g., Groceries, Utilities)"
                  className="font-body"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Amount (e.g., 45.50)"
                  className="font-body"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                />
                <Input
                  type="date"
                  className="font-body"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                />
                 {/* Added Store Input */}
                 <Input
                  placeholder="Store/Vendor (e.g., SuperMart)"
                  className="font-body"
                  value={newStore}
                  onChange={(e) => setNewStore(e.target.value)}
                />
                {/* The form button */}
                <Button type="submit" className="font-body bg-primary hover:bg-primary/90 md:col-span-3"> {/* Make button span full width on medium screens */}
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Expense
                </Button>
              </form>
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
                {expenses.map((expense) => ( // Render expenses from state
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
            <p className="text-sm text-muted-foreground mt-4 font-body">Note: Expenses added here are currently only stored in the browser's memory. Full CRUD functionality with a database is required for persistent storage.</p>
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
