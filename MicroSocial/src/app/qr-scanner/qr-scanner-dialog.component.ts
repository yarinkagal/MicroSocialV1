import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl: './qr-scanner-dialog.component.html',
})
export class QrScannerDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
