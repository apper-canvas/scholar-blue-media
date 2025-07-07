import React from 'react';
import { cn } from '@/utils/cn';
import NavLink from '@/components/molecules/NavLink';
import ApperIcon from '@/components/ApperIcon';

const Sidebar = ({ className, isOpen, onClose }) => {
  const navItems = [
    { to: '/', icon: 'Home', label: 'Dashboard' },
    { to: '/students', icon: 'Users', label: 'Students' },
    { to: '/classes', icon: 'BookOpen', label: 'Classes' },
    { to: '/grades', icon: 'ClipboardList', label: 'Grades' },
    { to: '/attendance', icon: 'Calendar', label: 'Attendance' },
    { to: '/reports', icon: 'FileText', label: 'Reports' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={cn(
        'hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0',
        'bg-white border-r border-gray-200 shadow-sm',
        className
      )}>
        <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <ApperIcon name="GraduationCap" className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Scholar Hub</span>
          </div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              icon={item.icon}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
          <div className="relative w-64 h-full bg-white shadow-xl transform transition-transform duration-300">
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <ApperIcon name="GraduationCap" className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Scholar Hub</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <ApperIcon name="X" className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  onClick={onClose}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;