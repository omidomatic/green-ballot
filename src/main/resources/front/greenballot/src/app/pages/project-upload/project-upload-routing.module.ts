import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {ProjectUploadComponent} from "./project-upload.component";

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: ProjectUploadComponent }
    ])],
    exports: [RouterModule]
})
export class ProjectUploadRoutingModule { }
