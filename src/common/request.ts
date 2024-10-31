import { defineMetadata, getMetadata } from '@/shared'
import { TokenConfig } from './token'

export enum HttpParams {
  query = 'query',
  params = 'params',
  body = 'body'
}

export interface ParamsInfo {
  prototype: string
  index: number
  type: HttpParams
}

export type Param = (prototype?: string) => ParameterDecorator

type GenerateParam = (type: HttpParams) => Param

const GenerateParam: GenerateParam = (type) => (prototype?: string) => (target, key, index) => {
  const data: ParamsInfo[] = getMetadata(TokenConfig.Params, target[key]) ?? []
  data.push({ type, index, prototype })
  defineMetadata(TokenConfig.Params, data, target[key])
}

export const Params = GenerateParam(HttpParams.params)
export const Query = GenerateParam(HttpParams.query)
export const Body = GenerateParam(HttpParams.body)
