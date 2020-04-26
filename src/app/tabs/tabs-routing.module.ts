import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TabsPage} from './tabs.page';
import {AuthGuard} from '../guards/auth/auth.guard';

const routes: Routes = [
    {
        path: 'tabs',
        component: TabsPage,
        children: [
            {
                path: 'events',
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('../pages/tab1/tab1.module').then(m => m.Tab1PageModule)
                    },
                    {
                        path: 'create',
                        canActivate: [AuthGuard],
                        loadChildren: () =>
                            import('../pages/event-create/event-create.module').then(m => m.EventCreatePageModule)
                    }
                ]
            },
            {
                path: 'tab2',
                // canActivate: [AuthGuard],
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('../pages/tab2/tab2.module').then(m => m.Tab2PageModule)
                    },
                    {
                        path: 'profil',
                        loadChildren: () => import('../pages/profile/profile.module').then(m => m.ProfilePageModule)
                    }
                ]
            },
            {
                path: 'tab3',
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('../pages/tab3/tab3.module').then(m => m.Tab3PageModule)
                    }
                ]
            },
            {
                path: '',
                redirectTo: '/tabs/events',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '',
        redirectTo: '/tabs/events',
        pathMatch: 'full'
    },
    {
        path: 'account-create',
        loadChildren: () =>
            import('../pages/account-create/account-create.module').then(m => m.AccountCreatePageModule)
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TabsPageRoutingModule {
}
