import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { UserProvider } from "./context/UserContext";

// const CLIENT_ID = "231795283840-ai3mhfs4qk2cmig5p7c5pcts27jl55rd.apps.googleusercontent.com";


const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <UserProvider>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <BrowserRouter>
                <QueryClientProvider client={queryClient}>
                    {/* <GoogleOAuthProvider clientId={CLIENT_ID}> */}
                        <App />
                    {/* </GoogleOAuthProvider> */}
                </QueryClientProvider>
            </BrowserRouter>
        </UserProvider>
    </React.StrictMode>
);
