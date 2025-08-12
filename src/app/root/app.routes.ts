import { Routes } from '@angular/router';

// --- Core and Pre-Login Components ---
import { LoginComponent } from '../components/prelogin/login/login.component';

// --- NEW postlogin Components ---
import { DashboardComponent } from '../components/postlogin/dashboard/dashboard.component';
import { HoldsComponent } from '../components/postlogin/holds/holds.component';
import { TrackableEntitiesComponent } from '../components/postlogin/trackable-entities/trackable-entities.component';
import { ReportsComponent } from '../components/postlogin/reports/reports.component';
import { DrdAdminComponent } from '../components/postlogin/drd-admin/drd-admin.component';
import { PolicyDashboardComponent } from '../components/postlogin/policy/policy-dashboard/policy-dashboard.component';
import { MyAppPoliciesComponent } from '../components/postlogin/policy/my-app-policies/my-app-policies.component';
import { AddNewPolicyComponent } from '../components/postlogin/policy/add-new-policy/add-new-policy.component';

export const routes: Routes = [
  // Default and login routes
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  // --- NEW Application Routes ---
  { path: 'dashboard', component: DashboardComponent },
  { path: 'holds', component: HoldsComponent },
  { path: 'trackable-entities', component: TrackableEntitiesComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'drd-admin', component: DrdAdminComponent },

  // Policy sub-routes
  { path: 'policy/dashboard', component: PolicyDashboardComponent },
  { path: 'policy/my-apps', component: MyAppPoliciesComponent },
  { path: 'policy/add', component: AddNewPolicyComponent },

  // Wildcard route to redirect unknown paths
  { path: '**', redirectTo: 'login' },
];
