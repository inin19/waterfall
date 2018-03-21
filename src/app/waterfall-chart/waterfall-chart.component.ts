import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as crossfilter from 'crossfilter2';

@Component({
  selector: 'app-waterfall-chart',
  templateUrl: './waterfall-chart.component.html',
  styleUrls: ['./waterfall-chart.component.css']
})
export class WaterfallChartComponent implements OnInit {

  constructor() { }

  abc = [1, 2, 3];
  ndx: any;

  ngOnInit() {
    this.ndx = crossfilter(this.abc);


  }

}
