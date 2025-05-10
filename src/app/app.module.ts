import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ScoresComponent } from './scores/scores.component';
import { DartersComponent } from './darters/darters.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { A11yModule } from '@angular/cdk/a11y'
import { InjectService } from './inject.service';


@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatIconModule,
    A11yModule,
    FormsModule,
    BrowserAnimationsModule,
    AppComponent,
    ScoresComponent,
    DartersComponent
  ],
  providers: [InjectService],
})
export class AppModule { }
