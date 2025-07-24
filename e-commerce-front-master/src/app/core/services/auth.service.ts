import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environnement } from '../../../environnemt/environnement';
import { ICreateUser } from '../../common/types/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = environnement.authApi;

  constructor(private readonly httpClient: HttpClient) {}

  signIn(credentials: { email: string; password: string }) {
    return this.httpClient.post(`${this.apiUrl}/auth/sign-in`, credentials);
  }

  signUp(credentials: ICreateUser) {
    return this.httpClient.post(`${this.apiUrl}/auth/sign-up`, credentials);
  }

  confirmEmail(payload: { id: string; code: string }) {
    return this.httpClient.post(`${this.apiUrl}/auth/two-fa`, payload);
  }

  forgotPassword(payload: { email: string }) {
    return this.httpClient.post(`${this.apiUrl}/auth/forgot-password`, payload);
  }
  resetPassword(payload: { password: string; token: string }) {
    return this.httpClient.post(`${this.apiUrl}/auth/reset-password`, payload);
  }
  findAll(page: number = 1, limit: number = 10, query: any = {}) {
    return this.httpClient.post(
      `${this.apiUrl}/auth/all?page=${page}&limit=${limit}`,
      query
    );
  }
}
