import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as bodyParser from 'koa-bodyparser';
import * as jwt from 'koa-jwt';
import * as staticFiles from 'koa-static';
import * as path from 'path';
import 'reflect-metadata';
import UnprotectRoutes from './router/unprotect-routes';
import ProtectRoutes from './router/protect-routes';
import routerResponse from './middle/response';
import { PORT } from './config';
import { JWT_SECRET } from './constants';
import { createConnection } from 'typeorm';
createConnection();
const app = new Koa();
const router = new Router();
const UnprotectRouter = new Router();
//Unprotected routes
UnprotectRoutes.forEach(route =>
  UnprotectRouter[route.method](route.path, route.action)
);
// needs JWT-TOKEN routes
ProtectRoutes.forEach(route => router[route.method](route.path, route.action));

app.use(staticFiles(path.join(__dirname, '../public')));
app.use(bodyParser());
app.use(routerResponse());
app.use(UnprotectRouter.routes());
app.use(UnprotectRouter.allowedMethods());
app.use(jwt({ secret: JWT_SECRET }));
app.use(router.routes());
app.use(router.allowedMethods());
// add a listen.
module.exports = app.listen(PORT, () => {
  console.log('server is running at http://localhost:3000');
});
