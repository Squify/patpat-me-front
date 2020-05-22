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
                            import('../pages/events/events.module').then(m => m.EventsPageModule)
                    },
                    {
                        path: 'create',
                        loadChildren: () =>
                            import('../pages/event-create/event-create.module').then(m => m.EventCreatePageModule)
                    },
                    {
                        path: 'event/:id',
                        loadChildren: () => import('../pages/event/event.module').then(m => m.EventPageModule)
                    },
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
                        path: 'profile',
                        loadChildren: () => import('../pages/profile/profile.module').then(m => m.ProfilePageModule)
                    }
                ]
            },
            {
                path: 'profile',
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('../pages/profile/profile.module').then(m => m.ProfilePageModule)
                    },
                    {
                        path: 'create-animal',
                        loadChildren: () => import('../pages/animal-create/animal-create.module').then(m => m.AnimalCreateModule)
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
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TabsPageRoutingModule {
}
