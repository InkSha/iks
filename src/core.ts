import 'reflect-metadata'
import * as express from 'express'
import { Constructor, HttpMethod, NotFoundError } from './decorator'
import { TokenConfig } from './token'

export * from './decorator'

export class AppFactory {

  private readonly app = express()
  private entity: Map<Constructor, Constructor> = new Map()

  constructor(module: Constructor) {
    this.parseModule(module)
  }

  private parseModule = (module: Constructor) => {
    const { providers, controllers } = Reflect.getMetadata(TokenConfig.Moudle, module)

    for (const controller of controllers) {
      this.app.use(
        this.parseController(controller, providers)
      )
    }
  }

  private toEntity(proto: Constructor, providers: Constructor[] = []) {
    if (this.entity.has(proto)) {
      return this.entity.get(proto)
    } else {
      const params = []

      try {
        const args = Reflect.getMetadata('design:paramtypes', proto) as Constructor[]
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
    const baseUrl = Reflect.getMetadata(TokenConfig.Controller, controller)
    const entityMethodNames = Object.getOwnPropertyNames(controller.prototype).filter(name => name !== 'constructor')

    const entity = this.toEntity(controller, providers)

    for (const name of entityMethodNames) {
      const fn = entity[name] as (...args: any[]) => any
      const url = Reflect.getMetadata(TokenConfig.Router, fn) as string
      const method = Reflect.getMetadata(TokenConfig.RouterMethod, fn) as HttpMethod
      const params = Reflect.getMetadata(TokenConfig.Params, fn)
      const statusCode = Reflect.getMetadata(TokenConfig.HttpStatus, fn)

      const path = this.join(baseUrl, url)
      router[method](path, (req, res) => {
        new Promise(async (resolve, reject) => {
          const p = []

          if (params) {
            p.push(
              ...new Array(Math.max(...params.map(v => v.index)))
            )
            for (const { type, index, prototype } of params) {
              if (type === 'params') {
                p[index] = req.query[prototype]
              }
            }
          }

          try {
            const result = fn.call(entity, ...p)

            if (result instanceof Promise) {
              resolve(await result)
            } else {
              resolve(result)
            }
          }
          catch (e: unknown) {
            if (e instanceof NotFoundError) {
              res.status(e.code)
              resolve({
                code: e.code,
                msg: e.message,
                name: e.name
              })
            } else {
              resolve('unknow error')
            }
          }
        })
          .then(data => {
            if (statusCode) {
              res.status(statusCode)
            }

            return data
          })
          .then(data => {
            res.send(data)
          })
      })
    }

    return router
  }

  // private isAsyncFn(fn: Function) {
  //   return fn.constructor.name === "AsyncFunction"
  // }

  private join(...urls: string[]) {
    return urls.map(url => url.replaceAll('\\', '/')).join('/').replace(/\/{2,}/g, '/')
  }

  public start() {
    this.app.listen(3001, () => {
      console.log('run')
    })
  }
}
