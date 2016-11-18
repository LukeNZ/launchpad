import {Injectable} from "@angular/core";
import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";

@Injectable()
export class NotificationBannerService {
    private notifySubject = new Subject<string>();
    private notificationsObservable = this.notifySubject.asObservable();

    /**
     * Notify subscribers of the notification banner service of a new notification.
     *
     * @param message   The message contained within the notification.
     */
    public notify(message: string) : void {
        this.notifySubject.next(message);
    }

    /**
     * Return the notification stream that can be subscribed to. Only entities that want to listen
     * for new notifications should subscribe to this.
     *
     * @returns {Observable<string>}    A stream of notifications.
     */
    get notifications() : Observable<string> {
        return this.notificationsObservable;
    }
}