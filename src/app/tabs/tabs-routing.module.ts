import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthGuard } from '../guards/auth/auth.guard';

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
                        path: 'event/:id',
                        children: [
                            {
                                path: '',
                                loadChildren: () =>
                                    import('../pages/event/event.module').then(m => m.EventPageModule)
                            },
                            {
                                path: 'edit-event',
                                loadChildren: () => import('../pages/event-edit/event-edit.module').then(m => m.EventEditPageModule)
                            }
                        ]
                    },
                    {
                        path: 'create-event',
                        loadChildren: () =>
                            import('../pages/event-create/event-create.module').then(m => m.EventCreatePageModule)
                    }
                ]
            },
            {
                path: 'meet',
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('../pages/meet/meet.module').then(m => m.MeetPageModule)
                    },
                    {
                        path: 'user/:id',
                        children: [
                            {
                                path: '',
                                loadChildren: () =>
                                    import('../pages/user-profile/user-profile.module').then(m => m.UserProfilePageModule)
                            },
                            {
                                path: 'animal/:id',
                                children: [
                                    {
                                        path: '',
                                        loadChildren: () =>
                                            import('../pages/animal/animal.module').then(m => m.AnimalPageModule)
                                    },
                                ]
                            }
                        ]
                    },
                ]
            },
            {
                path: 'friends',
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('../pages/friends/friends.module').then(m => m.FriendsPageModule)
                    },
                    {
                        path: 'user/:id',
                        children: [
                            {
                                path: '',
                                loadChildren: () =>
                                    import('../pages/user-profile/user-profile.module').then(m => m.UserProfilePageModule)
                            },
                            {
                                path: 'animal/:id',
                                children: [
                                    {
                                        path: '',
                                        loadChildren: () =>
                                            import('../pages/animal/animal.module').then(m => m.AnimalPageModule)
                                    },
                                ]
                            }
                        ]
                    },
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
                        path: 'edit-profile',
                        loadChildren: () => import('../pages/profile-edit/profile-edit.module').then(m => m.EditProfilePageModule)
                    },
                    {
                        path: 'create-animal',
                        loadChildren: () => import('../pages/animal-create/animal-create.module').then(m => m.AnimalCreateModule)
                    },
                    {
                        path: 'animal/:id',
                        children: [
                            {
                                path: '',
                                loadChildren: () =>
                                    import('../pages/animal/animal.module').then(m => m.AnimalPageModule)
                            },
                            {
                                path: 'edit-animal',
                                loadChildren: () => import('../pages/animal-edit/animal-edit.module').then(m => m.AnimalEditModule)
                            },
                        ]
                    },
                    {
                        path: 'legals',
                        loadChildren: () => import('../pages/legals/legals.module').then( m => m.LegalsPageModule)
                    },
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
