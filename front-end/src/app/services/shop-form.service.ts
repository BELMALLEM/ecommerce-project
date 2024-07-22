import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShopFormService {

  private baseUrl = environment.api.url;

  constructor(private httpClient: HttpClient) { }

  getCountries(): Observable<Country[]>{
    const searchUrl = `${this.baseUrl}/countries`;

    return this.httpClient.get<GetResponseCountries>(searchUrl).pipe(
      map(response => response._embedded.countries)
    )

  }

  getStates(countryCode: string): Observable<State[]>{
    const searchUrl = `${this.baseUrl}/states/search/country?code=${countryCode}`;

    return this.httpClient.get<GetResponseStates>(searchUrl).pipe(
      map(response => response._embedded.states)
    )
  }
}


interface GetResponseCountries {
  _embedded: {
    countries: Country[]
  }
}

interface GetResponseStates {
  _embedded: {
    states: State[]
  }
}