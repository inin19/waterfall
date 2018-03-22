import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';


@Injectable()
export class ClaimDataService {


  private benchmarkclaimDataUrl = 'http://localhost:3000/benchmarkClaims';  // URL to web api
  private benchmarkTotalMemberDataUrl = 'http://localhost:3000/benchmarkMemberCount';



  constructor(private http: HttpClient) { }



  /** GET claims from the server */
  getBenchmarkClaimsData1(): Observable<Array<any>> {
    return this.http.get<Array<any>>(this.benchmarkclaimDataUrl);
  }


  /** GET claims from the server */
  getBenchmarkMemberCount1(): Observable<Array<any>> {
    return this.http.get<Array<any>>(this.benchmarkTotalMemberDataUrl);
  }



  getBenchmarkClaimsDataTotalMemberCount() {
    return Observable.forkJoin(
      this.http.get<Array<any>>(this.benchmarkclaimDataUrl),
      this.http.get<Array<any>>(this.benchmarkTotalMemberDataUrl)
    );
  }

}
