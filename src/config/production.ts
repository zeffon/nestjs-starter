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
  WX: {
    APP_ID: 'wxxxxxxxxxxxxxxxxx',
    APP_SECRET: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    SESSION_URL: 'https://api.weixin.qq.com/sns/jscode2session',
  },
}

export default production
