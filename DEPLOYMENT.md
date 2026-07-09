# Deployment Guide - Accounting 2026

## Quick Start with Docker

### Prerequisites
- Docker
- Docker Compose

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/congviecpro26-sudo/accounting-2026.git
   cd accounting-2026
   ```

2. **Setup environment variables**
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

3. **Update configurations**
   - Edit `backend/.env` with your database and JWT settings
   - Edit `frontend/.env` with your API URL

4. **Run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

## Manual Deployment

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your settings
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your settings
npm run build
npm start
```

## Production Deployment

### Using PM2 for Node.js

```bash
# Install PM2 globally
npm install -g pm2

# Start backend
cd backend
npm install --production
pm2 start src/app.js --name "accounting-backend"

# Save PM2 configuration
pm2 save
pm2 startup
```

### Using Nginx as Reverse Proxy

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000/api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Database Backup

```bash
# Backup MongoDB
mongodump --db accounting-2026 --out ./backup

# Restore MongoDB
mongorestore --db accounting-2026 ./backup/accounting-2026
```

## Monitoring

- Use PM2 monitoring: `pm2 monit`
- Check logs: `pm2 logs accounting-backend`
- Monitor system resources

## SSL/TLS Configuration

Use Let's Encrypt with Certbot:

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d your-domain.com
```

Update Nginx configuration with SSL certificates.
