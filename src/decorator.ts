import { TokenConfig } from './token'

export type Controller = (baseUrl?: string) => ClassDecorator
export const Controller: Controller = baseUrl => target => {

  baseUrl ??= '/'

  if (!baseUrl.startsWith('/')) baseUrl = '/' + baseUrl

  Reflect.defineMetadata(TokenConfig.Controller, baseUrl, target)
}

export enum HttpMethod {
  Get = "get",
  Post = "post",
  Put = "put",
  Patch = "patch",
  Delete = "delete"
}
export type Router = (url?: string) => MethodDecorator
export type GenerateRouter = (requestType: HttpMethod) => Router
export const GenerateRouter: GenerateRouter = requestType => url => (target, key, desciper) => {
  Reflect.defineMetadata(TokenConfig.RouterMethod, requestType, target[key])
  Reflect.defineMetadata(TokenConfig.Router, url, target[key])
}

export const Get = GenerateRouter(HttpMethod.Get)
export const Post = GenerateRouter(HttpMethod.Post)
export const Put = GenerateRouter(HttpMethod.Put)
export const Patch = GenerateRouter(HttpMethod.Patch)
export const Delete = GenerateRouter(HttpMethod.Delete)

export type Param = (prototype?: string) => ParameterDecorator
export const Param: Param = (prototype?: string) => (target, key, index) => {
  const data = Reflect.getMetadata(TokenConfig.Params, target[key]) ?? []
  data.push({
    type: 'params',
    index,
    prototype
  })
  Reflect.defineMetadata(TokenConfig.Params, data, target[key])
}

export type Constructor = (new (...args: any[]) => any)
export type ModuleConfig = {
  controllers: Constructor[],
  providers: Constructor[]
}
export type Module = (config?: Partial<ModuleConfig>) => ClassDecorator

export const Module: Module = config => target => {
  config ??= {}
  config.controllers ??= []
  config.providers ??= []

  Reflect.defineMetadata(TokenConfig.Moudle, config, target)
}

export type Injectable = () => ClassDecorator
export const Injectable: Injectable = () => target => {
  Reflect.defineMetadata(TokenConfig.Injectable, true, target)
}

export enum HttpStatusCode {
  Success = 200,
  NotFound = 404
}

type HttpCode = () => MethodDecorator
type GenerateHttpCode = (code: HttpStatusCode) => HttpCode
const GenerateHttpCode: GenerateHttpCode = code => () => (target, key, descriptor) => {
  Reflect.defineMetadata(TokenConfig.HttpStatus, code, target[key])
}

export const Success = GenerateHttpCode(HttpStatusCode.Success)
export const NotFound = GenerateHttpCode(HttpStatusCode.NotFound)

export class NotFoundError extends Error {
  public code = HttpStatusCode.NotFound

  constructor(message: string) {
    super(message)
    this.name = 'NotFoundAssets'
  }
}
