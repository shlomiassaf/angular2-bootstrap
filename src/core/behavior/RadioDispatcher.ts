/*
 Partially based on:
 https://github.com/angular/material2/blob/master/src/components/radio/radio_dispatcher.ts
 https://github.com/angular/material2/commit/d76465b12b1e0ae76eafcb46c4847ea546802d5e
 */
import {Injectable} from 'angular2/core';

/**
 * Class for radio buttons to coordinate unique selection based on name.
 * Intended to be consumed as an Angular service.
 * This service is needed because native radio change events are only fired on the item currently
 * being selected, and we still need to uncheck the previous selection.
 */
@Injectable()
export class RadioDispatcher {
    private _listeners: [(name: string)=> void] = <any>[];

    /** Notify other radio buttons that selection for the given name has been set. */
    notify(name: string) {
        this._listeners.forEach(listener => listener(name));
    }

    /** Listen for future changes to radio button selection. */
    listen(listener: (name: string) => void) {
        this._listeners.push(listener);
    }
}