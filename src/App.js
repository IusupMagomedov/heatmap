import { useEffect, useRef, useState } from 'react';
import './App.css';
import * as d3 from "d3";




function App() {

  const [dataSet, setDataSet] = useState([])
  const svgRef = useRef(null)
  const w = 1603
  const h = 540

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json")
      .then(response => response.json())
      .then(data => setDataSet(data))
      .catch(error => console.log(error))
  
    return () => {}
  }, [])
  

  useEffect(() => {
    const svg = d3.select(svgRef.current)
      .attr("width", w)
      .attr("height", h)


    return () => {} 
  }, [dataSet])

  return (
    <div className="App">
      <svg ref={svgRef}></svg>
    </div>
  );
}

export default App;
