import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { checkAndImportPeptides, checkAndImportGuides } from "./auto-import";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // AUTOMATIC PEPTIDE IMPORT: Check and import peptides if database is empty
  console.log('🚀 Server starting...');
  console.log('📊 Checking peptide database...');
  
  try {
    const imported = await checkAndImportPeptides();
    if (imported) {
      console.log('🎯 Peptides imported successfully!');
    } else {
      console.log('✓ Peptides already exist or import skipped.');
    }
  } catch (error) {
    console.error('⚠️  Warning: Failed to check/import peptides:', error);
    console.error('The server will continue without peptides data.');
  }

  // AUTOMATIC GUIDE GENERATION: Check and generate research guides if database is empty
  console.log('📚 Checking research guides database...');
  
  try {
    const generated = await checkAndImportGuides();
    if (generated) {
      console.log('🎯 Research guides generated successfully!');
    } else {
      console.log('✓ Research guides already exist or generation skipped.');
    }
  } catch (error) {
    console.error('⚠️  Warning: Failed to check/generate guides:', error);
    console.error('The server will continue without research guides.');
  }
  
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
