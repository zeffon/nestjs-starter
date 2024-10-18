/**
 * sleep function
 * @param delay ms
 */
export const sleep = async (delay = 3000) => {
  return new Promise<void>((resolve) => setTimeout(() => resolve(), delay))
}
