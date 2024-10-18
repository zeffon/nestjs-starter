import development from './development'
import production from './production'

export default () => {
  return getConfig()
}

const getConfig = () => {
  const env = process.env.NODE_ENV || 'development'
  if (env === 'production') {
    return production
  } else {
    return development
  }
}
