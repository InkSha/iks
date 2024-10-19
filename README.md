# Simple Nest

一个简易的 Nest.js

用于学习 IoC (Inversion of Control 控制反转) 和 DI (Dependency Injection 依赖注入) 思想。

传统开发时，一切对象都由开发者手动创建，需要什么就 `new` 什么。并不通过中间者。

而 IoC 是一种设计思想。将原本手动创建对象的控制权交由框架处理。DI 则是 IoC 的实现。

通过这个库，可以学习到：

- 装饰器。
- 元数据。
- IoC 思想。
- DI 的实现。

## 实现 Controller

在这一环节，将实现一个路由控制器。

将实现：

- 路由前缀定义
- 子路由路径定义
- 子路由方法定义
- 路由参数传递
- 设置状态码

```ts
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
```

### 定义路由

### 获取路由

### 绑定路由

### 异步路由

### 路由传参

## 实现 Service

### 实现注入

## 实现 Module

### 解析 module

### 实例化

## 实现 DI
