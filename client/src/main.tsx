// FIXED: Wait for DOM to be ready
console.log("🚀 JavaScript executing...");
console.log("📍 Current URL:", window.location.href);
console.log("🌍 Window object:", typeof window);
console.log("📄 Document object:", typeof document);
console.log("📄 Document ready state:", document.readyState);

// Add global error handler
window.addEventListener('error', (event) => {
  console.error("❌ Global JavaScript error:", event.error);
  console.error("❌ Error details:", event);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error("❌ Unhandled promise rejection:", event.reason);
});

// Function to update DOM
function updateDOM() {
  try {
    console.log("🎯 Testing DOM access...");
    const rootElement = document.getElementById("root");
    console.log("🎯 Root element found:", rootElement);
    
    if (rootElement) {
      console.log("✅ Root element exists, updating innerHTML...");
      rootElement.innerHTML = `
        <div style="padding: 20px; background-color: #f0f0f0; font-family: Arial, sans-serif;">
          <h1>🚀 JavaScript is Working!</h1>
          <p>Current URL: ${window.location.href}</p>
          <p>Current Path: ${window.location.pathname}</p>
          <p>Timestamp: ${new Date().toISOString()}</p>
          <p>Root element: ${rootElement.tagName}</p>
          <p>Document ready state: ${document.readyState}</p>
        </div>
      `;
      console.log("✅ DOM updated successfully!");
    } else {
      console.error("❌ Root element not found!");
    }
  } catch (error) {
    console.error("❌ Error accessing DOM:", error);
    console.error("❌ Error stack:", error.stack);
  }
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  console.log("⏳ DOM is loading, waiting for DOMContentLoaded...");
  document.addEventListener('DOMContentLoaded', updateDOM);
} else {
  console.log("✅ DOM is already ready, updating immediately...");
  updateDOM();
}

// Test React imports separately
console.log("🔄 Testing React imports...");
try {
  import("react-dom/client").then((ReactDOM) => {
    console.log("✅ React DOM imported successfully:", ReactDOM);
    
    import("./App").then((AppModule) => {
      console.log("✅ App component imported successfully:", AppModule);
      
      // Now try React mounting
      const rootElement = document.getElementById("root");
      if (rootElement && ReactDOM.createRoot) {
        console.log("⚛️ Creating React root...");
        const root = ReactDOM.createRoot(rootElement);
        console.log("✅ React root created");
        
        console.log("🎯 Rendering App component...");
        // Import React for createElement
        import("react").then((React) => {
          root.render(React.createElement(AppModule.default));
          console.log("✅ React app mounted successfully!");
        }).catch((error) => {
          console.error("❌ Error importing React:", error);
        });
      }
    }).catch((error) => {
      console.error("❌ Error importing App component:", error);
    });
  }).catch((error) => {
    console.error("❌ Error importing React DOM:", error);
  });
} catch (error) {
  console.error("❌ Error with dynamic imports:", error);
}
