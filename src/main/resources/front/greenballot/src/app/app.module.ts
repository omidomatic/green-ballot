import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {AppComponent} from "./app.component";
import {BrowserModule} from "@angular/platform-browser";
import {RouterModule, RouterOutlet} from "@angular/router";
import {CalendarModule} from "primeng/calendar";
import {AutoCompleteModule} from "primeng/autocomplete";
import {InputGroupModule} from "primeng/inputgroup";
import {InputGroupAddonModule} from "primeng/inputgroupaddon";
import {CardModule} from "primeng/card";
import {ToolbarModule} from "primeng/toolbar";
import {AvatarModule} from "primeng/avatar";
import {BadgeModule} from "primeng/badge";
import {MenubarModule} from "primeng/menubar";
import {ToastModule} from "primeng/toast";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AppRoutes} from "./app.routes";
import {authTokenInterceptor} from "./service/auth-token.interceptor";


@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    RouterOutlet,
    CalendarModule,
    AutoCompleteModule,
    InputGroupModule,
    InputGroupAddonModule,
    CardModule,
    ToolbarModule,
    AvatarModule,
    BadgeModule,
    MenubarModule,
    ToastModule,
    HttpClientModule,
    AppRoutes,
  ],
  providers:[
    {
      provide: HTTP_INTERCEPTORS,
      useValue: authTokenInterceptor,
      multi: true,
    }
  ],
  bootstrap:[AppComponent],

})
export class AppModule { }
