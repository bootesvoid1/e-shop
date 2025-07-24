import { Injectable } from '@angular/core';
import { environnement } from '../../../environnemt/environnement';
import { HttpClient } from '@angular/common/http';
import { ITags } from '../../common/types/tags/tags';

@Injectable({
  providedIn: 'root',
})
export class TagsService {
  apiUrl = environnement.authApi;
  constructor(private readonly httpClient: HttpClient) {}

  create(payload: ITags) {
    return this.httpClient.post(`${this.apiUrl}/tags`, payload);
  }
  findAll(page: number = 1, limit: number = 10, query: any = {}) {
    return this.httpClient.post(
      `${this.apiUrl}/tags/all?page=${page}&limit=${limit}`,
      query
    );
  }

  findUnpaginated() {
    return this.httpClient.get(`${this.apiUrl}/tags`);
  }
  findOne(id: string) {
    return this.httpClient.get(`${this.apiUrl}/tags/${id}`);
  }
  update(id: string, payload: Partial<ITags>) {
    return this.httpClient.patch(`${this.apiUrl}/tags/${id}`, payload);
  }
  delete(id: string) {
    return this.httpClient.delete(`${this.apiUrl}/tags/${id}`);
  }
}
