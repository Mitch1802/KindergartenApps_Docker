import { Component, ViewEncapsulation, inject } from '@angular/core';
import { LoaderService } from '../_service/loader.service';


@Component({
    selector: 'app-spinner',
    templateUrl: './spinner.component.html',
    styleUrls: ['./spinner.component.sass'],
    encapsulation: ViewEncapsulation.ShadowDom,
    imports: []
})
export class SpinnerComponent {
  loader = inject(LoaderService);
}