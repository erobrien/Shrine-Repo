import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

console.log("🚀 React app starting...");

// Add global error handler
window.addEventListener('error', (event) => {
  console.error("❌ Global JavaScript error:", event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error("❌ Unhandled promise rejection:", event.reason);
});

// Function to mount React app
function mountReactApp() {
  try {
    const rootElement = document.getElementById("root");
    console.log("🎯 Root element found:", rootElement);
    
    if (rootElement) {
      console.log("⚛️ Creating React root...");
      const root = createRoot(rootElement);
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
}

// FIXED: Wait for DOM to be ready before mounting React
if (document.readyState === 'loading') {
  console.log("⏳ DOM is loading, waiting for DOMContentLoaded...");
  document.addEventListener('DOMContentLoaded', mountReactApp);
} else {
  console.log("✅ DOM is already ready, mounting React immediately...");
  mountReactApp();
}
