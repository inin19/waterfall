import * as crossfilter from 'crossfilter2';
import { ClaimDataService } from '../service/claim-data.service';
// import * as jp from 'jsonpath';

export class ClaimsData {
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


    // output
    private claimsAggregateData: any[];

    // private temp: any[];





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

        // console.log(this.conditionGroupingDimensionGroup.all());

        this.claimsAggregateData = this.conditionGroupingDimensionGroup.reduce(this.reduceAdd, this.reduceRemove, this.reduceInit).all();

        // CONDITION_GROUPING_CIRCULATORY
        // Object { curYearClaimCount_sum: 15272,
        // curYeartotalClaimCostAmount_sum: 876222,
        // preYearClaimCount_sum: 15629,
        // preYeartotalClaimCostAmount_sum: 1006810 }



        const curYearMemeberCount = totalMemeberCount.filter((d) => d.year === 'currentYear')[0].memeberCount;
        const preYearMemeberCount = totalMemeberCount.filter((d) => d.year === 'previousYear')[0].memeberCount;


        // console.log(curYearMemeberCount);
        //        console.log(preYearMemeberCount);



        // this.temp = this.claimsAggregateData;

        this.claimsAggregateData.forEach(element => {
            element.curYearClaimFrequency = element.value.curYearClaimCount_sum / curYearMemeberCount;
            element.preYearClaimFrequency = element.value.preYearClaimCount_sum / preYearMemeberCount;

            element.curYearPerCapitalClaimCost = element.value.curYeartotalClaimCostAmount_sum / curYearMemeberCount;
            element.preYearPerCapitalClaimCost = element.value.preYeartotalClaimCostAmount_sum / preYearMemeberCount;

            element.curYearAvgClaimCost = element.value.curYeartotalClaimCostAmount_sum / element.value.curYearClaimCount_sum;
            element.preYearAvgClaimCost = element.value.preYeartotalClaimCostAmount_sum / element.value.preYearClaimCount_sum;
        });


        // console.log('aggregate');
        // console.log(this.claimsAggregateData);


        // console.log('temp');
        // console.log(this.temp);



        // adding TOTAL value

        const total_curYearClaimCount_sum = this.claimsAggregateData.reduce((prev, curr) => (prev + curr.value.curYearClaimCount_sum), 0);
        const total_preYearClaimCount_sum = this.claimsAggregateData.reduce((prev, curr) => (prev + curr.value.preYearClaimCount_sum), 0);

        // tslint:disable-next-line:max-line-length
        const total_curYeartotalClaimCostAmount_sum = this.claimsAggregateData.reduce((prev, curr) => (prev + curr.value.curYeartotalClaimCostAmount_sum), 0);
        // tslint:disable-next-line:max-line-length
        const total_preYeartotalClaimCostAmount_sum = this.claimsAggregateData.reduce((prev, curr) => (prev + curr.value.preYeartotalClaimCostAmount_sum), 0);

        const value = {
            'curYearClaimCount_sum': total_curYearClaimCount_sum,
            'preYearClaimCount_sum': total_preYearClaimCount_sum,
            'curYeartotalClaimCostAmount_sum': total_curYeartotalClaimCostAmount_sum,
            'preYeartotalClaimCostAmount_sum': total_preYeartotalClaimCostAmount_sum
        };

        const total = {
            'key': 'TOTAL',
            'value': value,
            'curYearClaimFrequency': this.claimsAggregateData.reduce((pre, curr) => (pre + curr.curYearClaimFrequency), 0),
            'preYearClaimFrequency': this.claimsAggregateData.reduce((pre, curr) => (pre + curr.preYearClaimFrequency), 0),
            'curYearPerCapitalClaimCost': this.claimsAggregateData.reduce((pre, curr) => (pre + curr.curYearPerCapitalClaimCost), 0),
            'preYearPerCapitalClaimCost': this.claimsAggregateData.reduce((pre, curr) => (pre + curr.preYearPerCapitalClaimCost), 0),
            'curYearAvgClaimCost': value.curYeartotalClaimCostAmount_sum / value.curYearClaimCount_sum,
            'preYearAvgClaimCost': value.preYeartotalClaimCostAmount_sum / value.preYearClaimCount_sum
        };


        // this.claimsAggregateData.push(total);


        // this.claimsAggregateData.forEach(element => {
        //     console.log(element);
        // });


    }

    reduceAdd = (p, v) => {
        p.curYearClaimCount_sum += v.curYearClaimCount;
        p.curYeartotalClaimCostAmount_sum += v.curYeartotalClaimCostAmount;
        p.preYearClaimCount_sum += v.preYearClaimCount;
        p.preYeartotalClaimCostAmount_sum += v.preYeartotalClaimCostAmount;
        return p;
    }

    reduceRemove = (p, v) => {
        p.curYearClaimCount_sum -= v.curYearClaimCount;
        p.curYeartotalClaimCostAmount_sum -= v.curYeartotalClaimCostAmount;
        p.preYearClaimCount_sum -= v.preYearClaimCount;
        p.preYeartotalClaimCostAmount_sum -= v.preYeartotalClaimCostAmount;
        return p;

    }

    reduceInit = () => {
        return {
            curYearClaimCount_sum: 0, curYeartotalClaimCostAmount_sum: 0,
            preYearClaimCount_sum: 0, preYeartotalClaimCostAmount_sum: 0
        };
    }

    // getA

    getClaimsAggregateData(): any[] {
        return this.claimsAggregateData;
    }


}
