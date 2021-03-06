import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoggedInPersonResolver } from './resolver/logged-in-person-resolver';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
    },
    {
        path: 'login',
        resolve: {
            loggedInPerson: LoggedInPersonResolver
        },
        loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
    },
    {
        path: 'account-create',
        loadChildren: () =>
            import('./pages/account-create/account-create.module').then(m => m.AccountCreatePageModule)
    },
    {
        path: 'legals',
        loadChildren: () => import('./pages/legals/legals.module').then(m => m.LegalsPageModule)
    },
    {
        path: 'cgu',
        loadChildren: () => import('./pages/cgu/cgu.module').then( m => m.CguPageModule)
    },

];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
