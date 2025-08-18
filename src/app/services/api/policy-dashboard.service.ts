import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';

export interface NewPolicy {
  [key: string]: string;
  jurisdiction: string;
  businessArea: string;
  inventoryType: string;
  entityType: string;
  description: string;
  retentionPeriod: string;
  effectiveDate: string;
  policyParameter: string;
  mediaStorageType: string;
  expirationDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class PolicyDashboardService {
  private readonly baseUrl = environment.policyDashboardApiBaseUrl;

  constructor(private http: HttpClient) {}

  getPolicies(params: {
    jurisdiction?: string;
    businessArea?: string;
    inventoryType?: string;
    entityType?: string;
    status?: string;
    policyParameter?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    direction?: 'asc' | 'desc';
  }): Observable<any> {
    let httpParams = new HttpParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        httpParams = httpParams.set(key, value.toString());
      }
    });

    return this.http.get<any>(this.baseUrl, { params: httpParams });
  }

  getDropdownOptions(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/options`);
  }

  createPolicy(policy: NewPolicy): Observable<any> {
    return this.http.post<any>(this.baseUrl, policy);
  }
}