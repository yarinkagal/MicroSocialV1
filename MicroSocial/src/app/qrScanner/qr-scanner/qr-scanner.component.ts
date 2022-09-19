import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';



@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.less']
})
export class QrScannerComponent implements OnInit {

  public output$: Observable<string>;

  
  public onError(e: any): void {
    alert(e);
  }

  constructor() {
    this.output$ = of("");
   }

  ngOnInit(): void {
  }

}
