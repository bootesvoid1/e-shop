import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NominatimService {
  API_URL = 'https://nominatim.openstreetmap.org/search';
  constructor(private readonly http: HttpClient) {}

  searchCities(query: string) {
    const params = new HttpParams()
      .set('city', query)
      .set('countrycodes', 'tn')
      .set('format', 'jsonv2')
      .set('limit', '10');

    return this.http.get<any[]>(this.API_URL, {
      params,
    });
  }
}
