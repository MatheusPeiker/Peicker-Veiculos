import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-8 font-sans">
                    <div className="max-w-2xl text-center">
                        <h1 className="text-4xl font-bold mb-4 text-red-500">Oops! Algo deu errado.</h1>
                        <p className="text-xl mb-8 text-slate-300">Ocorreu um erro inesperado na aplicação.</p>
                        <div className="bg-black/50 p-6 rounded-lg text-left overflow-auto max-h-96 mb-8 border border-white/10">
                            <code className="font-mono text-sm text-red-300">
                                {this.state.error?.message}
                            </code>
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-slate-200 transition-colors"
                        >
                            Recarregar Página
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
