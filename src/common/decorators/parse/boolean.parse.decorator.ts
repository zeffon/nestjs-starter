import { Transform } from 'class-transformer'

export const ParseBoolean = () => {
  return Transform(
    ({ value }) => {
      if (typeof value === 'string') {
        return value.toLowerCase() === 'true' || value === '1'
      }
      return Boolean(value)
    },
    { toClassOnly: true }
  )
}
