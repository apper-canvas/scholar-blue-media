import React from 'react';
import { cn } from '@/utils/cn';
import ApperIcon from '@/components/ApperIcon';

const TableHeader = ({ 
  title, 
  sortable = false, 
  sortDirection, 
  onSort, 
  className,
  ...props 
}) => {
  const handleSort = () => {
    if (sortable && onSort) {
      onSort();
    }
  };

  return (
    <th
      className={cn(
        'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
        'bg-gray-50 border-b border-gray-200',
        sortable && 'cursor-pointer hover:bg-gray-100 select-none',
        className
      )}
      onClick={handleSort}
      {...props}
    >
      <div className="flex items-center gap-2">
        <span>{title}</span>
        {sortable && (
          <ApperIcon 
            name={
              sortDirection === 'asc' ? 'ChevronUp' : 
              sortDirection === 'desc' ? 'ChevronDown' : 
              'ChevronsUpDown'
            }
            className="h-4 w-4"
          />
        )}
      </div>
    </th>
  );
};

export default TableHeader;