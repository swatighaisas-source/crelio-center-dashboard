import { createContext, useContext, type ReactNode } from 'react';
import { makePaths, type ParamPaths } from './paths';

/**
 * Holds the dynamic mount base for the parameter-setup tool inside the host
 * (e.g. `/lab/123/center/parameter-setup`). Provided by ParameterSetupApp.
 */
const ParamBaseContext = createContext<string>('');

export function ParamBaseProvider({
  base,
  children,
}: {
  base: string;
  children: ReactNode;
}) {
  return <ParamBaseContext.Provider value={base}>{children}</ParamBaseContext.Provider>;
}

export function useParamBase(): string {
  return useContext(ParamBaseContext);
}

export function useParamPaths(): ParamPaths {
  return makePaths(useParamBase());
}
