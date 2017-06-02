import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { DataService, Assignment, Student } from '../../providers/data-service';


@Component({
  selector: 'page-data-service-example',
  templateUrl: 'data-service-example.html',
})
export class DataServiceExamplePage {

  signedIn: boolean = false;
  user: any = null;

  constructor(public dataService: DataService, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.dataService.getUserAuthStatus().subscribe(user => {
      console.log(user)
      this.user = user;
    });
  }

  getStudentList(){
    this.dataService.getStudentList()
    .then(students => console.log(students));

  }

  signIn(){
    this.dataService.signIn();

  }

  signOut(){
    this.dataService.signOut();

  }

  addClass(){
    if(this.user)
      this.dataService.addClass("This Is a class", this.user);

  }

  getClassList() {
    this.dataService.getClassList(this.user).then(data => console.log(data));
  }


  addAssignment(){
    let assignment:Assignment = new Assignment();

      assignment.Title = 'This is a test title';
      assignment.PointsPossible = 10;
      assignment.Description = "purple monkey trees, hows that for a description?";
      assignment.DueDate = '123456789';
      assignment.DateAssigned = '123456789';
      assignment.GithubLink = 'www.github.com/mybutt';

    this.dataService.addAssignment(assignment);
  }

  removeAssignment(){
   // this.dataService.removeAssignment();
  }

  updateAssignment(){
    // this.dataService.updateAssignment();
  }

  addStudent(){
    // this.dataService.addStudent();
  }

  removeStudent(){
    // this.dataService.removeStudent();
  }

  updateStudent(){
   // this.dataService.updateStudent();
  }

  submitGrade() {
   // this.dataService.submitGrade();
  }

}
