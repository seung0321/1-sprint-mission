module.exports = {
  apps: [
    {
      name: 'panda-market',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
