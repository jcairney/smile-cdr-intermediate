import { NgModule } from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import { BrowserModule } from '@angular/platform-browser';
import {FormDescriptionService} from "src/app/services/form-description.service";

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, ReactiveFormsModule,
  ],
  providers: [
    FormDescriptionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
