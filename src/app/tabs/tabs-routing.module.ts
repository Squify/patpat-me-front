import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TabsPage} from './tabs.page';
import {AuthGuard} from '../guards/auth/auth.guard';

const routes: Routes = [
    {
        path: 'tabs',
        canActivate: [AuthGuard],
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
                        loadChildren: () =>
                            import('../pages/event-create/event-create.module').then(m => m.EventCreatePageModule)
                    }
                ]
            },
            {
                path: 'tab2',
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
                path: 'profil',
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('../pages/profile/profile.module').then(m => m.ProfilePageModule)
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
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TabsPageRoutingModule {
}
