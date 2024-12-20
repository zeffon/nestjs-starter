import * as dayjs from 'dayjs'

export const DateTransformer = () => {
  return {
    to: (value: Date | undefined | null) => {
      if (value) {
        return dayjs(value).toISOString()
      }
      return undefined
    },
    from: (databaseValue: string | null) => {
      if (databaseValue) {
        return dayjs(databaseValue).format('YYYY-MM-DD HH:mm:ss')
      }
      return null
    },
  }
}
