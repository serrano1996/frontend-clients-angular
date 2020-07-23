import { Injectable } from '@angular/core';
import { formatDate, DatePipe } from '@angular/common';

import { Client } from '../components/clients/Client';
//import { CLIENTS } from '../components/clients/clients.json';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private urlEndPoint: string = 'http://localhost:8080/api/clients';
  private httpHeaders = new HttpHeaders({
    'Content-type': 'application/json'
  });

  constructor(private http: HttpClient,
    private router: Router) { }

  getClients(page: number): Observable<any> {
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      tap((res: any) => {
        (res.content as Client[]).forEach(client => {
          console.log(client.name)
        });
      }),
      map((res: any) => {
        (res.content as Client[]).map(client => {
          client.name = client.name.toUpperCase();
          let datePipe = new DatePipe('es');
          client.createdAt = datePipe.transform(client.createdAt, 'EEEE dd/MM/yyyy');
          //formatDate(client.createdAt, 'dd/MM/yyyy', 'en-US');
          return client;
        });
        return res;
      }),
      tap(res => {
        (res.content as Client[]).forEach(client => {
          console.log(client.name)
        });
      })
    );
  }

  getClient(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/clients']);
        console.error(e.error.message);
        Swal.fire(
          'Error al editar',
          e.error.message,
          'error'
        );
        return throwError(e);
      })
    );
  }

  create(client: Client): Observable<Client> {
    return this.http.post(this.urlEndPoint, client, {headers: this.httpHeaders}).pipe(
      map((res: any) => res.client as Client),
      catchError(e => {
        if(e.status === 400) {
          return throwError(e);
        }
        console.error(e.error.message);
        Swal.fire(
          e.error.message,
          e.error.error,
          'error'
        );
        return throwError(e);
      })
    );
  }

  update(client: Client): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/${client.id}`, client, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        if(e.status === 400) {
          return throwError(e);
        }
        console.error(e.error.message);
        Swal.fire(
          e.error.message,
          e.error.error,
          'error'
        );
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<Client> {
    return this.http.delete<Client>(`${this.urlEndPoint}/${id}`, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.error(e.error.message);
        Swal.fire(
          e.error.message,
          e.error.error,
          'error'
        );
        return throwError(e);
      })
    );
  }

  uploadImage(file: File, id): Observable<HttpEvent<{}>> {
    let formData = new FormData();
    formData.append('file', file);
    formData.append('id', id);

    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
      reportProgress: true
    });

    return this.http.request(req);
  }

}
