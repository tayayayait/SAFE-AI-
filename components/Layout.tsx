import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ToastContainer } from './Toast';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg-page flex">
      <Sidebar />
      <div className="flex-1 ml-60 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-6 overflow-x-hidden overflow-y-auto">
          <div className="max-w-[1440px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};