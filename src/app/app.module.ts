import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { WaterfallChartComponent } from './waterfall-chart/waterfall-chart.component';
import { ClaimDataService } from './service/claim-data.service';


@NgModule({
  declarations: [
    AppComponent,
    WaterfallChartComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    ClaimDataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
