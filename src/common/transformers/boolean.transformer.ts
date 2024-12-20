export const BooleanTransformer = () => {
  return {
    to(value: boolean): number {
      return value ? 1 : 0
    },
    from(databaseValue: number): boolean {
      return databaseValue === 1
    },
  }
}
