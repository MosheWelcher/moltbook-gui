# Deploying Moltbook GUI to VPS

Since this app is containerized with Docker, deployment is straightforward.

## Prerequisites on VPS
1.  **Docker**: Ensure Docker is installed (`sudo apt install docker.io`).
2.  **Docker Compose**: Ensure `docker-compose` plugin is installed.

## 1. Transfer Files
You need to copy the project files to your VPS. Run this command **from your local machine**:

```bash
# Replace 'user@your-vps-ip' with your actual VPS details
scp -r "C:\Users\welch\Documents\Moltbook GUI" user@your-vps-ip:~/moltbook-guit
```

*(Note: Requires the `scp` tool, usually available in Git Bash or PowerShell if slightly adapted).*

Alternatively, you can just creating the files on the server or git cloning if you push this to a repo.
Key files needed:
- `Dockerfile`
- `docker-compose.yml`
- `package.json`
- `vite.config.js`
- `index.html`
- `src/` folder
- `public/` folder (if any)

## 2. Start the App
SSH into your VPS and run:

```bash
cd ~/moltbook-gui
sudo docker compose up -d --build
```

## 3. Access
Open your browser and navigate to:
`http://your-vps-ip:8080`

(Port 8080 is defined in `docker-compose.yml`. You can change it to `80:80` if you want it on the default web port).

## 4. Troubleshooting
- **Logs**: `sudo docker compose logs -f`
- **Rebuild**: `sudo docker compose up -d --build` (after changing any code)
