import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StudentDetail } from "../student-detail/student-detail";
import {StudentCreation} from "../student-creation/student-creation";


@IonicPage()
@Component({
  selector: 'page-students-list',
  templateUrl: 'students-list.html',
})
export class StudentsList implements OnInit {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StudentsList');
  }

  ngOnInit() {
    //this.aaronAndWarrensService.getStudents().subscribe(data => {
    //  this.students = data;
  }

  navToStudentDetail() {
    this.navCtrl.push(StudentDetail);
  }

  createStudent() {
    this.navCtrl.push(StudentCreation);
  }
}
