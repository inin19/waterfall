import * as crossfilter from 'crossfilter2';
import { ClaimDataService } from '../service/claim-data.service';
// import * as jp from 'jsonpath';

export class ClaimsData {

    static UK_ConditionGrouping = [
        'CONDITION_GROUPING_CIRCULATORY',
        'CONDITION_GROUPING_DIGESTIVE',
        'CONDITION_GROUPING_INJURY_&_ACCIDENT',
        'CONDITION_GROUPING_MENTAL_DISORDERS',
        'CONDITION_GROUPING_MUSCULOSKELETAL',
        'CONDITION_GROUPING_NEOPLASMS',
        'CONDITION_GROUPING_OTHER',
        'CONDITION_GROUPING_PREGNANCY',
        'CONDITION_GROUPING_RESPIRATORY',
        'CONDITION_GROUPING_SS_&_IDC'
    ];

    private ndx: crossfilter.Crossfilter<any>;
    // dimensions
    private relationDimension: crossfilter.Dimension<any, any>;
    private regionDimension: crossfilter.Dimension<any, any>;
    private genderDimension: crossfilter.Dimension<any, any>;
    private ageGroupDimension: crossfilter.Dimension<any, any>;
    private claimTypeDimension: crossfilter.Dimension<any, any>;


    private conditionGroupingDimension: crossfilter.Dimension<any, any>;

    // groups

    private conditionGroupingDimensionGroup: crossfilter.Group<any, any, any>;

    private claimWaterfallChartPrevYearData: any;
    private claimWaterfallChartCurrYearData: any;



    // output
    private claimsAggregateData: any[];
    private claimsAggregateDataTotal: any;
    private claimsWaterfallChartData: any[];

    private temp: any[];






    constructor(claimData: any[], totalMemeberCount: any[]) {

        this.createDimensionGroup(claimData);
        this.processGraphData(totalMemeberCount);

    }





    createDimensionGroup(data: Array<any>) {
        this.ndx = crossfilter(data);
        this.regionDimension = this.ndx.dimension((d) => d.region);
        this.relationDimension = this.ndx.dimension((d) => d.relation);
        this.genderDimension = this.ndx.dimension((d) => d.gender);
        this.claimTypeDimension = this.ndx.dimension((d) => d.claimType);
        this.ageGroupDimension = this.ndx.dimension((d) => d.ageGroup);
        this.conditionGroupingDimension = this.ndx.dimension((d) => d.conditionGrouping);

        this.conditionGroupingDimensionGroup = this.conditionGroupingDimension.group();

        // get uniuqe groups values  this.conditionGroupingDimensionGroup.reduceCount().all()

    }

