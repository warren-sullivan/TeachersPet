import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class ClassService {

  classes: any = [
    { name: 'Winter 2015' },
    { name: 'Fall 2015' },
    { name: 'Winter 2016' },
    { name: 'Fall 2016' },
    { name: 'Winter 2017' }
  ];

  constructor(public http: Http) {
  }

}
