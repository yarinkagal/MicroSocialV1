import { Component } from '@angular/core';
import { NgxScannerQrcodeComponent } from 'ngx-scanner-qrcode/lib/ngx-scanner-qrcode.component';
import { MatDialog } from '@angular/material/dialog';
import { QrScannerDialogComponent } from './qr-scanner-dialog.component';


@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.less']
})
export class QrScannerComponent { 
  public onError(e: any): void {
    alert(e);
  }
  onScan(e: any, action: NgxScannerQrcodeComponent) {
    if (e != null) {
      action.stop();
      console.log(e);
      let dialogRef = this.dialog.open(QrScannerDialogComponent, {
        data: { location: e },
      });
      dialogRef.afterClosed().subscribe((result) => {
        console.log(`Dialog result: ${result}`);
        if (result) {
          // approved
          console.log(`User approved the scan result`);
        }
      });
    }
  }

  constructor(public dialog: MatDialog) {}
}
 