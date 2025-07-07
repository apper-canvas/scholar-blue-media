import React from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { cn } from '@/utils/cn';
import ApperIcon from '@/components/ApperIcon';

const NavLink = ({ 
  to, 
  icon, 
  children, 
  className,
  ...props 
}) => {
  return (
    <RouterNavLink
      to={to}
      className={({ isActive }) => cn(
        'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200',
        'hover:bg-gray-100 hover:text-gray-900',
        isActive 
          ? 'bg-primary text-white hover:bg-primary/90' 
          : 'text-gray-700',
        className
      )}
      {...props}
    >
      {icon && <ApperIcon name={icon} className="h-4 w-4" />}
      {children}
    </RouterNavLink>
  );
};

export default NavLink;