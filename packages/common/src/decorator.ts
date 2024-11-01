import { defineMetadata } from "@inksha/iks-shared"
import { TokenConfig } from "./token"

export type Controller = (baseUrl?: string) => ClassDecorator
export const Controller: Controller =
  (baseUrl = "/") =>
  (target) => {
    const prefix = !baseUrl.startsWith("/") ? `/${baseUrl}` : baseUrl

    defineMetadata(TokenConfig.Controller, prefix, target)
  }

export type Constructor = new (...args: unknown[]) => {}
export type ModuleConfig = {
  controllers: Constructor[]
  providers: Constructor[]
  imports: Constructor[]
  exports: Constructor[]
}

export type Module = (config?: Partial<ModuleConfig>) => ClassDecorator
export const Module: Module =
  (config = {}) =>
  (target) => {
    config.controllers ??= []
    config.providers ??= []
    config.exports ??= []
    config.imports ??= []

    defineMetadata(TokenConfig.Moudle, config, target)
  }

export type Injectable = () => ClassDecorator
export const Injectable: Injectable = () => (target) => {
  defineMetadata(TokenConfig.Injectable, true, target)
}
