import { AppHeader } from "@/components/layout/AppHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart3,
  Bitcoin,
  ClipboardList,
  DollarSign,
  Lightbulb,
  Target,
  PieChart, // ✅ FIXED: imported PieChart icon from lucide-react
} from "lucide-react";
import Image from "next/image";

const summaryCards = [
  {
    title: "Current Balance",
    value: "$12,345.67",
    icon: DollarSign,
    description: "Across all accounts",
    color: "text-primary",
  },
  {
    title: "Total Expenses (Month)",
    value: "$2,345.80",
    icon: ClipboardList,
    description: "Vs. $2,100 last month",
    color: "text-destructive",
  },
  {
    title: "Crypto Portfolio",
    value: "$5,876.20",
    icon: Bitcoin,
    description: "+5.2% today",
    color: "text-green-500",
  },
  {
    title: "Investment Value",
    value: "$25,600.00",
    icon: Lightbulb,
    description: "Tracking your growth",
    color: "text-accent",
  },
  {
    title: "Active Goals",
    value: "3",
    icon: Target,
    description: "Progressing steadily",
    color: "text-blue-500",
  },
];

export default function DashboardPage() {
  return (
    <div className="flex-1 flex flex-col">
      <AppHeader title="Dashboard Overview" />
      <main className="flex-1 p-6 space-y-6">
        {/* Summary Cards */}
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {summaryCards.map((card) => (
            <Card
              key={card.title}
              className="shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium font-headline">
                  {card.title}
                </CardTitle>
                <card.icon
                  className={`h-6 w-6 ${
                    card.color.startsWith("text-")
                      ? card.color
                      : "text-muted-foreground"
                  }`}
                />
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold font-body ${card.color}`}>
                  {card.value}
                </div>
                <p className="text-xs text-muted-foreground font-body pt-1">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Chart Placeholders */}
        <section className="grid gap-6 lg:grid-cols-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline">Spending Breakdown</CardTitle>
              <CardDescription className="font-body">
                Your expenses by category this month.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-md">
                <PieChart className="h-16 w-16 text-muted-foreground" />
                <p className="ml-2 text-muted-foreground font-body">
                  Spending chart coming soon
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline">Income vs. Expense</CardTitle>
              <CardDescription className="font-body">
                Track your cash flow over the past 6 months.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-md">
                <BarChart3 className="h-16 w-16 text-muted-foreground" />
                <p className="ml-2 text-muted-foreground font-body">
                  Cash flow chart coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Market Trends Banner */}
        <section>
          <Card className="shadow-lg overflow-hidden">
            <CardHeader>
              <CardTitle className="font-headline">Market Trends</CardTitle>
              <CardDescription className="font-body">
                Stay updated with the latest market movements.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative h-60 md:h-80 w-full">
                <Image
                  src="https://placehold.co/1200x400.png"
                  alt="Market trends graph"
                  layout="fill"
                  objectFit="cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6">
                  <h3 className="text-2xl font-headline text-white">
                    S&P 500 Hits New High
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
