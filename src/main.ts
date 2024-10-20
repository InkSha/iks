
import { Controller, Get, Module, Param } from './decorator';
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

@Module({
  controllers: [AppController]
})
class AppModule {}

AppFactory(AppModule)
