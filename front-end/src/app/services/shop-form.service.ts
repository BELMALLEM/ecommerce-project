import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class ShopFormService {

  private baseUrl = 'http://localhost:8080/api';

  constructor(private httpClient: HttpClient) { }

  getCountries(): Observable<Country[]>{
    const searchUrl = `${this.baseUrl}/countries`;

    return this.httpClient.get<GetResponseCountries>(searchUrl).pipe(
      map(response => response._embedded.countries)
    )

  }

  getStates(countryCode: string): Observable<State[]>{
    const searchUrl = `${this.baseUrl}/states/search/findByCountryCode?code=${countryCode}`;

    return this.httpClient.get<GetResponseStates>(searchUrl).pipe(
      map(response => response._embedded.states)
    )
  }

  getCreditCardMonths(startMonth: number): Observable<number[]>{
    let data: number[] = [];

    for(let month=startMonth; month<=12; month++){
      data.push(month);
    }

    return of(data);
  }

  getCreditCardYears(): Observable<number[]>{
    let data: number[] = [];
    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for(let year=startYear; year <= endYear; year++){
      data.push(year);
    }

    return of(data);
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