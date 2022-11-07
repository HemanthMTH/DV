import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from './modals/popup.component';

import { ChartType, Row } from "angular-google-charts";
import { Tweet } from './models/tweet';
//import jsonData from '../../src/assets/data/tweets.json';

import tweetJson from '../../src/assets/apiData/tweets.json';
import noLocData from '../../src/assets/apiData/tweets_without_location.json'
import metricJson from '../../src/assets/apiData/metrics.json';
import { Metric } from './models/metrics';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  tweets : Tweet[] = [];
  tweetsNoLoc: Tweet[] = [];
  domains: string[] = [];
  uniqueDomains: string[] = [];
  tweetsByLocation: Row[] = [];
  metricData: Metric;
  currentDomain: string;
  currentLocation: string;
  currentTweet: Tweet;

  title = 'Tweets Distribution based on Domains';
  type = ChartType.TreeMap;
  type2 = ChartType.Scatter;
  treeMapData : Row[] = []
  columnNames = ['Domain', 'Parent', 'Number of Tweets'];
  options = {
    showTip: true
  };
  
  showSecond: boolean = false;
  showThird: boolean = false;
  showFourth: boolean = false;

  geoTitle = 'Tweets from all over the World';
  geoColNames = ["Country","Number of Tweets"];
  geoOptions = {   
    showTip: true,
  };

  width = 750;
  height = 550;

  sWidth = 400;
  sHeight = 500;
  geoWidth = 900;
  geoHeight = 480;
  tWidth = 500;
  tHeight = 500;

  scatterData: Row[] = []
  scatterCols = ['Impression', 'Spam Score']
  scatterOptions = {
    title: 'Impression Spam Score comparison',
          hAxis: {title: 'Impression', minValue: 0},
          vAxis: {title: 'Spam Score', minValue: 0, maxValue: 100},
          legend: 'none'
    }

  gaugeData = [
    ['Fake Follower',0],
    ['Financial', 0],
    ['Self Declared', 0],
    ['Spammer', 0],
    ['Overall', 0]
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

  dataSource = [
    {name: 'Fake follower', description: 'Bots purchased to increase follower counts'},
    {name: 'Financial', description: 'Bots that post using cashtags'},
    {name: 'Self declared', description: 'Bots from botwiki.org'},
    {name: 'Spammer', description: 'Accounts labeled as spambots from several datasets'},
    {name: 'Overall', description: 'Average of all'}
  ];
  displayedColumns: string[] = ['name', 'description'];


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
          element.id, element.author_id, element.conversation_id, 
          element.text, element.domains, element.country, new Date(element.created_at), element.organic_metrics))
      });
      noLocData.forEach(element => {
        this.tweetsNoLoc.push(new Tweet(
          element.id, element.author_id, element.conversation_id, 
          element.text, element.domains, element.country, new Date(element.created_at), element.organic_metrics))
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
  
  getNoLocData(): void{
      this.showThird = true;
      const currentNoLocTweets = this.tweetsNoLoc.filter(t => t.domains.some(d => d === this.currentDomain))
      this.type = ChartType.Table
      this.generateNoLocTableData(currentNoLocTweets)
  }

  onGeoSelect(params: any): void {
      this.showThird = true;
      this.type = ChartType.Table
      this.generateTableData(params)
   }

   generateNoLocTableData(tweets: Tweet[]): void {
      this.scatterData = []
      this.tableData = []
      tweets.forEach((t, index) => {      
        this.scatterData.push(this.organizeScatterData(t))
        this.tableData.push([
          index + 1, t.text]);
      });
   }

   organizeScatterData(t: Tweet):[number, number]{
      let overallSpamScore = 0
      Object.entries(metricJson).forEach(b => {
        if (b[0] === t.usedId){
          overallSpamScore = b[1].overall
        }
      });
      return [t.organicMetrics.impression_count, overallSpamScore]
   }

   generateTableData(param: any): void {
      this.scatterData = []
      this.tableData = []
      this.currentLocation = String(this.tweetsByLocation[param.selection[0].row][0]);
      const filteredTweets = this.tweets.filter(t => t.location === this.currentLocation && t.domains
                                .some(d => d === this.currentDomain))
      
      filteredTweets.forEach((t, index) => {
          this.tableData.push([
            index + 1, t.text]);
          this.scatterData.push(this.organizeScatterData(t))
        });
      
   }

   onScatterPointSelect(params: any): void{
      console.log(params)
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
      Object.entries(metricJson).forEach(b => {
        if (b[0] === this.currentTweet.usedId){
          this.metricData = new Metric(b[1].fake_follower, b[1].financial, b[1].overall, b[1].self_declared, b[1].spammer)
        }
      });
      this.gaugeData = [
        ['Fake Follower', this.metricData.fake_follower],
        ['Financial', this.metricData.financial],
        ['Self Declared', this.metricData.self_declared],
        ['Spammer', this.metricData.spammer],
        ['Overall', this.metricData.overall]
      ]
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
