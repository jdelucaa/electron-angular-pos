import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MainPosComponent} from './components/main-pos/main-pos.component';

const routes: Routes = [
    {
        path: '',
        component: MainPosComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
