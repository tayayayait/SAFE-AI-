import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import ReactDOM from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer, size = 'md' }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity duration-200">
      <div 
        className={`bg-bg-surface rounded-lg shadow-xl w-full flex flex-col max-h-[90vh] ${widthClasses[size]} transform transition-all duration-200 scale-100`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between p-4 border-b border-border-default">
          <h3 className="text-lg font-bold text-text-primary">{title}</h3>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full hover:bg-gray-100 text-text-secondary transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          {children}
        </div>

        {footer && (
          <div className="p-4 border-t border-border-default flex justify-end gap-2 bg-gray-50 rounded-b-lg">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};