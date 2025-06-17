// PM2 Ecosystem Configuration for Production
module.exports = {
  apps: [
    {
      name: 'grafopptak',
      script: 'npm',
      args: 'start',
      cwd: '/home/storm/grafopptak',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        NEXT_PUBLIC_APP_URL: 'https://opptaksapp.smidigakademiet.no',
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
    },
  ],
};
