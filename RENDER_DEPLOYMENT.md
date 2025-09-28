# Render Deployment Guide for Peptide Dojo

## 🚀 Quick Deploy to Render

### Prerequisites
- GitHub account with this repository
- Render account (free tier works!)
- Neon database (or any PostgreSQL database)

### Step 1: Database Setup
1. Create a free Neon database at https://console.neon.tech/
2. Copy your connection string (looks like: `postgresql://user:pass@host/dbname?sslmode=require`)

### Step 2: Connect to Render
1. Go to your Render dashboard
2. Click on your service: **Shrine-Repo-Dojo**
3. Go to the **Settings** tab

### Step 3: Repository Connection
1. In the **Repository** section:
   - Connect your GitHub account if not already connected
   - Select this repository: `erobrien/Shrine-Repo`
   - Set branch to `main`

### Step 4: Build & Deploy Settings
1. **Build Command**: `npm install && npm run build`
2. **Start Command**: `npm start`
3. **Node Version**: Set to 18.18.0 in Environment Variables

### Step 5: Environment Variables
Add these in the Render dashboard under **Environment**:
```
NODE_VERSION=18.18.0
NODE_ENV=production
PORT=10000
DATABASE_URL=your_neon_connection_string_here
SESSION_SECRET=click_generate_to_create_random_secret
```

### Step 6: Deploy
1. Click **Manual Deploy** → **Deploy latest commit**
2. Watch the build logs
3. Your app will be live at your Render URL!

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your database credentials

# Run development server
npm run dev
```

## 📁 Project Structure
```
shrine-repo-deploy/
├── client/          # React frontend
├── server/          # Express backend
├── shared/          # Shared types/schemas
├── public/          # Static assets
├── render.yaml      # Render configuration
└── package.json     # Dependencies
```

## 🔧 Troubleshooting

### Build Failures
- Check Node version is 18+
- Ensure all environment variables are set
- Check build logs for specific errors

### Database Connection Issues
- Verify DATABASE_URL is correct
- Ensure SSL is enabled (`?sslmode=require`)
- Check database is accessible from Render's servers

### Performance Tips
- Enable auto-scaling in Render settings
- Use Render's CDN for static assets
- Monitor with Render's built-in metrics

## 🎉 Success!
Once deployed, your Peptide Dojo will be running on Render with:
- Automatic HTTPS
- Health monitoring at `/api/health`
- Automatic deploys on git push
- Zero Replit credits needed!

Happy building! 🚀
