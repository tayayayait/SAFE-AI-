import React from 'react';
import { useLocation } from 'react-router-dom';
import { RefreshCw, Bell } from 'lucide-react';
import { Button } from './Button';

export const Header: React.FC = () => {
  const location = useLocation();

  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case '/dashboard': return '대시보드';
      case '/recipients': return '수신자 관리';
      case '/send-history': return '발송 이력';
      case '/cases': return '재해 사례';
      case '/logs': return '오류 로그';
      case '/settings': return '설정';
      default: return 'KOSHA AI Alert';
    }
  };

  return (
    <header className="h-16 bg-bg-surface border-b border-border-default flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-baseline gap-4">
        <h1 className="text-xl font-bold text-text-primary">{getPageTitle(location.pathname)}</h1>
        <span className="text-xs text-text-secondary">Last updated: {new Date().toLocaleString('ko-KR')}</span>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="text-text-secondary">
          <RefreshCw className="w-4 h-4" />
        </Button>
        <div className="w-px h-6 bg-border-default mx-1"></div>
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
             A
           </div>
           <span className="text-sm text-text-primary font-medium">Admin</span>
        </div>
      </div>
    </header>
  );
};