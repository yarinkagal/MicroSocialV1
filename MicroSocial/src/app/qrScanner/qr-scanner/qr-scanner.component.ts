import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.less']
})
export class QrScannerComponent implements OnInit {

  public output: string;

  /**
   * Properties
   * CanvasRenderingContext2D
   * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
   */
  public frameConfig: Object = {
    lineWidth: 4,
    strokeStyle: 'red'
  };
  public textConfig: Object = {
    font: 'bold 18px serif',
    fillStyle: 'red'
  };

  // @ViewChild('action', { static: true }) action: NgxScannerQrcodeComponent;
  // TODO something this.action

  public onError(e: any): void {
    alert(e);
  }

  constructor() {
    this.output = "";
   }

  ngOnInit(): void {
  }

}
