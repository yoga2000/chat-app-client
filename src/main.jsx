import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { UserProvider } from "./context/userContext.jsx";

createRoot(document.getElementById("root")).render(
  <UserProvider>
    <App />
  </UserProvider>
);
