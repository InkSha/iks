
import { Controller, Get, Injectable, Module, Param } from './decorator';
import { AppFactory } from './core';

@Controller('user')
class AppController {

  @Get('home')
  public Home () {
    return {
      code: 200,
      data: 'home'
    }
  }

  @Get('login')
  public async Login (
    @Param('name') name: string,
    @Param('pwd') pwd: string
  ) {
    return {
      code: 200,
      data: 'login',
      name,
      pwd
    }
  }
}

@Injectable()
class AppService {

}

@Module({
  controllers: [AppController],
  providers: [AppService]
})
class AppModule {}

const boostrap = () => {
  const app = AppFactory(AppModule)

  app.start()
}

boostrap()
