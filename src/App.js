import { useEffect, useRef, useState } from 'react';
import './App.css';
import * as d3 from "d3";




function App() {

  const [dataSet, setDataSet] = useState([])
  const [baseTemperature, setBaseTemperature] = useState(0)
  const [minYear, setMinYear] = useState(0)
  const [maxYear, setMaxYear] = useState(0)
  const [toolTip, setToolTip] = useState({opacity: false})
  const svgRef = useRef(null)
  const w = 1603
  const h = 540
  const padding = 100
  const legendRectEdge = 25
  const legendGradeCount = 9
  const monthes = ["January","February","March","April","May","June","July","August","September","October","November","December"]

  const handleOver = (d, i) => {
    //console.log("i param in handleOver: ", i)
    console.log("d param in handleOver: ", d)
    setToolTip({opacity:true, x:d.clientX, y:d.clientY, ...i})
  }

  const handleOut = () => {
    //console.log("Mouse outed")
    setToolTip({opacity: false})
  }

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
      // console.log("Just fetched data in useEffect", dataSet)

      const minTemperature = d3.min(dataSet, d => baseTemperature + d.variance)
      const maxTemperature = d3.max(dataSet, d => baseTemperature + d.variance)

      //console.log("Min and Max temp is: ", minTemperature, ", ", maxTemperature)

      const svg = d3.select(svgRef.current) 
        .attr("width", w)
        .attr("height", h)
        .attr("id", "title")

      
      const cellWidth = (w - padding * 2) / (maxYear - minYear)
      const cellHeight = (h - padding * 2) / 12
      //console.log("Cell width: ", cellWidth)
      //console.log("Cell height: ", cellHeight)

      const zScale = d3.scaleSequential()
        .domain([minTemperature, maxTemperature])
        .interpolator(d3.interpolatePlasma);

      
        
      // console.log("DataSet before bars generation: ", dataSet)

      svg.selectAll("rect")
          .data(dataSet)
          .enter()
          .append("rect")
          .attr("width", cellWidth)
          .attr("height", cellHeight)
          .attr("x", d => padding + (d.year - minYear) * cellWidth)
          .attr("y", d => padding + (d.month - 1) * cellHeight)
          .attr("class", "cell")
          .attr("data-month", d => d.month - 1)
          .attr("data-year", d => d.year)
          .attr("data-temp", d => d.variance + baseTemperature)
          .attr("fill", d => zScale(d.variance + baseTemperature))
          .on("mouseover", handleOver)
          .on("mouseout", handleOut)

      let years = dataSet.map(element => element.year)
      years = [...new Set(years)]
      //console.log("How the years array looks like: ", years)
      const xScale = d3.scaleBand()
        .domain(years)
        .range([padding, w - padding + cellWidth])

      const yScale = d3.scaleBand()
        .domain(monthes)
        .range([padding, h - padding])


      
        
      const xAxis = d3.axisBottom(xScale)
        .tickFormat(x => (x % 10 === 0) ? `${x.toFixed(0)}` : "")

      const yAxis = d3.axisLeft(yScale)

      svg.append("g")
        .call(xAxis)
        .attr("transform", `translate(0, ${h - padding})`)
        .attr("id", "x-axis")

      svg.append("g")
        .call(yAxis)
        .attr("transform", `translate(${padding}, 0)`)
        .attr("id", "y-axis")

      

      const legend = svg.append("g")
        .attr("id", "legend")
        .attr("transform", `translate(${padding + 50}, ${h - padding + 25})`)


      const legendArrayGeneration = (min, max, count) => {
        let array = []
        for (let i = min; i <= max; i = (i + (max - min) / count)) {
          array.push(i)
        }
        return(array)
      }

      const legendArray = legendArrayGeneration(minTemperature, maxTemperature, legendGradeCount)

      //console.log("Initial legendArray looks like: ", legendArray)


      
      
      legend.selectAll("rect")
        .data(legendArray)
        .enter()
        .append("rect")
        .attr("x", (d, i) => i * legendRectEdge)
        .attr("y", 0)
        .attr("width", legendRectEdge)
        .attr("height", legendRectEdge)
        .attr("fill", d => zScale(d))
        .attr("stroke", "black")
        .attr("stroke-width", 1)
      

      const zScaleLegend = d3.scaleBand()
        .domain(legendArray)
        .range([0, (legendGradeCount + 1) * legendRectEdge])

      
      const zAxis = d3.axisBottom(zScaleLegend)
        .tickFormat(x => `${x.toFixed(1)}`)

      legend.append("g")
        .call(zAxis)
        .attr("transform", `translate(0, ${legendRectEdge})`)

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
      <div id="tooltip" data-year={toolTip.year} style={{opacity:toolTip.opacity?0.8:0, position:"absolute", top:toolTip.y + 5, left: toolTip.x + 20}}>
        {/* {console.log(toolTip)} */}
        {toolTip.year} - {monthes[toolTip.month - 1]}
        <br></br>
        Temp - {(toolTip.variance + baseTemperature).toFixed(1)}
        <br></br>
        Variance - {toolTip.variance}
      </div>
    </div>
  );
}

export default App;
