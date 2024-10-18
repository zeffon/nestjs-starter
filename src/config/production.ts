const production = {
  ENV: 'production',
  PORT: 12000,
  PREFIX: '/api',
  SECRET: {
    JWT_KEY: 'nestjs-starter',
    EXPIRES_IN: '7d',
  },
  DATABASE: {
    HOST: '127.0.0.1',
    PORT: 3306,
    USER: 'root',
    PASSWORD: '123456',
    DATABASE: 'nestjs',
    TIMEZONE: '+08:00',
  },
}

export default production
