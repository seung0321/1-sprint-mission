module.exports = {
  apps: [
    {
      name: 'panda-market',
      script: './dist/main.js',
      args: 'run start',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
