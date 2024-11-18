import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetInvolvedRoutingModule } from './get-involved-routing.module';
import {GetInvolvedComponent} from "./get-involved.component";
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import {FormsModule} from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import {CardModule} from "primeng/card";

@NgModule({
  imports: [
    CommonModule,
    GetInvolvedRoutingModule,
    GetInvolvedComponent,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    FormsModule,
    PasswordModule,
    CardModule,

  ],
    declarations: []
})
export class GetInvolvedModule { }
