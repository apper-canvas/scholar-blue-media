import React from 'react';
import { cn } from '@/utils/cn';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Empty = ({ 
  title = 'No data found', 
  description = 'Get started by adding your first item.', 
  icon = 'Database',
  actionLabel,
  onAction,
  className 
}) => {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center p-12 text-center',
      'bg-white rounded-lg border border-gray-200 shadow-sm',
      className
    )}>
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 mb-8 max-w-md">
        {description}
      </p>
      {onAction && actionLabel && (
        <Button onClick={onAction} className="flex items-center gap-2">
          <ApperIcon name="Plus" className="h-4 w-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default Empty;