import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseComponent } from 'src/app/base.component';
import { Action } from '@core/domain-classes/action';
import { ActionService } from '@core/services/action.service';
import { ToastrService } from 'ngx-toastr';
import { TranslationService } from '@core/services/translation.service';

@Component({
  selector: 'app-manage-action',
  templateUrl: './manage-action.component.html',
  styleUrls: ['./manage-action.component.scss'],
})
export class ManageActionComponent extends BaseComponent {
  isEdit: boolean = false;
  name: string;
  constructor(
    public dialogRef: MatDialogRef<ManageActionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Action,
    private actionService: ActionService,
    private toastrService: ToastrService,
    private translationService: TranslationService
  ) {
    super();
    if (this.data.id) {
      this.isEdit = true;
      this.name = this.data.name;
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  saveAction(): void {
    const action = {
      id: this.data.id,
      name: this.name,
    };
    if (action.id) {
      this.actionService.update(action).subscribe(() => {
        this.toastrService.success(
          this.translationService.getValue('ACTION_UPDATED_SUCCESSFULLY')
        );
        this.dialogRef.close();
      });
    } else {
      this.actionService.add(action).subscribe(() => {
        this.toastrService.success(
          this.translationService.getValue('ACTION_SAVED_SUCCESSFULLY')
        );
        this.dialogRef.close();
      });
    }
  }
}
