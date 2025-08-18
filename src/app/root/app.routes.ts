import { Routes } from '@angular/router';

import { LoginComponent } from '../components/prelogin/login/login.component';
import { DashboardComponent } from '../components/postlogin/dashboard/dashboard.component';
import { HoldsComponent } from '../components/postlogin/holds/holds.component';
import { TrackableEntitiesComponent } from '../components/postlogin/trackable-entities/trackable-entities.component';
import { ReportsComponent } from '../components/postlogin/reports/reports.component';
import { DrdAdminComponent } from '../components/postlogin/drd-admin/drd-admin.component';
import { PolicyDashboardComponent } from '../components/postlogin/policy/policy-dashboard/policy-dashboard.component';
import { MyAppPoliciesComponent } from '../components/postlogin/policy/my-app-policies/my-app-policies.component';
import { ViewPolicyComponent } from '../components/postlogin/policy/view-policy/view-policy.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'holds', component: HoldsComponent },
  { path: 'trackable-entities', component: TrackableEntitiesComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'drd-admin', component: DrdAdminComponent },
  { path: 'policy/dashboard', component: PolicyDashboardComponent },
  { path: 'policy/my-apps', component: MyAppPoliciesComponent },
  { path: 'view-policy/:id', component: ViewPolicyComponent },
  { path: '**', redirectTo: 'login' },
];