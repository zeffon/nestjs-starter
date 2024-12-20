export const ArrayTransformer = () => {
  return {
    to(value: null | any[]): any[] {
      return value === null ? [] : value
    },
    from(databaseValue: null | any[]): any[] {
      return databaseValue === null ? [] : databaseValue
    },
  }
}
