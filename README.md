# Angular

This directory is a brief example of an [Angular](https://angular.io/) app that can be deployed to Vercel with zero configuration.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.1.3.

## Deploy Your Own

Deploy your own Angular project with Vercel.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/framework-boilerplates/angular&template=angular)

_Live Example: https://angular-template.vercel.app_

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

Estrutura inicial do projeto
src/
├── app/
│ ├── core/ # Serviços e funcionalidades centrais
│ │ ├── services/ # Serviços globais (ex.: autenticação, API)
│ │ ├── guards/ # Guards para rotas (ex.: AuthGuard)
│ │ ├── interceptors/ # Interceptadores HTTP (ex.: token JWT)
│ │ └── core.module.ts # Módulo central (se necessário)
│ ├── shared/ # Componentes, diretivas e pipes reutilizáveis
│ │ ├── components/ # Componentes compartilhados (ex.: navbar, footer)
│ │ ├── directives/ # Diretivas personalizadas
│ │ ├── pipes/ # Pipes reutilizáveis
│ │ └── shared.module.ts # Módulo compartilhado
│ ├── features/ # Funcionalidades principais do sistema
│ │ ├── auth/ # Módulo de autenticação (login, registro)
│ │ ├── sales/ # Módulo de vendas
│ │ ├── clients/ # Módulo de clientes
│ │ ├── inventory/ # Módulo de estoque
│ │ └── dashboard/ # Módulo do painel principal
│ ├── app.routes.ts # Configuração de rotas principais
│ ├── app.component.ts # Componente raiz
│ └── app.component.html # Template do componente raiz
├── assets/ # Arquivos estáticos (imagens, ícones, etc.)
├── environments/ # Configurações de ambiente (dev, prod)
└── styles/ # Estilos globais (CSS/SCSS)
