import { Component, OnInit, OnChanges, ViewChild, Input, ElementRef, ViewEncapsulation, HostListener } from '@angular/core';
import { ClaimsData } from '../model/claims-data';
import { FormControl, FormGroup } from '@angular/forms';

import * as d3 from 'd3';

@Component({
  selector: 'app-waterfall-chart',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './waterfall-chart.component.html',
  styleUrls: ['./waterfall-chart.component.css']
})
export class WaterfallChartComponent implements OnInit, OnChanges {

  private static stackColor = {
    Base: '#FFFFFF',
    Fall: '#FFA500',
    Rise: '#0000FF'
  };

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


  // form related
  benchmarkOrder = 'Default';
  form: FormGroup;



  constructor() { }

  ngOnInit() {

    this.form = new FormGroup({
      sorting: new FormControl('Default'),
    });

    this.onFormChanges();

    // console.log(this.claimsJsonData);
    this.updateChartData();
    this.createChart();
    this.updateChart(this.claimsJsonData);

  }

  onFormChanges() {
    this.form.get('sorting').valueChanges.subscribe(val => {
      // console.log('value chnaged: ', val);
      this.benchmarkClaimData.sortConditionGroupData(val);

      // graph data is not changing
      this.updateChart(this.claimsJsonData);
    });
  }

  ngOnChanges() {
    if (this.chart) {
      console.log('ngChange, Input data change');
      this.updateChartData();
      this.updateChart(this.claimsJsonData);
    }
  }

  updateChartData() {
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

  updateChart(claimsJsonData: any[], region?: string[], relation?: string[],
    gender?: string[], claimType?: string[], ageGroup?: string[]) {
    // update size
    const htmlElement = this.chartContainer.nativeElement;
    this.width = htmlElement.offsetWidth - this.margin.left - this.margin.right;
    this.height = htmlElement.offsetHeight - this.margin.top - this.margin.bottom;

    d3
      .select('#claimsWaterfall svg')
      .attr('width', htmlElement.offsetWidth)
      .attr('height', htmlElement.offsetHeight);

    // update scales
    this.xScale.rangeRound([0, this.width]);
    this.yScale.range([this.height, 0]);

    // update graph data based on parameters
    // add parameters later
    this.benchmarkClaimData.processGraphData(this.totalMemberCount);
    this.benchmarkGraphData = this.benchmarkClaimData.getGraphData();

    // console.log(this.benchmarkGraphData);

    this.benchmarkGraphData.forEach(element => {
      console.log(element);
    });

    // update scale domain
    this.xScale.domain(this.benchmarkClaimData.getGraphData()[0].map(val => (val.data.key)));
    this.yScale.domain([0, this.benchmarkClaimData.getGraphMaxValue()]);

    // update axis
    const xaxis = d3.axisBottom(this.xScale)
      .tickSizeOuter(0);

    const yaxis = d3.axisLeft(this.yScale)
      .tickSizeOuter(0)
      .tickFormat(d3.format('.2s'));

    this.xAxis.transition().call(xaxis);
    this.yAxis.transition().call(yaxis);



    // start charting

    // update stack groups
    let groups = this.chart.selectAll('.group')
      .data(['Base', 'Fall', 'Rise']);

    groups.exit().remove();

    // update eixisitng group
    groups
      .attr('fill', d => (WaterfallChartComponent.stackColor[d]));

    // adding new groups
    groups
      .enter().append('g')
      .classed('group', true)
      .attr('fill', d => (WaterfallChartComponent.stackColor[d]));

    // rejoin data VERY IMPORTANT
    groups = this.chart.selectAll('.group')
      .data(['Base', 'Fall', 'Rise']);



    const bars = groups.selectAll('.bar')
      .data((d) => this.benchmarkGraphData.filter((item) => item.key === d)[0]);

    bars.exit().remove();

    // update existing bars

    bars
      .transition()
      .attr('x', d => this.xScale(d.data.key))
      .attr('y', d => this.yScale(d[1]))
      .attr('width', this.xScale.bandwidth())
      .attr('height', d => this.yScale(d[0]) - this.yScale(d[1]));


    // adding new bars
    bars
      .enter()
      .append('rect')
      .classed('bar', true)
      .transition()
      .attr('x', d => this.xScale(d.data.key))
      .attr('y', d => this.yScale(d[1]))
      .attr('width', this.xScale.bandwidth())
      .attr('height', d => this.yScale(d[0]) - this.yScale(d[1]));

    // console.log(this.benchmarkGraphData.filter((item) => item.key === 'Base')[0]);

  }

  createLegend() {

  }


  @HostListener('window:resize', ['$event'])
  onresize(event) {
    this.updateChart(this.claimsJsonData);
  }

  // abc

  click() {
    console.log('click');
  }

}
