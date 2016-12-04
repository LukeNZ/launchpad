import {Injectable} from "@angular/core";
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class GuardSharedService {
    private _guardState = new Subject<boolean>();
    private _guardStateObservable = this._guardState.asObservable();

    public changeGuardState(state: boolean) : void {
        this._guardState.next(state);
    }

    public guardStateStream() : Observable<boolean> {
        return this._guardStateObservable;
    }
}