import { defineMetadata } from '@/shared'
import { TokenConfig } from './token'

export type Controller = (baseUrl?: string) => ClassDecorator
export const Controller: Controller = baseUrl => target => {
  baseUrl ??= '/'

  if (!baseUrl.startsWith('/')) baseUrl = '/' + baseUrl

  defineMetadata(TokenConfig.Controller, baseUrl, target)
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

  defineMetadata(TokenConfig.Moudle, config, target)
}

export type Injectable = () => ClassDecorator
export const Injectable: Injectable = () => target => {
  defineMetadata(TokenConfig.Injectable, true, target)
}
