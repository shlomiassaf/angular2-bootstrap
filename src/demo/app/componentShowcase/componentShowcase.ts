import {Component} from 'angular2/core';
import {ButtonCheckboxDemo} from '../../components/button/btn.checkbox.ts';
import {ButtonRadioDemo} from '../../components/button/button.radio';
import {AlertDemo} from '../../components/alert/alert';

@Component({
    selector: 'component-showcase',
    templateUrl: 'demo/app/componentShowcase/componentShowcase.tpl.html',
    directives: [
        ButtonCheckboxDemo,
        ButtonRadioDemo,
        AlertDemo
    ],
})
export class ComponentShowcase {
    
}