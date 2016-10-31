import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {TMinusTenComponent} from "./Components/TMinusTen.component";
import {HeaderComponent} from "./Components/Header.component";
import {CountdownComponent} from "./Components/Countdown.component";
import {StatusBarComponent} from "./Components/StatusBar.component";
import {UpdatesComponent} from "./Components/Updates.component";
import {WebcastComponent} from "./Components/Webcast.component";

@NgModule({
    imports: [BrowserModule],
    declarations: [TMinusTenComponent, HeaderComponent, CountdownComponent, StatusBarComponent, UpdatesComponent, WebcastComponent],
    bootstrap: [TMinusTenComponent]
})
export class AppModule {}