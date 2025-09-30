sudo bash -e -c '
  set -e  # Exit immediately if a command exits with a non-zero status
  set -o pipefail  # Fail if any command in a pipeline fails

  echo "🔄 Pulling latest code..."

  # Mark the directory as safe for Git
  sudo git config --global --add safe.directory /home/azureuser/nyx-campaign-analytics-dashboard

  # Change directory
  cd /home/azureuser/nyx-campaign-analytics-dashboard

  # Fix ownership (in case root touched files earlier)
  sudo chown -R azureuser:azureuser /home/azureuser/nyx-campaign-analytics-dashboard

  # Set GitHub remote with personal access token
  sudo git remote set-url origin https://'"$GH_PERSONAL_ACCESS_TOKEN"'@github.com/tech-nyx/nyx-campaign-analytics-dashboard.git

  # Pull latest changes
  sudo git pull --no-rebase --no-edit

  # Install dependencies
  sudo npm install

  # Build frontend
  sudo npm run build

  echo "🚀 Restarting frontend app using PM2..."

  # Restart or start PM2 process
  sudo pm2 restart static-page-server-3003

  sudo pm2 status

  echo "✅ Deployment complete!"
'
