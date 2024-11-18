import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {AccountComponent} from "./account.component";

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: AccountComponent }
    ])],
    exports: [RouterModule]
})
export class AccountRoutingModule { }
