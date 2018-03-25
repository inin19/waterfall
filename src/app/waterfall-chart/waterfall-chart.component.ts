import { Component, OnInit, OnChanges, ViewChild, Input, ElementRef, ViewEncapsulation, HostListener } from '@angular/core';
import { ClaimsData } from '../model/claims-data';

import * as d3 from 'd3';

@Component({
  selector: 'app-waterfall-chart',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './waterfall-chart.component.html',
  styleUrls: ['./waterfall-chart.component.css']
})
export class WaterfallChartComponent implements OnInit, OnChanges {
  @ViewChild('claimsWaterfall') private chartContainer: ElementRef;

  @Input() private claimsJsonData: any[];
  @Input() private totalMemberCount: any[];

  private benchmarkClaimData: ClaimsData;
  private benchmarkConditionGroupData: any[];
  private benchmarkGraphData: any[];


  // d3 related variables
  private margin: any = { top: 60, right: 20, bottom: 80, left: 40 };
  private chart: any;
  private width: number;
  private height: number;
  private xScale: any;
  private yScale: any;
  private xAxis: any;
  private yAxis: any;
  private svg: any;





  constructor() { }

  ngOnInit() {
    // console.log(this.claimsJsonData);
    this.getChartData();
    this.createChart();
    this.updateChart(this.claimsJsonData);

  }

  ngOnChanges() {
    if (this.chart) {
      console.log('ngChange');
    }
  }

  getChartData() {
    this.benchmarkClaimData = new ClaimsData(this.claimsJsonData, this.totalMemberCount);
    this.benchmarkConditionGroupData = this.benchmarkClaimData.getConditionGroupDataCombined();
    this.benchmarkGraphData = this.benchmarkClaimData.getGraphData();

    // this.benchmarkClaimData.processGraphData(this.totalMemberCount,
    //   ['REGION_CENTRAL_LONDON', 'REGION_GREATER_LONDON'], undefined, ['F'], ['CLAIM_TYPE_DAYCARE', 'CLAIM_TYPE_IN_PATIENT']);


    // console.log(this.benchmarkClaimData.getWaterfallPrevYearData());
    // console.log(this.benchmarkClaimData.getWaterfallConditionGroupData());
    // console.log(this.benchmarkClaimData.getWaterfallCurrYearData());

    // this.benchmarkClaimData.sortWaterfallASC();
    // this.benchmarkClaimData.sortWaterfallDESC();
    // this.benchmarkClaimData.restoreWaterfallOrder();

  }


  createChart() {
    const htmlElement = this.chartContainer.nativeElement;
    this.width = htmlElement.offsetWidth - this.margin.left - this.margin.right;
    this.height = htmlElement.offsetHeight - this.margin.top - this.margin.bottom;


    this.svg = d3.select('#claimsWaterfall').append('svg')
      .attr('width', htmlElement.offsetWidth)
      .attr('height', htmlElement.offsetHeight);


    this.chart = this.svg
      .append('g')
      .classed('bars', true)
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);


    // console.log(this.benchmarkClaimData.getGraphMaxValue());

    // create scales
    this.xScale = d3.scaleBand()
      .domain(this.benchmarkClaimData.getGraphData()[0].map(val => (val.data.key)))
      .rangeRound([0, this.width])
      .padding(0.2);

    this.yScale = d3.scaleLinear()
      .domain([0, this.benchmarkClaimData.getGraphMaxValue()])
      .range([this.height, 0]);

    // x & y axis
    const xaxis = d3.axisBottom(this.xScale)
      .tickSizeOuter(0);

    const yaxis = d3.axisLeft(this.yScale)
      .tickSizeOuter(0)
      .tickFormat(d3.format('.2s'));

    this.xAxis = this.chart.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${this.height})`)
      .call(xaxis);

    this.yAxis = this.chart.append('g')
      .attr('class', 'y axis')
      .call(yaxis);

    d3.select('.x.axis').selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)');
  }

  updateChart(claimsJsonData: any[]) {

  }

}
