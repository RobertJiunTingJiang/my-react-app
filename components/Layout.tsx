import React, { InputHTMLAttributes } from 'react';
import { LucideIcon } from 'lucide-react';

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'google' | 'line' | 'facebook' | 'ghost';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  icon,
  ...props 
}) => {
  const baseStyles = "py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-gentle-primary hover:bg-gentle-primary-dark text-white shadow-sm",
    secondary: "bg-transparent border border-gentle-primary text-gentle-primary hover:bg-gentle-primary/10",
    ghost: "bg-transparent text-gentle-text hover:bg-black/5",
    google: "bg-[#4285F4] text-white hover:bg-[#3367D6]",
    line: "bg-[#06C755] text-white hover:bg-[#05A546]",
    facebook: "bg-[#3b5998] text-white hover:bg-[#2d4373]",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`} 
      {...props}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
};

// --- Input ---
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-sm font-bold text-gentle-text">{label}</label>}
      <input 
        className={`bg-gentle-input text-gentle-text rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-gentle-primary/50 transition-all placeholder-gentle-text-light/70 ${className}`}
        {...props}
      />
    </div>
  );
};

// --- Select ---
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { label: string; value: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, options, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-sm font-bold text-gentle-text">{label}</label>}
      <select 
        className={`bg-gentle-input text-gentle-text rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-gentle-primary/50 transition-all appearance-none ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
};

// --- Card ---
export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-gentle-card rounded-xl p-4 shadow-sm border border-gentle-primary/10 ${className}`}>
    {children}
  </div>
);

// --- Header ---
export const Header: React.FC<{ title: string; leftIcon?: React.ReactNode; rightIcon?: React.ReactNode; onLeftClick?: () => void; onRightClick?: () => void }> = ({ 
  title, leftIcon, rightIcon, onLeftClick, onRightClick 
}) => (
  <div className="bg-gentle-primary/30 backdrop-blur-sm sticky top-0 z-10 px-4 py-4 flex items-center justify-between">
    <div className="w-10 flex justify-start">
      {leftIcon && <button onClick={onLeftClick} className="p-1 hover:bg-black/5 rounded-full">{leftIcon}</button>}
    </div>
    <h1 className="text-xl font-bold text-gentle-text tracking-wide">{title}</h1>
    <div className="w-10 flex justify-end">
      {rightIcon && <button onClick={onRightClick} className="p-1 hover:bg-black/5 rounded-full">{rightIcon}</button>}
    </div>
  </div>
);

// --- Bottom Navigation ---
interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: any) => void;
  tabs: { id: string; label: string; icon: LucideIcon }[];
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, tabs }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gentle-primary/40 backdrop-blur-md pb-safe pt-2 px-6 flex justify-between items-center z-50">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center p-2 transition-colors duration-200 ${isActive ? 'text-gentle-text font-bold' : 'text-gentle-text-light'}`}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] mt-1">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};