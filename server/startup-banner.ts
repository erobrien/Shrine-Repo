export function printStartupBanner() {
  const banner = `
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║                    🥋 PEPTIDE DOJO 🥋                         ║
║               By Shrine Peptides Research                     ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝

🌟 Starting server...
`;
  console.log(banner);
}

export function printConfigStatus() {
  console.log('\n📋 Configuration Status:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // Database status
  if (process.env.DATABASE_URL) {
    console.log('✅ DATABASE_URL: Connected');
  } else {
    console.log('⚠️  DATABASE_URL: Not configured (using in-memory storage)');
  }
  
  // Environment
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Port
  console.log(`🔌 Port: ${process.env.PORT || 5000}`);
  
  // Session secret
  if (process.env.SESSION_SECRET) {
    console.log('✅ SESSION_SECRET: Configured');
  } else {
    console.log('⚠️  SESSION_SECRET: Using default (not secure for production)');
  }
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

export function printReadyMessage(port: number | string) {
  console.log(`
🚀 Server is ready!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 Local:    http://localhost:${port}
🏥 Health:   http://localhost:${port}/api/health
📚 API Docs: http://localhost:${port}/api/peptides

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
}
