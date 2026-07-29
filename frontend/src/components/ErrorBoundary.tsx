import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error inside ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="w-full min-h-[400px] flex items-center justify-center p-6 select-none">
          <Card className="glass-card bg-[#0F1424]/85 border border-white/5 shadow-2xl overflow-hidden rounded-3xl relative text-center p-8 max-w-lg w-full">
            <div className="absolute inset-0 bg-grid-soft opacity-10 pointer-events-none" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 via-pink-500 to-amber-500 p-[1.5px] mb-6 shadow-xl shadow-rose-500/10">
                <div className="w-full h-full bg-[#0F1424] rounded-2xl flex items-center justify-center">
                  <AlertTriangle className="h-8 w-8 text-rose-500" />
                </div>
              </div>

              <h2 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-pink-400 to-amber-400 mb-3">
                Something Went Wrong
              </h2>
              
              <p className="text-sm text-gray-400 font-medium leading-relaxed mb-6">
                An unexpected error occurred while rendering this section of the workspace. 
                Our neural diagnostics have logged this incident.
              </p>

              {this.state.error && (
                <div className="w-full mb-6 text-left p-3.5 bg-black/40 border border-white/5 rounded-xl max-h-32 overflow-y-auto">
                  <p className="text-[11px] font-mono text-rose-300 break-all leading-normal">
                    {this.state.error.name}: {this.state.error.message}
                  </p>
                </div>
              )}

              <Button
                onClick={this.handleReset}
                className="rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-black px-6 h-11 shadow-lg shadow-rose-500/15 transition-all flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Section
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
