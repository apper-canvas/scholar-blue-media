import React from 'react';
import { cn } from '@/utils/cn';
import Label from '@/components/atoms/Label';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';

const FormField = ({ 
  label, 
  type = 'text', 
  error, 
  className, 
  options, 
  ...props 
}) => {
  const id = props.id || props.name;

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={id} className="text-gray-700 font-medium">
          {label}
        </Label>
      )}
      {type === 'select' ? (
        <Select id={id} {...props}>
          {options?.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      ) : (
        <Input
          id={id}
          type={type}
          className={cn(
            error && 'border-red-500 focus:ring-red-500'
          )}
          {...props}
        />
      )}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FormField;