import { Component, OnInit, OnChanges } from '@angular/core';
import { ClaimDataService } from './service/claim-data.service';
import { Observable } from 'rxjs/Rx';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit {
  json: any[];
  memberCount: any[];

  constructor(private claimDataService: ClaimDataService) { }

  ngOnInit() {
    this.fetchBenchmarkClaimAndMemberCount();
  }



  fetchBenchmarkClaimAndMemberCount(): void {
    this.claimDataService.getBenchmarkClaimsDataTotalMemberCount()
      .subscribe(
        data => {
          this.json = data[0];
          this.memberCount = data[1];
        }
      )
  }



}
