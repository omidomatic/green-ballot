import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectUploadRoutingModule } from './project-upload-routing.module';
import {ProjectUploadComponent} from "./project-upload.component";
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import {FormsModule} from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import {CardModule} from "primeng/card";

@NgModule({
  imports: [
    CommonModule,
    ProjectUploadRoutingModule,
    ProjectUploadComponent,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    FormsModule,
    PasswordModule,
    CardModule,

  ],
    declarations: []
})
export class ProjectUploadModule { }
