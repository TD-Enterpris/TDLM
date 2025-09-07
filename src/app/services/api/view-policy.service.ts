import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';

export interface Approver {
  approvalGroup: string;
  status: string;
  approverId: string;
  created: string;
  decisionDate: string;
  comments: string;
}

export interface PolicyDetails {
  malcode: string;
  assetDborCode: string;
  recordType: string;
  inventoryType: string;
  retentionPeriod: string;
  effectiveDate: string;
  status: string;
  policyParameter: string;
  jurisdiction: string;
  businessArea: string;
  businessCapability: string;
  mediaStorageType: string;
  retentionCode: string;
  retentionTrigger: string;
  expirationDate: string;
  createdBy: string;
  updatedBy: string;
  createdDate: string;
  updatedDate: string;
  description: string;
  approvers: Approver[];
  policyId: string;
}

export interface ApiResponse<T> {
  message: string;
  status: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class ViewPolicyService {
  private apiUrl = environment.myAppPoliciesApiBaseUrl;

  constructor(private http: HttpClient) { }

  getPolicyById(id: string): Observable<ApiResponse<PolicyDetails>> {
    return this.http.get<ApiResponse<PolicyDetails>>(`${this.apiUrl}/${id}`);
  }

  updateExpirationDate(id: string, expirationDate: string): Observable<ApiResponse<PolicyDetails>> {
    const url = `${this.apiUrl}/${id}/expiration`;
    return this.http.put<ApiResponse<PolicyDetails>>(url, { expirationDate });
  }
}
