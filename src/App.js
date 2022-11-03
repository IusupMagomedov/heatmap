import { useEffect, useRef, useState } from 'react';
import './App.css';
import * as d3 from "d3";




function App() {

  const [dataSet, setDataSet] = useState([])
  const [baseTemperature, setBaseTemperature] = useState(0)
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
      })
      .catch(error => console.log(error))
    
    return () => {}
  }, [])
  

  useEffect(() => {
    //console.log("Just fetched data in useEffect", dataSet)

    const svg = d3.select(svgRef.current)
      .attr("width", w)
      .attr("height", h)
      .attr("id", "title")

    const minYear = d3.min(dataSet, d => d.year)

    const maxYear = d3.max(dataSet, d => d.year)

    const cellWidth = (w - padding * 2) / (maxYear - minYear)
    //console.log("Cell width: ", cellWidth)
    const cellHeight = (h - padding * 2) / 12
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

    


    return () => {} 
  }, [dataSet])

  return (
    <div className="App">
      <svg ref={svgRef}></svg>
    </div>
  );
}

export default App;
