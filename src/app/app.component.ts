import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from './modals/popup.component';

import { ChartType, Row } from "angular-google-charts";
import { Tweet } from './models/tweet';
//import jsonData from '../../src/assets/data/tweets.json';

import tweetJson from '../../src/assets/apiData/tweets.json';

import conversationJson from '../../src/assets/apiData/conversations.json';
import metricJson from '../../src/assets/apiData/metrics.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  tweets : Tweet[] = [];
  domains: string[] = [];
  uniqueDomains: string[] = [];
  tweetsByLocation: Row[] = [];
  currentDomain: string;
  currentLocation: string;
  currentTweet: Tweet;

  title = 'Spam Tweets Distribution';
  type = ChartType.TreeMap;
  treeMapData : Row[] = []
  columnNames = ['Domain', 'Parent', 'Number of Tweets'];
  options = {};
  width = 650;
  height = 500;
  showSecond: boolean = false;
  showThird: boolean = false;
  showFourth: boolean = false;

  geoTitle = 'Tweets from all over the World';
  geoColNames = ["Country","Number of Tweets"];
  geoOptions = {   
    showTip: true,
  };
  geoWidth = 600;
  geoHeight = 500;

  gaugeData = [
    ['Fake Follower', 1.49],
    ['Financial', 0.43],
    ['Self Declared', 1.79],
    ['Spammer', 4.16],
    ['Overall', 1.31]
  ];

  gaugeCols = ['Label', 'Value']

  gaugeOptions = {
    width: 1000, height: 350,
    greenFrom: 0,
    greenTo: 20,
    redFrom: 50,
    redTo: 100,
    yellowFrom: 20,
    yellowTo: 50,
    minorTicks: 5, 
  };

  tableData : Row[] = []
  tableCols = ['S.NO', 'Tweet']
  tableOptions = {};


  private barData = [
      {"Framework": "Vue", "Stars": "166443", "Released": "2014"},
      {"Framework": "React", "Stars": "150793", "Released": "2013"},
      {"Framework": "Angular", "Stars": "62342", "Released": "2016"},
      {"Framework": "Backbone", "Stars": "27647", "Released": "2010"},
      {"Framework": "Ember", "Stars": "21471", "Released": "2011"},
  ];

  constructor(private dialog: MatDialog){
      tweetJson.forEach(element => {
        this.tweets.push(new Tweet(
          element.id, element.author_id, element.conversation_id, element.text, element.domains, element.country, new Date(element.created_at)))
      });
      this.tweets.forEach(t => {
        t.domains.forEach(d => {
          this.domains.push(d)
        });
      });
      this.treeMapData.push(['Domain', null, 0]);
      this.uniqueDomains = [... new Set(this.domains)];
      [... new Set(this.domains)].forEach(dom => {
        this.treeMapData.push([dom, 'Domain', this.domains.filter((t) => t === dom).length])
      });
  }
  ngOnInit(): void {}

  goBackToFirst(): void{
      this.showSecond = false;
      this.type = ChartType.TreeMap
  }

  onSelect(params: any):void {
      this.showSecond = true;
      this.type = ChartType.GeoChart
      this.generateGeoData(params)
   }

  generateGeoData(param: any): void {
      this.currentDomain = String(this.treeMapData[param.selection[0].row][0]);
      const locations: string[] = []

      this.tweets.forEach((t) => { 
          t.domains.forEach(d => {
            if(d == this.currentDomain){
              locations.push(t.location)
            }
          });
      });
      [... new Set(locations)].forEach(l => {
        this.tweetsByLocation.push([
          l, locations.filter((t) => t === l).length]);
      });
   }

  onGeoSelect(params: any): void {
    this.showThird = true;
    this.type = ChartType.Table
    this.generateTableData(params)
   }

   generateTableData(param: any): void {
    this.currentLocation = String(this.tweetsByLocation[param.selection[0].row][0]);
    const filteredTweets = this.tweets.filter(t => t.location === this.currentLocation && t.domains
                              .some(d => d === this.currentDomain))
    
    filteredTweets.forEach((t, index) => {
        this.tableData.push([
          index + 1, t.text]);
      });
   }
  
   onTableSelect(params: any): void {
    this.showFourth = true;
    this.type = ChartType.Gauge
    this.generateGaugeData(params)
   }

   generateGaugeData(param: any): void {
    const tweet = this.tableData[param.selection[0].row][1];
    this.currentTweet = this.tweets.filter(t =>  t.location === this.currentLocation && t.domains
              .some(d => d === this.currentDomain) && t.text === tweet)[0]
    console.log(this.currentTweet, metricJson)
    // metricJson[this.currentTweet.id]
   }
  

  goBackToThird(): void{
    this.showFourth = false;
    this.type = ChartType.Table
  }

  goBackToSecond(): void{
    this.showThird = false;
    this.type = ChartType.GeoChart
  }

  OpenPopup() {
    const popup = this.dialog.open(PopupComponent,{width:'100%',height:'100%',
        enterAnimationDuration:'1000ms',
        exitAnimationDuration:'2000ms',
        data: this.barData,
          });
    popup.afterClosed().subscribe(() =>{});
    }
}
