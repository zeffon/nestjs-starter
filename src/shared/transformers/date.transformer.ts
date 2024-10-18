import * as dayjs from 'dayjs'

export const dateTransformer = () => {
  return {
    from: (value: string | null) => {
      if (value) {
        return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
      }
      return null
    },
    to: (value: Date | undefined | null) => {
      if (value) {
        return dayjs(value).toISOString()
      }
      return undefined
    },
  }
}
