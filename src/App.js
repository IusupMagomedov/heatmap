import { useEffect, useRef, useState } from 'react';
import './App.css';
import * as d3 from "d3";




function App() {

  const [dataSet, setDataSet] = useState([])
  const [baseTemperature, setBaseTemperature] = useState(0)
  const [minYear, setMinYear] = useState(0)
  const [maxYear, setMaxYear] = useState(0)
  const svgRef = useRef(null)
  const w = 1603
  const h = 540
  const padding = 60
  

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json")
      .then(response => response.json())
      .then(data => {
        setBaseTemperature(data.baseTemperature)
        setDataSet(data.monthlyVariance)
        setMinYear(d3.min(data.monthlyVariance, d => d.year))
        setMaxYear(d3.max(data.monthlyVariance, d => d.year))  
      })
      .catch(error => console.log(error))
    return () => {}
  }, [])

  
  

  useEffect(() => {

    if(dataSet.length > 1) {
      //console.log("Just fetched data in useEffect", dataSet)

      const svg = d3.select(svgRef.current) 
        .attr("width", w)
        .attr("height", h)
        .attr("id", "title")

      
      const cellWidth = (w - padding * 2) / (maxYear - minYear)
      const cellHeight = (h - padding * 2) / 12
      //console.log("Cell width: ", cellWidth)
      //console.log("Cell height: ", cellHeight)

      svg.selectAll("rect")
          .data(dataSet)
          .enter()
          .append("rect")
          .attr("width", cellWidth)
          .attr("height", cellHeight)
          .attr("x", d => padding + (d.year - minYear) * cellWidth)
          .attr("y", d => padding + (d.month - 1) * cellHeight)
          .attr("class", "cell")
          .attr("data-month", d => d.month)
          .attr("data-year", d => d.year)
          .attr("data-temp", d => d.variance + baseTemperature)
          .attr("fill", "blue")

      let years = dataSet.map(element => element.year)
      years = [...new Set(years)]
      console.log("How the years array looks like: ", years)
      const xScale = d3.scaleBand()
        .domain(years)
        .range([padding, w - padding + cellWidth])

      const yScale = d3.scaleBand()
        .domain(["January","February","March","April","May","June","July","August","September","October","November","December"])
        .range([padding, h - padding])


      const xAxis = d3.axisBottom(xScale)
        .tickFormat(x => (x % 10 === 0) ? `${x.toFixed(0)}` : "")

      const yAxis = d3.axisLeft(yScale)

      svg.append("g")
        .call(xAxis)
        .attr("transform", `translate(0, ${h - padding})`)

      svg.append("g")
        .call(yAxis)
        .attr("transform", `translate(${padding}, 0)`)




    }
    

    return () => {} 
  }, [dataSet, minYear, maxYear, baseTemperature])

  useEffect(() => {
    
  
    return () => {}
  }, [])
  

  return (
    <div className="App">
      <div id="description"><h1>Monthly Global Land-Surface Temperature</h1></div>
      <div>{minYear} - {maxYear}: base temperature {baseTemperature}℃</div>
      <svg ref={svgRef}></svg>
    </div>
  );
}

export default App;
