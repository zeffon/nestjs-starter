export const uniqueBy = <T>(array: T[], identifierFunc: (item: T) => any): T[] => {
  const seenIdentifiers = new Set()
  return array.filter((item) => {
    const identifier = identifierFunc(item)
    if (seenIdentifiers.has(identifier)) {
      return false
    } else {
      seenIdentifiers.add(identifier)
      return true
    }
  })
}
