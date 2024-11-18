import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GetInvolvedComponent} from "./get-involved.component";

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: GetInvolvedComponent }
    ])],
    exports: [RouterModule]
})
export class GetInvolvedRoutingModule { }
