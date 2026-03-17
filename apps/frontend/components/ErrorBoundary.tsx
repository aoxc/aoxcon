'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-8">
          <div className="aox-widget p-8 max-w-md text-center">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Bir Hata Oluştu</h2>
            <p className="text-white/60 mb-6">Sistemde beklenmedik bir durum oluştu. Lütfen sayfayı yenileyin.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-aox-blue rounded-xl font-bold hover:bg-aox-blue/80 transition-all"
            >
              Sayfayı Yenile
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
