import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function KPICard({
  title,
  value,
  unit,
  trend,
  trendValue,
  icon: Icon,
  color = "primary",
}) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    error: "bg-error/10 text-error",
    secondary: "bg-secondary/10 text-secondary",
  };

  const getTrendIcon = () => {
    if (trend === "up") return <TrendingUp className="w-4 h-4" />;
    if (trend === "down") return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getTrendColor = () => {
    if (trend === "up") return "text-success";
    if (trend === "down") return "text-error";
    return "text-textSecondary";
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-border hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {Icon && <Icon className="w-6 h-6" />}
        </div>
        {trendValue && (
          <div
            className={`flex items-center gap-1 text-sm font-medium ${getTrendColor()}`}
          >
            {getTrendIcon()}
            <span>{trendValue}</span>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-sm text-textSecondary font-medium">{title}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-bold text-textMain">{value}</p>
          {unit && <span className="text-sm text-textSecondary">{unit}</span>}
        </div>
      </div>
    </div>
  );
}
