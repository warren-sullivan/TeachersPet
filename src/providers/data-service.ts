import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import * as keys from '../../keys';

@Injectable()
export class DataService {

  private className = "Mobile Development 2017";

  constructor() {
    firebase.initializeApp(keys.firebaseConfig);
  }

  getStudents(): Promise<Student[]> {
    return new Promise((resolve, reject) => {
      firebase.database().ref(this.className + '/StudentList').once('value', (snapshot) => {
        let studentArray: Student[] = [];
        snapshot.forEach(childSnapshot => { studentArray.push(this.studentMap(childSnapshot.val())); return false; });
        resolve(studentArray);
      }).catch(e => reject("problems loading student list"));
    });
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

  getAssignments(): Promise<any> {
    return new Promise((resolve, reject) => {
      firebase.database().ref(this.className + '/AssignmentList').once('value', (snapshot) => {
        let assignmentArray: Assignment[] = [];
        snapshot.forEach(childSnapshot => { assignmentArray.push(this.assignmentMap(childSnapshot.val())); return false; });
        resolve(assignmentArray);
      }).catch(e => reject("problems loading assignment list"));
    });
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



  //Retuns an array of objects, one for each student
  //Each object contains the student's unique key
  //and each student's assignmentData for that assignment
  getAssignmentDataFromStudents(students: Student[], assignment: Assignment): Object[] {
    let dataArray: Object[] = [];
    students.forEach(student => {
      student.Assignments.forEach(assignmentData => {
        if (assignmentData.Key == assignment.Key) {
          let tempStr: string = student.Key;
          dataArray.push({ tempStr, assignmentData });
        }
      })
    });
    return dataArray;
  }

  //Retuns an array of objects, one for each assignment
  //Each object contains each assignment's unique key
  //and the student's assignmentData for that assignment
  listStudentAssignments(assignments: Assignment[], student: Student): Object[] {
    let dataArray: Object[] = [];
    student.Assignments.forEach(assignmentData => {
      assignments.forEach(assignment => {
        if (assignmentData.Key == assignment.Key) {
          let tempStr: string = assignment.Key;
          dataArray.push({ tempStr, assignmentData });
        }
      })
    });
    return dataArray;
  }



  deleteStudent(studentKey: string): void {
    return null;
  }

  deleteAssignment(assignmentKey: string): void {
    return null;
  }



  getClass(): string {
    return this.className;
  }

  setClass(className: string): null {
    this.className = className;
    return null;
  }
}

interface Student {
  Key: string,
  Name: string,
  Email: string,
  Github: URL,
  Slack: URL,
  Image: URL,
  Assignments: AssignmentData[]
}

interface Assignment {
  Key: string,
  Title: string,
  PointsPossible: number,
  Description: string,
  DueDate: Date,
  DateAssigned: Date,
  GithubLink: URL
}

interface AssignmentData {
  Key: string,
  PointsScored: number,
  DateSubmitted: Date,
}
