import {Component} from 'angular2/core';
import {Alert} from '../../../components/alert/alert';

@Component({
    selector: 'alert-demo',
    templateUrl: 'demo/components/alert/alert.tpl.html',
    directives: [Alert]
})
export class AlertDemo {
    public alerts:Array<Object> = [
        {
            type: 'danger',
            msg: 'Oh snap! Change a few things up and try submitting again.'
        },
        {
            type: 'success',
            msg: 'Well done! You successfully read this important alert message.',
            closable: true
        }
    ];

    public closeAlert(i:number):void {
        this.alerts.splice(i, 1);
    }

    public addAlert():void {
        this.alerts.push({msg: 'Another alert!', type: 'warning', closable: true});
    }

}