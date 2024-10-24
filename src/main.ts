
import { Controller, Get, Injectable, Module, Param } from './decorator'
import { AppFactory } from './core'

@Injectable()
class AppService {
  private _count: number = 0

  constructor() {
    console.log('service init')
  }
  public async login(name: string, pwd: string) {
    return (name === 'test' && pwd === '123')
  }

  public count() {
    return this._count++
  }
}


@Controller('user')
class AppController {
  constructor(
    private readonly service: AppService,
  ) {
    console.log('init', service)
  }

  @Get('home')
  public Home() {
    return {
      code: 200,
      data: 'home'
    }
  }

  @Get('login')
  public async Login(
    @Param('name') name: string,
    @Param('pwd') pwd: string
  ) {
    return this.service.login(name, pwd).then(pass => {
      return {
        code: 200,
        data: 'login',
        count: this.service.count(),
        msg: pass ? 'success' : 'failure'
      }
    })
  }
}

@Controller('user')
class UserController {
  constructor(
    private readonly service: AppService
  ) {
    console.log('init', service)
  }

  @Get('test')
  public test() {
    return {
      count: this.service.count()
    }
  }
}

@Module({
  controllers: [AppController, UserController],
  providers: [AppService]
})
class AppModule {}

const boostrap = () => {
  const app = new AppFactory(AppModule)

  app.start()
}

boostrap()
