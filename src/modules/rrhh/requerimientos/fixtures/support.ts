import { MOCK_KIND, type MockAdapter } from '../../../../container/fixtures'

export { MOCK_KIND, type MockAdapter }

export function cloneFixtureValue<T>(value: T): T {
  return structuredClone(value)
}

export type FixtureResponse<T, TArgs extends readonly unknown[]> =
  | T
  | ((...args: TArgs) => T | Promise<T>)

export async function resolveFixtureResponse<T, TArgs extends readonly unknown[]>(
  response: FixtureResponse<T, TArgs>,
  ...args: TArgs
): Promise<T> {
  const value =
    typeof response === 'function'
      ? await (response as (...input: TArgs) => T | Promise<T>)(...args)
      : response
  return cloneFixtureValue(value)
}