    processGraphData(totalMemeberCount: any[], region?: string[], relation?: string[],
        gender?: string[], claimType?: string[], ageGroup?: string[]) {
        // Apply filters
        if (region) {
            this.regionDimension.filter((d) => region.indexOf(d.toString()) !== -1);
        } else {
            this.regionDimension.filterAll();
        }

        if (relation) {
            this.relationDimension.filter((d) => relation.indexOf(d.toString()) !== -1);
        } else {
            this.relationDimension.filterAll();
        }

        if (gender) {
            this.genderDimension.filter((d) => gender.indexOf(d.toString()) !== -1);
        } else {
            this.genderDimension.filterAll();
        }

        if (claimType) {
            this.claimTypeDimension.filter((d) => claimType.indexOf(d.toString()) !== -1);
        } else {
            this.claimTypeDimension.filterAll();
        }

        if (ageGroup) {
            this.ageGroupDimension.filter((d) => ageGroup.indexOf(d.toString()) !== - 1);
        } else {
            this.ageGroupDimension.filterAll();
        }

        // console.log('dimension all ');
        // console.log(this.conditionGroupingDimensionGroup.all());

        this.claimsAggregateData = this.conditionGroupingDimensionGroup.reduce(this.reduceAdd, this.reduceRemove, this.reduceInit).all();


        // CONDITION_GROUPING_CIRCULATORY
        // Object { currYearClaimCount_sum: 15272,
        // currYeartotalClaimCostAmount_sum: 876222,
        // prevYearClaimCount_sum: 15629,
        // prevYeartotalClaimCostAmount_sum: 1006810 }

        const currYearMemeberCount = totalMemeberCount.filter((d) => d.year === 'currentYear')[0].memeberCount;
        const prevYearMemeberCount = totalMemeberCount.filter((d) => d.year === 'previousYear')[0].memeberCount;


        // console.log(curYearMemeberCount);
        //        console.log(preYearMemeberCount);



        // this.temp = this.claimsAggregateData;

        this.claimsAggregateData.forEach(element => {
            element.currYearClaimFrequency = element.value.currYearClaimCount_sum / currYearMemeberCount;
            element.prevYearClaimFrequency = element.value.prevYearClaimCount_sum / prevYearMemeberCount;

            element.currYearPerCapitalClaimCost = element.value.currYeartotalClaimCostAmount_sum / currYearMemeberCount;
            element.prevYearPerCapitalClaimCost = element.value.prevYeartotalClaimCostAmount_sum / prevYearMemeberCount;

            element.currYearAvgClaimCost = element.value.currYeartotalClaimCostAmount_sum / element.value.currYearClaimCount_sum;
            element.prevYearAvgClaimCost = element.value.prevYeartotalClaimCostAmount_sum / element.value.prevYearClaimCount_sum;
        });




        // adding TOTAL value

        const total_currYearClaimCount_sum = this.claimsAggregateData.reduce((prev, curr) => (prev + curr.value.currYearClaimCount_sum), 0);
        const total_prevYearClaimCount_sum = this.claimsAggregateData.reduce((prev, curr) => (prev + curr.value.prevYearClaimCount_sum), 0);

        // tslint:disable-next-line:max-line-length
        const total_currYeartotalClaimCostAmount_sum = this.claimsAggregateData.reduce((prev, curr) => (prev + curr.value.currYeartotalClaimCostAmount_sum), 0);
        // tslint:disable-next-line:max-line-length
        const total_prevYeartotalClaimCostAmount_sum = this.claimsAggregateData.reduce((prev, curr) => (prev + curr.value.prevYeartotalClaimCostAmount_sum), 0);

        const value = {
            'currYearClaimCount_sum': total_currYearClaimCount_sum,
            'prevYearClaimCount_sum': total_prevYearClaimCount_sum,
            'currYeartotalClaimCostAmount_sum': total_currYeartotalClaimCostAmount_sum,
            'prevYeartotalClaimCostAmount_sum': total_prevYeartotalClaimCostAmount_sum
        };

        const total = {
            'key': 'TOTAL',
            'value': value,
            'currYearClaimFrequency': this.claimsAggregateData.reduce((pre, curr) => (pre + curr.currYearClaimFrequency), 0),
            'prevYearClaimFrequency': this.claimsAggregateData.reduce((pre, curr) => (pre + curr.prevYearClaimFrequency), 0),
            'currYearPerCapitalClaimCost': this.claimsAggregateData.reduce((pre, curr) => (pre + curr.currYearPerCapitalClaimCost), 0),
            'prevYearPerCapitalClaimCost': this.claimsAggregateData.reduce((pre, curr) => (pre + curr.prevYearPerCapitalClaimCost), 0),
            'currYearAvgClaimCost': value.currYeartotalClaimCostAmount_sum / value.currYearClaimCount_sum,
            'prevYearAvgClaimCost': value.prevYeartotalClaimCostAmount_sum / value.prevYearClaimCount_sum
        };

        this.claimsAggregateDataTotal = total;

        this.claimWaterfallChartPrevYearData = {
            key: 'PREYEAR',
            Base: 0,
            Fall: 0,
            Rise: total.prevYearAvgClaimCost,
            Per_Capita: total.prevYearAvgClaimCost
        };

        this.claimWaterfallChartCurrYearData = {
            key: 'CURRYEAR',
            Base: 0,
            Fall: 0,
            Rise: total.currYearAvgClaimCost,
            Per_Capita: total.currYearAvgClaimCost
        };

        // console.log(this.claimWaterfallChartPrevYearData, this.claimWaterfallChartCurrYearData);

        this.temp = [
            { key: 'a', value: 4 },
            { key: 'b', value: 2 },
            { key: 'c', value: 6 },
            { key: 'd', value: 5 }
        ];

        console.log('before sort');
        console.log(this.temp);

        this.temp.sort((a, b) => a.value - b.value);

        console.log('after sort');
        console.log(this.temp);



    }

    reduceAdd = (p, v) => {
        p.currYearClaimCount_sum += v.currYearClaimCount;
        p.currYeartotalClaimCostAmount_sum += v.currYeartotalClaimCostAmount;
        p.prevYearClaimCount_sum += v.prevYearClaimCount;
        p.prevYeartotalClaimCostAmount_sum += v.prevYeartotalClaimCostAmount;
        return p;
    }

    reduceRemove = (p, v) => {
        p.currYearClaimCount_sum -= v.currYearClaimCount;
        p.currYeartotalClaimCostAmount_sum -= v.currYeartotalClaimCostAmount;
        p.prevYearClaimCount_sum -= v.prevYearClaimCount;
        p.prevYeartotalClaimCostAmount_sum -= v.prevYeartotalClaimCostAmount;
        return p;

    }

    reduceInit = () => {
        return {
            currYearClaimCount_sum: 0, currYeartotalClaimCostAmount_sum: 0,
            prevYearClaimCount_sum: 0, prevYeartotalClaimCostAmount_sum: 0
        };
    }

    // getA

    getClaimsAggregateData(): any[] {
        return this.claimsAggregateData;
    }

    // getAggregate Total
    getClaimsAggregateDataTotal(): any {
        return this.claimsAggregateDataTotal;
    }

    getClaimsWaterfallChartData(): any[] {
        return this.claimsWaterfallChartData;
    }

}
