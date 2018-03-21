import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { WaterfallChartComponent } from './waterfall-chart/waterfall-chart.component';


@NgModule({
  declarations: [
    AppComponent,
    WaterfallChartComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
