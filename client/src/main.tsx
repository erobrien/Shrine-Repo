import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

console.log("🚀 React app starting...");
console.log("📍 Current URL:", window.location.href);

// Add global error handler
window.addEventListener('error', (event) => {
  console.error("❌ Global JavaScript error:", event.error);
  console.error("❌ Error details:", event);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error("❌ Unhandled promise rejection:", event.reason);
});

try {
  const rootElement = document.getElementById("root");
  console.log("🎯 Root element found:", rootElement);
  
  if (rootElement) {
    console.log("⚛️ Creating React root...");
    const root = createRoot(rootElement);
    console.log("✅ React root created");
    
    console.log("🎯 Rendering App component...");
    root.render(<App />);
    console.log("✅ React app mounted successfully!");
  } else {
    console.error("❌ Root element not found!");
  }
} catch (error) {
  console.error("❌ Error mounting React app:", error);
  console.error("❌ Error stack:", error.stack);
}
