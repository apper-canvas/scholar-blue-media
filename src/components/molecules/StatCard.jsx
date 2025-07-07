import React from 'react';
import { Card, CardContent } from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  className,
  color = 'blue'
}) => {
  const colors = {
    blue: 'text-blue-600 bg-blue-50 border-blue-200',
    green: 'text-green-600 bg-green-50 border-green-200',
    amber: 'text-amber-600 bg-amber-50 border-amber-200',
    red: 'text-red-600 bg-red-50 border-red-200',
  };

  return (
    <Card className={cn('border-l-4', colors[color], className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {trend && (
              <div className="flex items-center mt-1">
                <ApperIcon 
                  name={trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                  className={cn(
                    'h-4 w-4 mr-1',
                    trend === 'up' ? 'text-green-500' : 'text-red-500'
                  )}
                />
                <span className={cn(
                  'text-sm font-medium',
                  trend === 'up' ? 'text-green-600' : 'text-red-600'
                )}>
                  {trendValue}
                </span>
              </div>
            )}
          </div>
          <div className={cn('p-3 rounded-full', colors[color])}>
            <ApperIcon name={icon} className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;