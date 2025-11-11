import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  trend?: { value: number; isPositive: boolean };
  gradient?: string;
  className?: string;
}

export function StatsCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend, 
  gradient = "from-blue-500 to-blue-600",
  className 
}: StatsCardProps) {
  return (
    <Card className={cn("relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300", className)}>
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-90", gradient)} />
      <CardContent className="relative p-6 text-white">
        <div className="flex items-start justify-between">
          <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
            <p className="text-white/80 text-sm font-medium">{title}</p>
        {trend && (
          <div className="flex items-center mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center space-x-1">
              {trend.isPositive ? (
                <TrendingUp className="h-4 w-4 text-green-300" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-300" />
              )}
              <span className={cn(
                "text-sm font-medium",
                trend.isPositive ? "text-green-300" : "text-red-300"
              )}>
                {trend.isPositive ? "+" : ""}{trend.value}%
              </span>
            </div>
            <span className="text-white/60 text-xs ml-2">vs last month</span>
          </div>
        )}
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            <p className="text-white/70 text-xs">{description}</p>
      </CardContent>
    </Card>
  );
}