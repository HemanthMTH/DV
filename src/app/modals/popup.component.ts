import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as d3 from 'd3';

@Component({
  selector: 'app-modalpopup',
  templateUrl: './popup.component.html'
})
export class PopupComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private Ref: MatDialogRef<PopupComponent>) { }
  result: any;
  closemessage={name:"Test User"}

  private barvg: any;
  private margin = 50;
  private barwidth = 750 - (this.margin * 2);
  private barheight = 400 - (this.margin * 2);

  ngOnInit(): void {
    this.result = this.data;
    this.createSvg();
    this.drawBars(this.result);
  }

  closePopup() {
    this.Ref.close("Closing from function");
  }

  private createSvg(): void {
      this.barvg = d3.select("figure#bar")
      .append("svg")
      .attr("width", this.barwidth + (this.margin * 2))
      .attr("height", this.barwidth + (this.margin * 2))
      .append("g")
      .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
    }

  private drawBars(data: any[]): void {
    // Create the X-axis band scale
    const x = d3.scaleBand()
    .range([0, this.barwidth])
    .domain(data.map(d => d.Framework))
    .padding(0.2);

    // Draw the X-axis on the DOM
    this.barvg.append("g")
    .attr("transform", "translate(0," + this.barheight + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

    // Create the Y-axis band scale
    const y = d3.scaleLinear()
    .domain([0, 200000])
    .range([this.barheight, 0]);

    // Draw the Y-axis on the DOM
    this.barvg.append("g")
    .call(d3.axisLeft(y));

    // Create and fill the bars
    this.barvg.selectAll("bars")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d: any) => x(d.Framework))
    .attr("y", (d: any) => y(d.Stars))
    .attr("width", x.bandwidth())
    .attr("height", (d: any) => this.barheight - y(d.Stars))
    .attr("fill", "#d04a35");
  }

}
