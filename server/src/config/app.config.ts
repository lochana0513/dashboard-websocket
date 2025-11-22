export default () => ({
  PORT: parseInt(process.env.PORT ?? '3000', 10),
  CLIENT_URL: process.env.CLIENT_URL ?? 'http://localhost:5173',
});
