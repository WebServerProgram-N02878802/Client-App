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
import { MapService } from './services/map/map.service';


import { UserMapComponent, MarkerViewDialog } from './components/user-map/user-map.component';

import 'hammerjs';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    MarkerEditDialog,
    UserMapComponent,
    MarkerViewDialog
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
        { path: 'client/map', component: MapComponent },
        { path: 'user/map', component: UserMapComponent },
        { path: '', redirectTo: '/user/map', pathMatch: 'full' }
    ])
  ],
  providers: [MapService],
  entryComponents: [ MarkerEditDialog, MarkerViewDialog ],
  bootstrap: [AppComponent]
})
export class AppModule { }
