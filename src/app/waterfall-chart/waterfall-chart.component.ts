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


    this.benchmarkClaimData.sortWaterfallASC();

    this.benchmarkClaimData.sortWaterfallDESC();


  }



}
