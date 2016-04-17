import {Component} from 'angular2/core';
import {ButtonCheckboxDemo} from '../../components/button/btn.checkbox.ts';
import {ButtonRadioDemo} from '../../components/button/button.radio';

@Component({
    selector: 'component-showcase',
    templateUrl: 'demo/app/componentShowcase/componentShowcase.tpl.html',
    directives: [
        ButtonCheckboxDemo,
        ButtonRadioDemo
    ],
})
export class ComponentShowcase {
    
}