import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material';
import { MatInputModule } from '@angular/material';
import { MatCardModule } from '@angular/material/card';

import { AppComponent } from './app.component';
import { MapService } from './services/map/map.service';
import { LoginService } from './services/login/login.service';


import { MapComponent, MarkerEditDialog, infoButtonDialog, setButtonDialog} from './components/map/map.component';
import { UserMapComponent, MarkerViewDialog } from './components/user-map/user-map.component';
import { LoginComponent } from './components/login/login.component';

import 'hammerjs';


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    MarkerEditDialog,
    UserMapComponent,
    MarkerViewDialog,
    infoButtonDialog,
    setButtonDialog,
    LoginComponent
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
    MatCardModule,
    
    HttpModule,
    RouterModule.forRoot([
        { path: 'login', component: LoginComponent },
        { path: 'client/map', component: MapComponent },
        { path: 'user/map', component: UserMapComponent },
        { path: '', redirectTo: 'login', pathMatch: 'full' }
    ])
  ],
  providers: [MapService, LoginService],
  entryComponents: [ MarkerEditDialog, MarkerViewDialog, infoButtonDialog, setButtonDialog ],
  bootstrap: [AppComponent]
})
export class AppModule { }
