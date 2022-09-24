import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-input-container',
  templateUrl: './inpit-container.component.html',
  styleUrls: ['./inpit-container.component.css']
})
export class InpitContainerComponent implements OnInit {
   
  @Input()
  label!: string
  
  @Input()
  bgColor = 'white';
  constructor() { }

  ngOnInit(): void {
  }

}
