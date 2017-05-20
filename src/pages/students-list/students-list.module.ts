import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StudentsList } from './students-list';

@NgModule({
  declarations: [
    StudentsList,
  ],
  imports: [
    IonicPageModule.forChild(StudentsList),
  ],
  exports: [
    StudentsList
  ]
})
export class StudentsListModule {}
