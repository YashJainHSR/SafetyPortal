import { Component,OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  imgURL: any = "/assets/banner.png";
  ngOnInit() {
  const el = document.querySelector('#banner') as HTMLElement;
  const top = document.querySelector('#topNav') as HTMLElement;
  var topHeight: number = top.offsetHeight;
    el.style.height = "calc(100vh - (" + topHeight.toString() + "px + 30px))";
 
}
}
