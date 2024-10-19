import { TokenConfig } from './token'

export type Controller = (baseUrl?: string) => ClassDecorator
export const Controller: Controller = baseUrl => target => {
  Reflect.defineMetadata(TokenConfig.Controller, {
    baseUrl: baseUrl ?? '/',
    proto: target
  }, target)
}

export enum HttpMethod {
  Get = "get",
  Post = "post",
  Put = "put",
  Patch = "patch",
  Delete = "delete"
}
export type Router = (url?: string) => MethodDecorator
export type GenerateRouter = (type: HttpMethod) => Router
export const GenerateRouter: GenerateRouter = type => url => (target, key, desciper) => {
  Reflect.defineMetadata(TokenConfig.RouterMethod, type, target[key])
  Reflect.defineMetadata(TokenConfig.Router, url, target[key])
}

export const Get = GenerateRouter(HttpMethod.Get)
export const Post = GenerateRouter(HttpMethod.Post)
export const Put = GenerateRouter(HttpMethod.Put)
export const Patch = GenerateRouter(HttpMethod.Patch)
export const Delete = GenerateRouter(HttpMethod.Delete)

export type Constructor = (new (...args: any[]) => any)
export type Module = (config?: {
  controllers: Constructor[]
}) => ClassDecorator

export const Module: Module = config => target => {
  Reflect.defineMetadata(TokenConfig.Moudle, config, target)
}
