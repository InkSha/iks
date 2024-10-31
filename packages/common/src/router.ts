import { defineMetadata } from "@inksha/iks-shared"
import { HttpMethod, HttpStatusCode } from "./http"
import { TokenConfig } from "./token"

export type Router = (url?: string) => MethodDecorator
export type HttpCode = () => MethodDecorator

type GenerateRouter = (requestType: HttpMethod) => Router
type GenerateHttpCode = (code: HttpStatusCode) => HttpCode

const GenerateRouter: GenerateRouter = (requestType) => (url) => (target, key, desciper) => {
  defineMetadata(TokenConfig.RouterMethod, requestType, target[key])
  defineMetadata(TokenConfig.Router, url, target[key])
}

const GenerateHttpCode: GenerateHttpCode = (code) => () => (target, key, descriptor) => {
  defineMetadata(TokenConfig.HttpStatus, code, target[key])
}

export const Get = GenerateRouter(HttpMethod.Get)
export const Post = GenerateRouter(HttpMethod.Post)
export const Put = GenerateRouter(HttpMethod.Put)
export const Patch = GenerateRouter(HttpMethod.Patch)
export const Delete = GenerateRouter(HttpMethod.Delete)

export const Success = GenerateHttpCode(HttpStatusCode.Success)
export const NotFound = GenerateHttpCode(HttpStatusCode.NotFound)
