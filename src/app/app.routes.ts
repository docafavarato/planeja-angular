import { Routes } from '@angular/router';
import { Template } from './template/template';
import { RegisterCard } from './cards/register-card/register-card';
import { CardsList } from './cards/cards-list/cards-list';

export const routes: Routes = [
    {
        path: 'pages',
        component: Template,
        children: [
            {
                path: 'register-cards',
                component: RegisterCard
            },
            {
                path: 'cards-list',
                component: CardsList
            }
        ]
    }
];
