import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { environment } from '../../../environment/environment';

export interface Policy {
  malcode: string;
  policyId: string;
  assetDborCode: string;
  recordType: string;
  inventoryType: string;
  retentionPeriod: string;
  effectiveDate: string;
  status: 'Approved' | 'Pending' | 'Rejected';
}

export interface PagedData {
  content: Policy[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface ApiResponse {
  message: string;
  status: string;
  data: PagedData;
}

@Injectable({
  providedIn: 'root'
})
export class MyAppPoliciesService {
  private apiUrl = environment.myAppPoliciesApiBaseUrl;

  constructor(private http: HttpClient) { }

  getPolicies(params: {
    page?: number;
    size?: number;
    sortBy?: string;
    direction?: 'asc' | 'desc';
  }): Observable<ApiResponse> {
    let httpParams = new HttpParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        httpParams = httpParams.set(key, value.toString());
      }
    });

    return this.http.get<ApiResponse>(this.apiUrl, { params: httpParams });
  }

  updatePolicy(policyId: string, policy: Partial<Policy>): Observable<any> {
    const updatedPolicy = { ...policy, policyId };
    return of({ status: 'success', message: 'Policy updated successfully.', data: updatedPolicy });
  }
}