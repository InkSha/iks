import 'reflect-metadata'
import { Constructor, Controller, Get, HttpMethod, Module, Post } from './decorator';
import { TokenConfig } from './token';
import * as express from 'express';

@Controller()
class AppController {

  @Get('home')
  public Home () {
    return {
      code: 200,
      data: 'home'
    }
  }

  @Get('login')
  public async Login () {
    return {
      code: 200,
      data: 'login'
    }
  }
}

@Module({
  controllers: [AppController]
})
class AppModule {}

const isAsyncFn = (fn: Function) => fn.constructor.name === "AsyncFunction";

const join = (...urls: string[]) => urls.map(url => url.replaceAll('\\', '/')).join('/').replace(/\/{2,}/g, '/')

const parseController = (controller: Constructor) => {
  const router = express.Router()
  const controllerData = Reflect.getMetadata(TokenConfig.Controller, controller)
  const baseUrl = controllerData.baseUrl

  const entityMethodNames = Object.getOwnPropertyNames(controller.prototype).filter(name => name !== 'constructor')

  for (const name of entityMethodNames) {
    const url = Reflect.getMetadata(TokenConfig.Router, controller.prototype[name]) as string
    const method = Reflect.getMetadata(TokenConfig.RouterMethod, controller.prototype[name]) as HttpMethod
    const fn = controller.prototype[name]

    router[method](join(baseUrl, url), (req, res) => {
      new Promise(async (resolve, reject) => {
        if (isAsyncFn(fn)) {
          resolve(await fn())
        } else {
          resolve(fn())
        }
      })
        .then(data => {
          res.send(data)
        })
    })
  }

  return router
}

const f = (module: Constructor) => {
  const app = express()

  const config = Reflect.getMetadata(TokenConfig.Moudle, module)
  for (const controller of config.controllers) {
    app.use(parseController(controller))
  }

  app.listen(3000, () => {
    console.log('run')
  })
}

f(AppModule)
