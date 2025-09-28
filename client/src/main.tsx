import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

console.log("🚀 React app starting...");
console.log("📍 Current URL:", window.location.href);

try {
  const rootElement = document.getElementById("root");
  console.log("🎯 Root element found:", rootElement);
  
  if (rootElement) {
    const root = createRoot(rootElement);
    console.log("⚛️ Creating React root...");
    root.render(<App />);
    console.log("✅ React app mounted successfully!");
  } else {
    console.error("❌ Root element not found!");
  }
} catch (error) {
  console.error("❌ Error mounting React app:", error);
}
