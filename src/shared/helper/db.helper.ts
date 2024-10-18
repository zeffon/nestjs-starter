import { SelectQueryBuilder } from 'typeorm'

export const conditionFilterBuilder = <T>(
  queryBuilder: SelectQueryBuilder<T>,
  obj: Record<string, unknown>
) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key]) {
      queryBuilder.andWhere(`${key} = :${key}`, { [key]: obj[key] })
    }
  })
  return queryBuilder
}
