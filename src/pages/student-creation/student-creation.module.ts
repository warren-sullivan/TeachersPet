import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StudentCreation } from './student-creation';

@NgModule({
  declarations: [
    StudentCreation,
  ],
  imports: [
    IonicPageModule.forChild(StudentCreation),
  ],
  exports: [
    StudentCreation
  ]
})
export class StudentCreationModule {}
