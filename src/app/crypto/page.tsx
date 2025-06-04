
"use client";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, RefreshCw, Bitcoin, Ethereum, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
}

const popularCryptos = ['bitcoin', 'ethereum', 'cardano', 'solana', 'dogecoin']; // IDs for CoinGecko

export default function CryptoPage() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchCryptoData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${popularCryptos.join(',')}&order=market_cap_desc&per_page=10&page=1&sparkline=false`);
      if (!response.ok) {
        throw new Error('Failed to fetch crypto data');
      }
      const data: CryptoData[] = await response.json();
      setCryptoData(data);
    } catch (error: any) {
      console.error("Error fetching crypto data:", error);
      toast({ variant: "destructive", title: "Error", description: error.message || "Could not load crypto data." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptoData();
  }, []);
  
  return (
    <div className="flex-1 flex flex-col">
      <AppHeader title="Cryptocurrency Tracker" />
      <main className="flex-1 p-6 space-y-6">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-headline">Track Your Crypto Assets</CardTitle>
              <CardDescription className="font-body">Live prices and market data for your favorite cryptocurrencies.</CardDescription>
            </div>
            <div className="flex gap-2">
               <Button variant="outline" onClick={fetchCryptoData} disabled={isLoading} className="font-body">
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh Data
              </Button>
              <Button className="font-body bg-primary hover:bg-primary/90">
                <PlusCircle className="mr-2 h-4 w-4" /> Add to Portfolio
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input placeholder="Search Cryptocurrency (e.g., Bitcoin, ETH)" className="font-body max-w-sm" />
              <p className="text-xs text-muted-foreground mt-1 font-body">Portfolio management and custom tracking coming soon.</p>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-headline">Name</TableHead>
                  <TableHead className="font-headline">Symbol</TableHead>
                  <TableHead className="font-headline text-right">Price (USD)</TableHead>
                  <TableHead className="font-headline text-right">24h Change</TableHead>
                  <TableHead className="font-headline text-right">Market Cap</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && cryptoData.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center font-body py-8">Loading data...</TableCell></TableRow>
                ) : cryptoData.length === 0 && !isLoading ? (
                   <TableRow><TableCell colSpan={5} className="text-center font-body py-8">No data available. Try refreshing.</TableCell></TableRow>
                ) : (
                  cryptoData.map((crypto) => (
                    <TableRow key={crypto.id}>
                      <TableCell className="font-medium font-body flex items-center">
                        <Image src={crypto.image} alt={crypto.name} width={24} height={24} className="mr-2 rounded-full" />
                        {crypto.name}
                      </TableCell>
                      <TableCell className="font-body uppercase">{crypto.symbol}</TableCell>
                      <TableCell className="text-right font-body">${crypto.current_price.toLocaleString()}</TableCell>
                      <TableCell className={`text-right font-body flex items-center justify-end ${crypto.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-destructive'}`}>
                        {crypto.price_change_percentage_24h >= 0 ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
                        {crypto.price_change_percentage_24h.toFixed(2)}%
                      </TableCell>
                      <TableCell className="text-right font-body">${crypto.market_cap.toLocaleString()}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <p className="text-xs text-muted-foreground mt-2 text-right font-body">Data from CoinGecko API.</p>
          </CardContent>
        </Card>
        
        <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline flex items-center"><Bitcoin className="mr-2 text-yellow-500"/>Bitcoin (BTC)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[200px] flex items-center justify-center bg-muted/50 rounded-md">
                        <p className="text-muted-foreground font-body">BTC price chart coming soon</p>
                    </div>
                </CardContent>
            </Card>
             <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline flex items-center">
                        <svg className="mr-2 h-5 w-5" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="currentColor" color="#627EEA"><path fillRule="evenodd" clipRule="evenodd" d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32ZM16.4883 8.41281L16 9.30001L15.5117 8.41281L8 17.1872L16 22.0002L24 17.1872L16.4883 8.41281ZM16 5L16.9766 6.75001L27 16.0002L16 25L5 16.0002L15.0234 6.75001L16 5Z"></path></svg>
                        Ethereum (ETH)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[200px] flex items-center justify-center bg-muted/50 rounded-md">
                         <p className="text-muted-foreground font-body">ETH price chart coming soon</p>
                    </div>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
