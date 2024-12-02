import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {VoteNowComponent} from "./vote-now.component";

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: VoteNowComponent }
    ])],
    exports: [RouterModule]
})
export class VoteNowRoutingModule { }
