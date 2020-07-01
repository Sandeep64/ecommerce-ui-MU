import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Catalogue } from '../../models/catalogue/catalogue';
import { Item } from '../../models/item/item';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private _httpClient: HttpClient) {}

  getCatalogues(): Observable<Catalogue> {
    return this._httpClient.get<Catalogue>(
      `${environment.BASE_URL}catalogues`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  getItems(): Observable<Item> {
    return this._httpClient.get<Item>(`${environment.BASE_URL}items`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
