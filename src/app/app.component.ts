import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from './modals/popup.component';

import { ChartType, Row } from "angular-google-charts";

import { Tweet } from './models/tweet';
import { Metric } from './models/metrics';

//importing dataset
import tweetJson from '../../src/assets/apiData/tweets.json';
import noLocData from '../../src/assets/apiData/tweets_without_location.json'
import metricJson from '../../src/assets/apiData/metrics.json';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  tweets : Tweet[] = [];
  tweetsNoLoc: Tweet[] = [];
  domains: string[] = [];
  uniqueDomains: string[] = [];
  tweetsByLocation: Row[] = [];
  metricData: Metric;
  currentDomain: string;
  currentLocation: string;
  currentTweet: Tweet;

  showSecond: boolean = false;
  showThird: boolean = false;
  showFourth: boolean = false;

  title = 'Tweets Distribution based on Domains';
  type = ChartType.TreeMap;
  type2 = ChartType.Scatter;
  treeMapData : Row[] = []
  columnNames = ['Domain', 'Parent', 'Number of Tweets'];
  // setting configuration options for Tree map chart
  options = {
    showTip: true,
    minColor: '#009688',
    midColor: '#f7f7f7',
    maxColor: '#ee8100',
  };
  width = 750;
  height = 550;

  geoTitle = 'Tweets from all over the World';
  geoColNames = ["Country","Number of Tweets"];
   // setting configuration options for Geo chart
  geoOptions = {   
    showTip: true,
    colorAxis: {colors: ['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93']}, // color palette 
    backgroundColor: '#81d4fa',
    datalessRegionColor: '#f5f5f5',
  };
  geoWidth = 900;
  geoHeight = 480;

  scatterData: Row[] = []
  scatterCols = ['Impression', 'Spam Score']

  // setting configuration options for TScatter chart
  scatterOptions = {
    chart: {
      title: 'Impression Spam Score comparison'
    },
    hAxis: {title: 'Impression', minValue: 0},
    vAxis: {title: 'Spam Score', minValue: 0, maxValue: 100},
    legend: 'none'
  }
  sWidth = 400;
  sHeight = 500;

  gaugeData: Row[] = [];
  gaugeCols = ['Label', 'Value']

  // setting configuration options for Gauge chart
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
  gaugeLegend = [
    {name: 'Fake follower', description: 'Bots purchased to increase follower counts'},
    {name: 'Financial', description: 'Bots that post using cashtags'},
    {name: 'Self declared', description: 'Bots from botwiki.org'},
    {name: 'Spammer', description: 'Accounts labeled as spambots from several datasets'},
    {name: 'Overall', description: 'Average of all'}
  ];
  displayedColumns: string[] = ['name', 'description'];

  tableData : any = []
  tableCols = ['S.No', 'Tweet', 'Bot?']
  tableOptions = {};
  tWidth = 500;
  tHeight = 500;

  constructor(private dialog: MatDialog){
      this.objectifyTweets() 
      this.generateDomains()  
      this.generateTreeMapData()
  }

  //data transformation: grouping data based on domains
  generateDomains(): void{
    this.tweets.forEach(t => {
      t.domains.forEach(d => {
        this.domains.push(d)
      });
    });
  }

  //constructing the dataset in the form of array of Tweet objects.
  objectifyTweets(): void {
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
  }

  // for generating input data for Tree map chart
  generateTreeMapData(): void {
    this.treeMapData.push(['Domain', null, 0]);
      this.uniqueDomains = [... new Set(this.domains)];
      [... new Set(this.domains)].forEach(dom => {
        this.treeMapData.push([dom, 'Domain', this.domains.filter((t) => t === dom).length])
      });
  }

  // to navigate back to Tree map chart
  goBackToFirst(): void{
      this.showSecond = false;
      this.type = ChartType.TreeMap
  }

  // event handling on Tree map chart
  onSelect(params: any):void {
      this.showSecond = true;
      this.type = ChartType.GeoChart
      this.generateGeoData(params)
   }

  // for generating input data for Geo chart
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
      // filtering data with no location
      [... new Set(locations)].forEach(l => {
        this.tweetsByLocation.push([
          l, locations.filter((t) => t === l).length]);
      });
   }
  
  // handling data with no location
  getNoLocData(): void{
      this.showThird = true;
      const currentNoLocTweets = this.tweetsNoLoc.filter(t => t.domains.some(d => d === this.currentDomain))
      this.type = ChartType.Table
      this.generateNoLocTableData(currentNoLocTweets)
  }

  // event handling on Geo chart
  onGeoSelect(params: any): void {
      this.showThird = true;
      this.type = ChartType.Table
      this.generateTableScatterData(params)
   }

   // for handle Tweet data with no geo location
   generateNoLocTableData(tweets: Tweet[]): void {
      this.scatterData = []
      this.tableData = []
      tweets.forEach((t, index) => { 
        const scoreList = this.getMetricData(t)     
        this.scatterData.push(scoreList)
        this.tableData.push([
          index + 1, t.text, scoreList[1] >60]);
      });
   }

   // getting metric data for a given Tweet
   getMetricData(t: Tweet):[number, number]{
      let overallSpamScore = 0
      Object.entries(metricJson).forEach(b => {
        if (b[0] === t.usedId){
          overallSpamScore = b[1].overall
        }
      });
      return [t.organicMetrics.impression_count, overallSpamScore]
   }

   // for generating input data for Table chart and Scatter Chart
   generateTableScatterData(param: any): void {
      this.scatterData = []
      this.tableData = []
      this.currentLocation = String(this.tweetsByLocation[param.selection[0].row][0]);
      const filteredTweets = this.tweets.filter(t => t.location === this.currentLocation && t.domains
                                .some(d => d === this.currentDomain))
      
      filteredTweets.forEach((t, index) => {
          const scoreList = this.getMetricData(t)
          this.tableData.push([
            index + 1, t.text, scoreList[1] > 60]);
          this.scatterData.push(scoreList)
        });
   }
  
   // event handling on Table chart
   onTableSelect(params: any): void {
      this.showFourth = true;
      this.type = ChartType.Gauge
      this.generateGaugeData(params)
   }

   // for generating input data for Gauge chart
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

  // to navigate back to Table chart and Scatter chart
  goBackToThird(): void{
    this.showFourth = false;
    this.type = ChartType.Table
  }

  // to navigate back to Geo chart
  goBackToSecond(): void{
    this.showThird = false;
    this.type = ChartType.GeoChart
  }

  // this can be used for creating D3 visualizations (Future work)
  OpenPopup() {
    const popup = this.dialog.open(PopupComponent,{width:'100%',height:'100%',
        enterAnimationDuration:'1000ms',
        exitAnimationDuration:'2000ms',
          });
    popup.afterClosed().subscribe(() =>{});
    }
}
