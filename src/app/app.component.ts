import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from './modals/popup.component';

import { ChartType, Row } from "angular-google-charts";
import { Tweet } from './models/tweet';
import jsonData from '../../src/assets/data/tweets.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  tweets : Tweet[] = [];
  domains: string[] = [];

  title = 'Spam Tweets Distribution';
  type = ChartType.TreeMap;
  data : Row[] = []
  columnNames = ['Domain', 'Parent', 'Number of Tweets'];
  options = {};
  width = 650;
  height = 500;
  showSecond: boolean = false;

  private bardata = [
    {"Framework": "Vue", "Stars": "166443", "Released": "2014"},
    {"Framework": "React", "Stars": "150793", "Released": "2013"},
    {"Framework": "Angular", "Stars": "62342", "Released": "2016"},
    {"Framework": "Backbone", "Stars": "27647", "Released": "2010"},
    {"Framework": "Ember", "Stars": "21471", "Released": "2011"},
  ];
  

  geoTitle = '';
  geoData = [
      ["China", "China: 1,363,800,000"],
      ["India", "India: 1,242,620,000"],
      ["US", "US: 317,842,000"],
      ["Indonesia", "Indonesia: 247,424,598"],
      ["Brazil", "Brazil: 201,032,714"],
      ["Pakistan", "Pakistan: 186,134,000"],
      ["Nigeria", "Nigeria: 173,615,000"],
      ["Bangladesh", "Bangladesh: 152,518,015"],
      ["Russia", "Russia: 146,019,512"],
      ["Japan", "Japan: 127,120,000"]
   ];
   geoColumnNames = ["Country","Population"];
   geoOptions = {   
      showTip: true
   };
   geoWidth = 600;
   geoHeight = 500;

  constructor(private dialog: MatDialog){
    jsonData.forEach(element => {
      this.tweets.push(new Tweet(
        String(element.Id), String(element.UserId), element.Text, element.Domain))
    });
    this.domains = this.tweets.map((data: Tweet) => data.domain);
    this.data.push(['Domain', null, 0]);
    [... new Set(this.domains)].forEach(dom => {
      this.data.push([dom, 'Domain', this.domains.filter((t) => t === dom).length])
    });
  }
  ngOnInit(): void {}

  goBack(): void{
    this.showSecond = false;
    this.type = ChartType.TreeMap
  }

  onSelect(params: any):void {
    this.showSecond = true;
    this.type = ChartType.GeoChart
    console.log(params)
   }

  OpenPopup() {
    const popup= this.dialog.open(PopupComponent,{width:'100%',height:'100%',
    enterAnimationDuration:'1000ms',
    exitAnimationDuration:'2000ms',
    data: this.bardata,
      });
    popup.afterClosed().subscribe(item=>{
    console.log(item);
      });
    }
}
