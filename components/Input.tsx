import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, helperText, className = '', ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-sm font-bold text-text-primary">{label} {props.required && <span className="text-danger">*</span>}</label>}
      <input
        ref={ref}
        className={`h-9 px-3 rounded border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20
          ${error ? 'border-danger focus:border-danger' : 'border-control-border focus:border-primary'}
          disabled:bg-control-disabled disabled:text-text-disabled
          ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-danger">{error}</span>}
      {!error && helperText && <span className="text-xs text-text-secondary">{helperText}</span>}
    </div>
  );
});

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({ label, options, error, className = '', ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-sm font-bold text-text-primary">{label} {props.required && <span className="text-danger">*</span>}</label>}
      <select
        ref={ref}
        className={`h-9 px-3 rounded border text-sm bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20
          ${error ? 'border-danger focus:border-danger' : 'border-control-border focus:border-primary'}
          ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  );
});