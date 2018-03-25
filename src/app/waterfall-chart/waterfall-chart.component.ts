import { Component, OnInit, OnChanges, ViewChild, Input, ElementRef, ViewEncapsulation } from '@angular/core';
import { ClaimsData } from '../model/claims-data';

import * as d3 from 'd3';

@Component({
  selector: 'app-waterfall-chart',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './waterfall-chart.component.html',
  styleUrls: ['./waterfall-chart.component.css']
})
export class WaterfallChartComponent implements OnInit {


  @Input() private claimsJsonData: any[];
  @Input() private totalMemberCount: any[];


  private benchmarkClaimData: ClaimsData;



  constructor() { }

  ngOnInit() {

    // console.log(this.claimsJsonData);
    this.getChartData();

    // this.testReduce();

  }

  getChartData() {
    this.benchmarkClaimData = new ClaimsData(this.claimsJsonData, this.totalMemberCount);


    // this.benchmarkClaimData.processGraphData(this.totalMemberCount,
    //   ['REGION_CENTRAL_LONDON', 'REGION_GREATER_LONDON'], undefined, ['F'], ['CLAIM_TYPE_DAYCARE', 'CLAIM_TYPE_IN_PATIENT']);

    const benchmarkClaimDataAndTotal =
      this.benchmarkClaimData.getClaimsAggregateData().concat(this.benchmarkClaimData.getClaimsAggregateDataTotal());


    // console.log(this.benchmarkClaimData.getWaterfallPrevYearData());
    // console.log(this.benchmarkClaimData.getWaterfallConditionGroupData());
    // console.log(this.benchmarkClaimData.getWaterfallCurrYearData());

    // this.benchmarkClaimData.sortWaterfallASC();
    // this.benchmarkClaimData.sortWaterfallDESC();
    // this.benchmarkClaimData.restoreWaterfallOrder();




  }

  testReduce() {
    const abc = [
      { key: 'Circulatory', currYearClaimFrequency: 1, currYearPerCapitalClaimCost: 10, currYearAvgClaimCost: 100 },
      { key: 'Digestive', currYearClaimFrequency: 2, currYearPerCapitalClaimCost: 20, currYearAvgClaimCost: 200 },
      { key: 'Injury & Accident', currYearClaimFrequency: 3, currYearPerCapitalClaimCost: 30, currYearAvgClaimCost: 300 },
      { key: 'Mental Disorders', currYearClaimFrequency: 4, currYearPerCapitalClaimCost: 40, currYearAvgClaimCost: 400 },
      { key: 'Musculoskeletal', currYearClaimFrequency: 5, currYearPerCapitalClaimCost: 50, currYearAvgClaimCost: 500 },
      { key: 'Neoplasms', currYearClaimFrequency: 6, currYearPerCapitalClaimCost: 60, currYearAvgClaimCost: 600 },
      { key: 'Pregnancy', currYearClaimFrequency: 7, currYearPerCapitalClaimCost: 70, currYearAvgClaimCost: 700 },
      { key: 'Respiratory', currYearClaimFrequency: 8, currYearPerCapitalClaimCost: 80, currYearAvgClaimCost: 800 },
      { key: 'SS & IDC', currYearClaimFrequency: 9, currYearPerCapitalClaimCost: 90, currYearAvgClaimCost: 900 },
      { key: 'Other', currYearClaimFrequency: 10, currYearPerCapitalClaimCost: 100, currYearAvgClaimCost: 1000 }];


    const d = abc.reduce((accu, curr) => {
      return {
        key: 'total',
        currYearClaimFrequency: accu.currYearClaimFrequency + curr.currYearClaimFrequency,
        currYearPerCapitalClaimCost: accu.currYearPerCapitalClaimCost + curr.currYearPerCapitalClaimCost,
        currYearAvgClaimCost: accu.currYearAvgClaimCost + curr.currYearAvgClaimCost
      };
    }, { key: 'total', currYearClaimFrequency: 0, currYearPerCapitalClaimCost: 0, currYearAvgClaimCost: 0 });
    console.log(d);

  }




}
