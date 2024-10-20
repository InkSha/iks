import 'reflect-metadata'
import * as express from 'express';
import { Constructor, HttpMethod } from './decorator';
import { TokenConfig } from './token';

export * from './decorator'

const isAsyncFn = (fn: Function) => fn.constructor.name === "AsyncFunction";

const join = (...urls: string[]) => urls.map(url => url.replaceAll('\\', '/')).join('/').replace(/\/{2,}/g, '/')

const parseController = (controller: Constructor) => {
  const router = express.Router()
  const controllerData = Reflect.getMetadata(TokenConfig.Controller, controller)
  const baseUrl = controllerData.baseUrl

  const entityMethodNames = Object.getOwnPropertyNames(controller.prototype).filter(name => name !== 'constructor')

  for (const name of entityMethodNames) {
    const fn = controller.prototype[name] as (...args: any[]) => any
    const url = Reflect.getMetadata(TokenConfig.Router, fn) as string
    const method = Reflect.getMetadata(TokenConfig.RouterMethod, fn) as HttpMethod
    const params = Reflect.getMetadata(TokenConfig.Params, fn)

    const path = join(baseUrl, url)
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

        if (isAsyncFn(fn)) {
          resolve(await fn(...p))
        } else {
          resolve(fn(...p))
        }
      })
        .then(data => {
          res.send(data)
        })
    })
  }

  return router
}

export const AppFactory = (module: Constructor) => {
  const app = express()

  const config = Reflect.getMetadata(TokenConfig.Moudle, module)
  for (const controller of config.controllers) {
    app.use(
      parseController(controller)
    )
  }

  app.listen(3000, () => {
    console.log('run')
  })
}
