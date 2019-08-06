import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
  HttpResponse
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError as observableThrowError } from "rxjs";
import { catchError, finalize, map } from "rxjs/operators";

@Injectable()
export class RemoteService {
  public readonly publicURL: string;

  constructor(private httpClient: HttpClient) {
    this.publicURL = "http://127.0.0.1:5500/";
  }

  private setHeaders(): HttpHeaders {
    let headersConfig = {
      "Content-type": "application/json; charset=utf-8",
      Accept: "application/json"
    };

    return new HttpHeaders(headersConfig);
  }

  public get(
    path: string,
    params: HttpParams = new HttpParams()
  ): Observable<any> {
    return this.httpClient
      .get(this.publicURL + path, {
        headers: this.setHeaders(),
        params: params,
        observe: "response"
      })
      .pipe(
        catchError(this.handleError),
        map(p => p.body)
      );
  }

  public put<REQUEST>(
    path: string,
    params: HttpParams = new HttpParams(),
    request: REQUEST
  ): Observable<any> {
    return this.httpClient
      .put(this.publicURL + path, JSON.stringify(request), {
        headers: this.setHeaders(),
        params: params,
        observe: "response"
      })
      .pipe(
        catchError(this.handleError),
        map(p => p.body)
      );
  }

  public post<REQUEST>(
    path: string,
    params: HttpParams = new HttpParams(),
    request: REQUEST
  ): Observable<any> {
    return this.httpClient
      .post(this.publicURL + path, JSON.stringify(request), {
        headers: this.setHeaders(),
        params: params,
        observe: "response"
      })
      .pipe(
        catchError(this.handleError),
        map(p => p.body)
      );
  }

  // public delete<RESPONSE>(path: string): Observable<RESPONSE> {
  //     let token = this.chromiumGlobalService.authenticationToken.value;
  //     let logEnd = this.logStart('delete ' + path);
  //     return this.httpClient
  //         .delete(this.publicURL + this.apiUrl + path, {
  //             headers: this.setHeaders(token),
  //             observe: 'response',
  //         })
  //         .pipe(
  //             catchError(this.handleErrors.bind(this)),
  //             finalize(logEnd),
  //             map((res: HttpResponse<RESPONSE>) => this.decode(res, true, true, null)),
  //         );
  // }

  private handleError(error) {
    alert("Network error happened. please check the serices");
    return observableThrowError(error);
  }
}
