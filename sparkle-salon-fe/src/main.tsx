import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const CLIENT_ID ="231795283840-ai3mhfs4qk2cmig5p7c5pcts27jl55rd.apps.googleusercontent.com";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <GoogleOAuthProvider clientId={CLIENT_ID}>
                    <App />
                </GoogleOAuthProvider>
            </QueryClientProvider>
        </BrowserRouter>
    </React.StrictMode>
);
