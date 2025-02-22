import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import * as React from "react";

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = {hasError: false};
    }

    static getDerivedStateFromError() {
        return {hasError: true};
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Error caught by Error Boundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center h-screen text-gray-700">
                    <h1 className="text-4xl font-bold">Something went wrong!</h1>
                    <p className="mt-2 text-lg">An unexpected error occurred. Please refresh the page.</p>
                </div>
            );
        }

        return this.props.children;
    }
}

const rootElement = document.getElementById("root");
if (!rootElement) {
    throw new Error("Root element not found");
}

createRoot(rootElement).render(
    <StrictMode>
        <ErrorBoundary>
            <App/>
        </ErrorBoundary>
    </StrictMode>
);
