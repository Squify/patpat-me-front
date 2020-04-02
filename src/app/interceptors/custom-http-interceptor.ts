import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpXsrfTokenExtractor} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CustomHttpInterceptor implements HttpInterceptor {

    constructor(readonly tokenExtractor: HttpXsrfTokenExtractor) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        /*
        withCredentials : allow the browser to send cookies, needed since Spring (J2EE in general)
        works with the JSESSIONID cookie for sessions

        We also need to manually define a header named X-XSRF-TOKEN to send the CSRF Token value, if the backend send us
        a CSRF token and we are trying to access its endpoints

        Necessary because HttpClientXsrfModule (which handle CSRF) doesn't work if the url path starts with http:// or https://
        */

        let clonedRequest = req.clone({
            withCredentials: true
        });

        const csrfToken = this.tokenExtractor.getToken() as string;

        if (csrfToken !== null && req.url && req.url.startsWith(environment.BACKEND_URL)
            && req.method.toString() !== 'GET' && req.method.toString() !== 'HEAD') {

            clonedRequest = req.clone({
                setHeaders: {'X-XSRF-TOKEN': csrfToken},
                withCredentials: true
            });
        }

        return next.handle(clonedRequest);
    }
}
