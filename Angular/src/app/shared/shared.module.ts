import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { HasClaimDirective } from './has-claim.directive';
import { PipesModule } from './pipes/pipes.module';
import { DragDropDirective } from './directives/drag-drop.directive';

@NgModule({
  exports: [
    HasClaimDirective,
    PipesModule,
    TranslateModule,
    DragDropDirective],
  imports: [PipesModule],
  declarations: [HasClaimDirective, DragDropDirective],
})
export class SharedModule { }
