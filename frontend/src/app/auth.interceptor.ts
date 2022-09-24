import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {SessionService} from "./session.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private sessionService: SessionService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.sessionService.jwt)
      return next.handle(request);

    const req = request.clone({
      headers: request.headers.append('Authorization', `Bearer ${this.sessionService.jwt}`),
    });

    return next.handle(req);
  }
}
