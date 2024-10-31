import express from 'express'
import { Constructor, HttpMethod, HTTPException, TokenConfig, HttpStatusCode, ParamsInfo, HttpParams } from '../common'
import { getMetadata } from '@/shared'

export class AppFactory {

  private readonly app = express()
  private entity: Map<Constructor, Constructor> = new Map()

  constructor(module: Constructor) {
    this.parseModule(module)
  }

  private parseModule = (module: Constructor) => {
    const { providers, controllers } = getMetadata(TokenConfig.Moudle, module)

    for (const controller of controllers) {
      this.app.use(this.parseController(controller, providers))
    }
  }

  private toEntity(proto: Constructor, providers: Constructor[] = []) {
    if (this.entity.has(proto)) {
      return this.entity.get(proto)
    } else {
      const params = []

      try {
        const args = getMetadata('design:paramtypes', proto) as Constructor[]
        params
          .push(...(args).map(constructor => this.toEntity(constructor, providers))
          )
      }
      catch {}

      const entity = new proto(...params)

      this.entity.set(proto, entity)

      return entity
    }
  }

  private parseController(controller: Constructor, providers?: Constructor[]) {
    const router = express.Router()

    const baseUrl = getMetadata(TokenConfig.Controller, controller)
    const entityMethodNames = this.getMethodList(controller.prototype)
    const entity = this.toEntity(controller, providers)

    for (const name of entityMethodNames) {

      const {
        fn, url, method, params, statusCode
      } = this.parseRouterFnData(entity, name, baseUrl)

      router[method](url, async (req, res) => {

        const p = this.getParams(req, params)
        const data = this.callHandle(fn, entity, p)

        if (statusCode) res.status(statusCode)

        res.send(data)
      })
    }

    return router
  }

  private getMethodList = (entity: Constructor) => {
    return Object.getOwnPropertyNames(entity.prototype).filter(name => name !== 'constructor')
  }

  private getParams(req: express.Request, params?: ParamsInfo[]) {
    const p = []

    if (params) {
      p.push(...new Array(Math.max(...params.map(v => v.index))))
      for (const { type, index, prototype } of params) {
        p[index] = prototype
          ? req[type][prototype]
          : req[type]
      }
    }

    return p
  }

  private async callHandle(fn: Function, caller: Object, params: any[]) {
    const result = {
      code: HttpStatusCode.Success,
      msg: 'Success',
      data: null
    }
    try {
      const data = fn.call(caller, ...params)

      result.data = data instanceof Promise
        ? await data
        : data
    }
    catch (e: unknown) {
      const isHTTPException = e instanceof HTTPException

      result.code = isHTTPException ? e.code : HttpStatusCode.ServerError
      result.msg = isHTTPException ? e.message : 'unknown error'
    }
    finally {
      return result
    }
  }

  private parseRouterFnData(entity: Constructor, name: string, baseUrl = '/') {
    const fn = entity[name] as (...args: any[]) => any
    const url = this.join(baseUrl, getMetadata(TokenConfig.Router, fn) as string)
    const method = getMetadata(TokenConfig.RouterMethod, fn) as HttpMethod
    const params = getMetadata(TokenConfig.Params, fn) as ParamsInfo[]
    const statusCode = getMetadata(TokenConfig.HttpStatus, fn) as HttpStatusCode | undefined

    return { fn, url, method, params, statusCode }
  }

  private join(...urls: string[]) {
    return urls.map(url => url.replaceAll('\\', '/')).join('/').replace(/\/{2,}/g, '/')
  }

  public start() {
    this.app.listen(3001, () => {
      console.log('run')
    })
  }
}