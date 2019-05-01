import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
// import {Recom} from '../../recom';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user:Object;
  username:String;
 recoms:any;
 constructor(private authService:AuthService, private router:Router) { }

 getRecomsList() {
  this.authService.getAllRecoms().then((res) => {
    console.log(res);
    this.recoms = res;
  }, (err) => {
    console.log(err);
  });
}


showRecom(){
  this.getRecomsList();
}

  ngOnInit() {
   
    this.authService.getProfile().subscribe(profile => {
      this.user = profile.user;
      this.username = profile.user.username;
    },
     err => {
       console.log(err);
       return false;
     });
  }

}