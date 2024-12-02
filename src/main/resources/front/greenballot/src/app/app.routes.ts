import {ExtraOptions, RouterModule, Routes} from '@angular/router';
import {NgModule} from "@angular/core";

// export const routes: Routes = [];
export const routes: Routes = [

  {
    path: 'admin',
    loadChildren: () => import('./pages/admin/admin.module')
      .then(m => m.AdminModule),
  },
  {
    path: 'landing',
    loadChildren: () => import('./pages/landing/landing.module')
      .then(m => m.LandingModule),
  },
  {
    path: 'vote-now',
    loadChildren: () => import('./pages/vote-now/vote-now.module')
      .then(m => m.VoteNowModule),
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/auth/login/login.module')
      .then(m => m.LoginModule),
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/auth/register/register.module')
      .then(m => m.RegisterModule),
  },
  {
    path: 'new-project',
    loadChildren: () => import('./pages/project-upload/project-upload.module')
      .then(m => m.ProjectUploadModule),
  },
  {
    path: 'account',
    loadChildren: () => import('./pages/account/account.module')
      .then(m => m.AccountModule),
  },
  {
    path: 'get-involved',
    loadChildren: () => import('./pages/get-involved/get-involved.module')
      .then(m => m.GetInvolvedModule),
  },
  {
    path: '',
    redirectTo: '/landing',
    pathMatch: 'full'
  },


];

const config: ExtraOptions = {
  useHash: false,
};

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutes {
}
