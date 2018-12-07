import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MainPosComponent} from './main-pos.component';
import {MainPosService} from './main-pos.service';
import {ToFixedPipe} from '../../pipes/to-fixed.pipe';

@NgModule({
    declarations: [MainPosComponent, ToFixedPipe],
    imports: [
        CommonModule
    ],
    exports: [MainPosComponent],
    providers: [MainPosService, ToFixedPipe]
})
export class MainPosModule {
}
