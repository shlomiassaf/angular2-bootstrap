import {Component} from 'angular2/core';
import {AsCheckbox} from '../../../core/behavior/AsCheckbox';

@Component({
    selector: 'button-checkbox-demo',
    templateUrl: 'demo/components/button/btn.checkbox.tpl.html',
    directives: [AsCheckbox]
})
export class ButtonCheckboxDemo {
    state = {
        isChecked: false,
        isDisabled: false
    };
    
    groupCheckbox = {
        left: false,
        middle: true,
        right: false
    };

}