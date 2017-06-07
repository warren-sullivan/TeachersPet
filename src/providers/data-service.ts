import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import * as keys from '../../keys';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class DataService {

  private className = "";

  constructor() {
    firebase.initializeApp(keys.firebaseConfig);
  }

  /** returns a user object if already signed in.  Returns null if not signed in. */
  getUserAuthStatus(): Observable<any> {
    return Observable.create(observer => {
      firebase.auth().onAuthStateChanged(user => {
        observer.next(user);
      })
    })
  }

  /** Set to sign a user in using google .  Doesn't give feedback on if it worked.  That is the job of geUserAuthStatus to do */
  signIn() {
    let provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
  }

  /** Signs the user out from google authentication.  Feeback isn't displayed here, but rather in the getUserAuthStatus observable. */
  signOut() {
    firebase.auth().signOut();
  }

  /** returns the name of the class */
  getClass(): string {
    return this.className;
  }

  /** sets the class name to query on, verifies if exists.  Throws error if it does not */
  setClass(className: string): Promise<any> {
    return new Promise((resolve, reject) => {
      firebase.database().ref().child(className).once('value', snapshot => {
        if (snapshot.val()) {
          this.className = className;
          resolve("this classname is legit");
        } else
          reject("this class name is bogus.");
      });
    });
  }

  /** add the name of a class.  Returns  nothing when done. */
  addClass(className: string, teacher: any): Promise<any> {
    return new Promise((resolve, reject) => {
      firebase.database().ref().child(className).set({ 'Instructor': teacher.uid }).then(data => {
        resolve("finished");
      }).catch(error => {
        reject(error.message);
      });
    })
  }

  /** removes a class from that list */
  removeClass(className: string): Promise<any> {
    return new Promise((resolve, reject) => {
      firebase.database().ref(className).remove().then(data =>{
        resolve("finished");
      }).catch(error => {
        reject(error.message);
      });
    });
  }

  /** well if you have to ask, it gets a list of classes. */
  getClassList(teacher?: any): Promise<string[]> {
    return new Promise((resolve, reject) => {
      firebase.database().ref().once('value', snapshot => {
        let nameList: string[] = [];
        snapshot.forEach(childSnapshot => {
          if (!teacher || childSnapshot.val().Instructor == teacher.uid)
            nameList.push(childSnapshot.key);
          return false;
        });
        resolve(nameList);
      }).catch(error => resolve(error.message));
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

  /** gets the list of assignemnts.  If a student is passed in, it gets the grades and dates submitted as well.  Otherwise those values are null */
  getAssignmentList(student?: Student): Promise<Assignment[]> {
    function getMatchingSubmissions(assignment: Assignment, submissionList: any[]){
      let thingToReturn = null;
      submissionList.forEach(submission => {       
        if(submission.AssignmentID == assignment.Key){
          thingToReturn = submission;;
        }
      });
      return thingToReturn;
    }

    function getList(className: string, assignmentMap: any, resolve: any, reject: any, studentSubmissions?: any[]){

        firebase.database().ref(className + '/AssignmentList').once('value', (snapshot) => {
        let assignmentArray: Assignment[] = [];
        snapshot.forEach(childSnapshot => { 
          let assignment = assignmentMap(childSnapshot.val());
          let submission = null;
         
          if(studentSubmissions){
            submission = getMatchingSubmissions(assignment, studentSubmissions);
          }
          if(submission){
            assignment.PointsScored = submission.Points;
            assignment.DateSubmitted = submission.DateSubmitted;
          }
          assignmentArray.push(assignment); 
          return false; 
        });

        resolve(assignmentArray);
      }).catch(e => reject("problems loading assignment list"));
    }

    return new Promise((resolve, reject) => {
      if(student){
        let submissionList: any[] = [];
        firebase.database().ref(this.className).child('Submissions').orderByChild('StudentID').equalTo(student.Key).once('value', snapshot => {     
          snapshot.forEach(childSnap => {
            submissionList.push(childSnap.val());
            return false;  
          });     
          getList(this.className, this.assignmentMap, resolve, reject, submissionList);
        });
      }else{
        getList(this.className, this.assignmentMap, resolve, reject);
      }
    });
  }

  /** This will add to the assignment list.  Individual student grades will be ignored and not stored .  Use SubmitGrade for that functionality.  This function returns null on complete*/
  addAssignment(assignment: Assignment): Promise<any> {
    return new Promise((resolve, reject) => {
      let fbObject = firebase.database().ref(this.className + "/AssignmentList").push();

      let dataToStore = this.assignmentToFbAssignment(assignment);
      dataToStore.Key = fbObject.key;
      fbObject.set(dataToStore).then(data => {
        resolve(data);
      }).catch(error => reject(error.message));
    });
  }

  /** this will remove an assignemtn  from the assignment list.  This doesn't  remove an individual students grade. */
  removeAssignment(assignment: Assignment): Promise<any> {
    return new Promise((resolve, reject) => {
      let key: string = assignment.Key;

      firebase.database().ref(this.className + "/AssignmentList/" + key).remove().catch(error => reject(error.message));
      firebase.database().ref(this.className + "/Submissions").equalTo('AssignmentID', key).once('value', data => {
        data.forEach(childData => {
          let subKey = childData.key;
          firebase.database().ref(this.className + "/Submissions/" + subKey).remove().catch(error => reject(error.message));
          return false;
        })
        resolve("assignment deleted");
      })
    });
  }

  /** Will find the assignment based on key, and make changes in the database. */
  updateAssignment(assignment: Assignment): Promise<any> {
    return new Promise((resolve, reject) => {
      let fbAssignment = this.assignmentToFbAssignment(assignment);
      firebase.database().ref(this.className + "/AssignmentList/" + assignment.Key).set(fbAssignment, (data) => {
        resolve("done");
      }).catch(error => reject(error.message));
    });
  }

  /** this will be used to  add a student.  Make the student object and send it on its way. */
  addStudent(student: Student): Promise<any> {
    return new Promise((resolve, reject) => {
      let fbObject = firebase.database().ref(this.className + "/StudentList").push();
      student.Key = fbObject.key;
      fbObject.set(student)
        .then(snapshot => resolve("added"))
        .catch(error => reject(error.message));
    });
  }

  /** this will remove a student */
  removeStudent(student: Student): Promise<any> {
    return new Promise((resolve, reject) => {
      firebase.database().ref(this.className + "/StudentList/" + student.Key).remove().catch(error => reject(error.message));
      firebase.database().ref(this.className + "/Submissions").orderByChild('StudentID').equalTo(student.Key).once('value', snapshot => {
        snapshot.forEach(childSnap => {
          let subKey = childSnap.key;
          firebase.database().ref(this.className + "/Submissions/" + subKey).remove().catch(error => reject(error.message));
          return false;
        });
        resolve("removal complete");
      }).catch(error => reject(error.message));
    });
  }

  /** make changes to a student.  This will find the object based on a key and make the changes based on the object passed in. */
  updateStudent(student: Student): Promise<any> {
    return new Promise((resolve, reject) => {
      firebase.database().ref(this.className + "/StudentList/" + student.Key).update(student)
        .then(data => resolve("update complete"))
        .catch(error => reject(error.message));
    });
  }

  /** This is where we will put the points and date submitted for each grstudent and the grade they received. */
  submitGrade(student: Student, assignment: Assignment, pointsScored: number, dateSubmitted: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let fbObject = firebase.database().ref(this.className + "/Submissions").push();

      let grade = {
        'StudentID': student.Key,
        'AssignmentID': assignment.Key,
        'Points': pointsScored,
        'DateSubmitted': dateSubmitted
      }

      fbObject.set(grade)
        .then(data => resolve("grade submitted"))
        .catch(error => reject(error.message));
    });
  }

  /** remove grade.  This will return when complete. */
  removeGrade(student: Student, assignment: Assignment): Promise<any> {
    return new Promise((resolve, reject) => {
      firebase.database().ref(this.className + "/Submissions").once('value', snapshot => {
        snapshot.forEach(childSnap => {
          if (childSnap.val().StudentID == student.Key && childSnap.val().AssignmentID == assignment.Key)
            firebase.database().ref(this.className + "/Submissions/" + childSnap.key).remove().catch(error => reject(error.message));
          return false;
        });
        resolve("grade removed");
      });
    });
  }



  /** uploads a blob image, returns a status during and a url when complete { progress: number, URL: string, status: string } */
  uploadImage(imageURI: any): Observable<any>{
    let returnData = { progress: 0, URL: ''};

    return Observable.create(observer => {
      let uploadTask = firebase.storage().ref().child(imageURI.name).put(imageURI);

      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, snapshot => {
          returnData.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          observer.next(returnData);
        }, error => console.log(error)
        , () => {
          returnData.URL = uploadTask.snapshot.downloadURL
          observer.next(returnData);
          observer.complete();
        });
    });
  }

  private assignmentToFbAssignment(assignment: Assignment): any {
    return {
      'DateAssigned': assignment.DateAssigned,
      'Description': assignment.Description,
      'DueDate': assignment.DueDate,
      'GithubLink': assignment.GithubLink,
      'Key': assignment.Key,
      'PointsPossible': assignment.PointsPossible,
      'Title': assignment.Title
    }
  }

  private studentMap(jsonObj: any): Student {
    let student = {
      Name: jsonObj.Name,
      SlackID: jsonObj.SlackID,
      Key: jsonObj.Key,
      ImageURL: jsonObj.ImageURL,
      GithubID: jsonObj.GithubID,
      Email: jsonObj.Email,
      Assignments: null
    };

    return student;
  }

  private assignmentMap(jsonObj: any): Assignment {
    return {
      Key: jsonObj.Key,
      Title: jsonObj.Title,
      PointsPossible: jsonObj.PointsPossible,
      Description: jsonObj.Description,
      DueDate: jsonObj.DueDate,
      DateAssigned: jsonObj.DateAssigned,
      GithubLink: jsonObj.GithubLink,

      PointsScored: 0,
      DateSubmitted: ""
    };
  }
}

export class Student {
  Key: string;
  Name: string;
  Email: string;
  GithubID: string;
  SlackID: string;
  ImageURL: string;
}

export class Assignment {
  Key: string;
  Title: string;
  PointsPossible: number;
  Description: string;
  DueDate: string;
  DateAssigned: string;
  GithubLink: string;

  PointsScored: number;
  DateSubmitted: string;
}