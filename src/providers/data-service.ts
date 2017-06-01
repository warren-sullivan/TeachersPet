import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import * as keys from '../../keys';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class DataService {

  private className = "Mobile Development 2017";

  constructor() {
    firebase.initializeApp(keys.firebaseConfig);
  }

  /** returns a user object if already signed in.  Returns null if not signed in. */
  getUserAuthStatus(): Observable<any>{
    return Observable.create(observer => {
      firebase.auth().onAuthStateChanged(user => {
        observer.next(user);
      })
    })
  }

  /** Set to sign a user in using google .  Doesn't give feedback on if it worked.  That is the job of geUserAuthStatus to do */
  signIn(){
      let provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithRedirect(provider);
  }

  /** Signs the user out from google authentication.  Feeback isn't displayed here, but rather in the getUserAuthStatus observable. */
  signOut(){
      firebase.auth().signOut();
  }

  /** returns the name of the class */
  getClass(): string {
    return this.className;
  }

  /** sets the class name to query on */
  setClass(className: string): null {
    this.className = className;
    return null;
  }

  /** add the name of a class.  Returns  nothing when done. */
  addClass(className: string, teacher:any){
   // console.log(teacher);
    return new Promise((resolve, reject) => {
     firebase.database().ref().child(className).set({'Instructor': teacher.uid}).then(data => {
        resolve("finished");
      }).catch(error => {
        reject(error);
      });
    })
  }

  /** well if you have to ask, it gets a list of classes. */
  getClassList(teacher?: any): Promise<string[]> {
    return new Promise((resolve, reject) => {
      firebase.database().ref().once('value', snapshot => {
        let nameList: string[] = [];
        snapshot.forEach(childSnapshot => {
          if(!teacher || childSnapshot.val().Instructor == teacher.uid)
          nameList.push(childSnapshot.key);
          return false;
        });
        resolve(nameList);
      }).catch(error => resolve(error));
    })
   }

  /** returns the list of students */
  getStudentList(): Promise<Student[]> {
    return new Promise((resolve, reject) => {
      firebase.database().ref(this.className + '/StudentList').once('value', (snapshot) => {
        let studentArray: Student[] = [];
        snapshot.forEach(childSnapshot => { studentArray.push(this.studentMap(childSnapshot.val())); return false; });
        resolve(studentArray);
      }).catch(e => reject("problems loading student list"));
    });
  }



  /** gets the list of assignemnts.  If a student is passed in, it gets the grades a and dates submitted as well.  Otherwise those values are null */
  getAssignmentList(student?: Student): Promise<any> {
    return new Promise((resolve, reject) => {
      firebase.database().ref(this.className + '/AssignmentList').once('value', (snapshot) => {
        let assignmentArray: Assignment[] = [];
        snapshot.forEach(childSnapshot => { assignmentArray.push(this.assignmentMap(childSnapshot.val())); return false; });
        resolve(assignmentArray);
      }).catch(e => reject("problems loading assignment list"));
    });
  }





  /** This will add to the assignment list.  Individual student grades will be ignored and not stored .  Use SubmitGrade for that functionality.  This function returns null on complete*/
  addAssignment(assignment: Assignment):Promise<any>{
    return new Promise((resolve, reject) => {
      let fbObject = firebase.database().ref(this.className + "/AssignmentList").push()
      .catch(error => reject(error));

      let dataToStore = {
        'DateAssigned': assignment.DateAssigned,
        'Description' : assignment.Description,
        'DueDate'     : assignment.DueDate,
        'GithubLink'  : assignment.GithubLink,
        'Key'         : fbObject.key,
        'PointsPossible': assignment.PointsPossible,
        'Title'       : assignment.Title
      }

      fbObject.set(dataToStore).then(data => {
       // console.log("done");
        resolve(data);
      }).catch(error => reject(error));
    });
  }

  /** this will remove an assignemtn  from the assignment list.  This doesn't  remove an individual students grade. */
  removeAssignment(assignment: Assignment){

  }

  /** Will find the assignment based on key, and make changes in the database. */
  updateAssignment(assignment: Assignment) {

  }

  /** this will be used to  add a student.  Make the student object and send it on its way. */
  addStudent(student: Student){

  }

  /** this will remove a student */
  removeStudent(student: Student): void {
    return null;
  }

  /** make changes to a student.  This will find the object based on a key and make the changes based on the object passed in. */
  updateStudent(student: Student){

  }

  /** This is where we will put the points and date submitted for each grstudent and the grade they received. */
  submitGrade(student: Student, assignemnt: Assignment, pointsScored: number, dateSubmittedInTicks: number){

  }

  removeGrade(student: Student, assignment: Assignment): void {
    return null;
  }





  private studentMap(jsonObj: any): Student {
    let student = {
      Name: jsonObj.Name,
      Slack: jsonObj.SlackID,
      Key: jsonObj.Key,
      Image: jsonObj.ImageURL,
      Github: jsonObj.GithubID,
      Email: jsonObj.Email,
      Assignments: null
    };
    student.Assignments = [];
    for (var key in jsonObj.AssignmentList) {
      student.Assignments.push(this.assignmentDataMap(jsonObj.AssignmentList[key]));
    }

    return student;
  }

  private assignmentDataMap(jsonObj: any): AssignmentData {
    return {
      Key: jsonObj.Key,
      DateSubmitted: jsonObj.DateSubmitted,
      PointsScored: jsonObj.PointsScored
    }
  }



  private assignmentMap(jsonObj: any): Assignment {
    return {
      Key: jsonObj.Key,
      Title: jsonObj.Title,
      PointsPossible: jsonObj.PointsPossible,
      Description: jsonObj.Description,
      DueDate: jsonObj.DueDate,
      DateAssigned: jsonObj.DateAssigned,
      GithubLink: jsonObj.GithubLink
    };
  }

}



export class Student {
  Key: string;
  Name: string;
  Email: string;
  Github: URL;
  Slack: URL;
  Image: URL;
}

export class Assignment {
  Key: string;
  Title: string;
  PointsPossible: number;
  Description: string;
  DueDate: string;
  DateAssigned: string;
  GithubLink: string;
}

export class AssignmentData {
  Key: string;
  PointsScored: number;
  DateSubmitted: string;
}


