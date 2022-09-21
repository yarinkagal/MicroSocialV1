import { Component } from '@angular/core';
import { NgxScannerQrcodeComponent } from 'ngx-scanner-qrcode/lib/ngx-scanner-qrcode.component';
import { MatDialog } from '@angular/material/dialog';
import { QrScannerDialogComponent } from './qr-scanner-dialog.component';
import { Router } from '@angular/router';


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
        if (result == "Approve") {
          console.log(`User approved the scan result`);
          // TODO: push notification
          this.router.navigate(['home']);
        }
      });
    }
  }

  constructor(public dialog: MatDialog, private router: Router) {}
}
 