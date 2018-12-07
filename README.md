[![Angular Logo](./logo-angular.jpg)](https://angular.io/) [![Electron Logo](./logo-electron.jpg)](https://electron.atom.io/)

# Introduction

Currently runs with:

- Angular v7.0.3
- Electron v3.0.2
- Electron Builder v20.28.1

## Getting Started

Clone this repository locally :

``` bash
git clone https://github.com/jdelucaa/electron-angular-pos
```

Install dependencies with npm :

``` bash
npm install
```

There is an issue with `yarn` and `node_modules` that are only used in electron on the backend when the application is built by the packager. Please use `npm` as dependencies manager.

## To build for development

- **in a terminal window** -> npm start  

Voila! You can use Angular + Electron app in a local development environment with hot reload !

The application code is managed by `main.ts`. In this sample, the app runs with a simple Angular App (http://localhost:4200) and an Electron window.  
The Angular component contains an example of Electron and NodeJS native lib import.  
You can disable "Developer Tools" by commenting `win.webContents.openDevTools();` in `main.ts`.

## Included Commands

|Command|Description|
|--|--|
|`npm run ng:serve:web`| Execute the app in the browser | <-- not working because of the use of node's fs to read data files.
|`npm run build`| Build the app. Built files are in the /dist folder. |
|`npm run build:prod`| Build the app with Angular aot. Built files are in the /dist folder. |
|`npm run electron:local`| Builds the application and start electron
|`npm run electron:linux`| Builds the application and creates an app consumable on linux system |
|`npm run electron:windows`| On a Windows OS, builds the application and creates an app consumable in windows 32/64 bit systems |
|`npm run electron:mac`|  On a MAC OS, builds the application and generates a `.app` file of the application that can be run on Mac |

**The application is optimised. Only /dist folder and node dependencies are included in the executable.**