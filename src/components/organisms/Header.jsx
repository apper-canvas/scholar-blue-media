import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { cn } from '@/utils/cn';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { AuthContext } from '@/App';

const Header = ({ title, onMenuClick, className, children }) => {
  const { logout } = useContext(AuthContext);
  const { user } = useSelector((state) => state.user);
  
  return (
    <header className={cn(
      'bg-white border-b border-gray-200 shadow-sm',
      'lg:ml-64',
      className
    )}>
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <ApperIcon name="Menu" className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500">{user.emailAddress}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center gap-2"
              >
                <ApperIcon name="LogOut" className="h-4 w-4" />
                Logout
              </Button>
            </div>
          )}
          {children}
        </div>
      </div>
    </header>
  );
};

export default Header;