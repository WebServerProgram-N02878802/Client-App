import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import {MatButtonModule} from '@angular/material';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatDialogModule} from '@angular/material/dialog';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material';
import { MatInputModule } from '@angular/material';


import { AppComponent } from './app.component';
import { MapComponent, MarkerEditDialog } from './components/map/map.component';
import { MessagesComponent } from './components/messages/messages.component';
import { MapService } from './services/map/map.service';
import { MessageService } from './services/messages/message.service';

import 'hammerjs';


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    MarkerEditDialog,
    MessagesComponent,
  ],
  imports: [
    BrowserModule,
    
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatDialogModule,
    HttpModule,
    RouterModule.forRoot([
        { path: 'map', component: MapComponent },
        { path: '', redirectTo: '/map', pathMatch: 'full' }
    ])
  ],
  providers: [MessageService, MapService],
  entryComponents: [ MarkerEditDialog ],
  bootstrap: [AppComponent]
})
export class AppModule { }
