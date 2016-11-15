import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from "@angular/router";
import {HomeComponent} from "./Components/Home.component";
import {LoginComponent} from "./Components/Login.component";

const appRoutes: Routes = [
    {path: '', component: HomeComponent },
    {path: 'login', component: LoginComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

export const routedComponents = [HomeComponent];