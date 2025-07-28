import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { CartSidebar } from './CartSidebar';

export const Layout = () => {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Animated Blobs Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute -top-48 -left-48 w-[600px] h-[600px] bg-purple-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-48 -right-48 w-[600px] h-[600px] bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-indigo-200 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-blob animation-delay-4000"></div>
        <div className="absolute top-10 right-1/3 w-[400px] h-[400px] bg-pink-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-3000"></div>
        <div className="absolute bottom-10 left-1/4 w-[350px] h-[350px] bg-yellow-100 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob animation-delay-1000"></div>
      </div>
      {/* Main Content */}
      <div className="relative z-10">
        <Header />
        <main className="pt-16">
          <Outlet />
        </main>
        <CartSidebar />
      </div>
    </div>
  );
};