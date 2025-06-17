# 🌐 Hosting Guide - opptaksapp.smidigakademiet.no

Guide for å hoste grafopptak-systemet på hjemmePC med portforwarding.

## 🚀 Rask start

```bash
# 1. Sett opp produksjonsmiljø
npm run production:setup

# 2. Start applikasjon
npm run production:start
```

## 📋 Detaljert oppsett

### 1. Produksjonsoppsett

```bash
npm run production:setup
```

Dette scriptet:

- Installerer PM2
- Bygger Next.js applikasjon
- Starter Neo4j database
- Setter opp database med testdata
- Starter applikasjon med PM2
- Konfigurerer autostart

### 2. Nettverkskonfigurasjon

#### Portforwarding på ruter:

- **Port 3000** → din PC (Next.js applikasjon)
- **Port 7474** → din PC (Neo4j Browser) - valgfritt for administrasjon

#### DNS konfigurasjon:

- Sett `opptaksapp.smidigakademiet.no` til din offentlige IP-adresse

### 3. SSL/HTTPS (anbefalt)

For produksjon anbefales HTTPS med SSL-sertifikat:

```bash
# Installer certbot for Let's Encrypt
sudo apt install certbot

# Generer sertifikat
sudo certbot certonly --standalone -d opptaksapp.smidigakademiet.no

# Start med nginx reverse proxy for SSL
docker-compose -f docker-compose.production.yml --profile ssl up -d
```

## 🔧 Administrasjon

### PM2 kommandoer:

```bash
npm run production:start     # Start applikasjon
npm run production:stop      # Stopp applikasjon
npm run production:restart   # Restart applikasjon
npm run production:logs      # Se logger

# Direkte PM2 kommandoer:
pm2 status                   # Status oversikt
pm2 monit                    # Real-time monitoring
pm2 save                     # Lagre PM2 konfigurasjon
```

### Database administrasjon:

```bash
npm run db:stats             # Database statistikk
npm run db:reset             # Reset og seed database
npm run db:admin             # Database admin tool
```

## 🌍 Miljøvariabler

Rediger `.env.production` for produksjonskonfigurasjon:

```env
# Application
NEXT_PUBLIC_APP_URL=https://opptaksapp.smidigakademiet.no
PORT=3000

# Database
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password

# Security
NEXTAUTH_SECRET=your-production-secret-here
```

## 🔐 Sikkerhet

- [ ] Endre default Neo4j passord
- [ ] Sett sterk NEXTAUTH_SECRET
- [ ] Konfigurer firewall (kun port 3000 og 22 åpen)
- [ ] Sett opp SSL/HTTPS sertifikat
- [ ] Vurder nginx rate limiting

## 📊 Overvåkning

### Logger:

- PM2 logger: `./logs/`
- Next.js logger: konsoll via PM2
- Neo4j logger: Docker container

### Ytelse:

```bash
pm2 monit                    # Real-time PM2 monitoring
docker stats                 # Docker container ressursbruk
```

## 🛠️ Feilsøking

### Applikasjon starter ikke:

```bash
pm2 logs grafopptak          # Se detaljerte logger
npm run db:stats             # Sjekk database tilkobling
```

### Database problemer:

```bash
docker-compose logs neo4j    # Neo4j logger
npm run db:reset             # Reset database
```

### Nettverksproblemer:

- Sjekk portforwarding på ruter
- Verifiser DNS konfiguration
- Test lokal tilgang: `curl http://localhost:3000`

## 🔄 Oppdateringer

```bash
# 1. Stopp applikasjon
npm run production:stop

# 2. Hent nye endringer (git pull)
git pull origin main

# 3. Bygg og restart
npm run build
npm run production:start
```
