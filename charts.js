function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
  
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
      var firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  // Initialize the dashboard
  init();
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildMetadata(newSample);
    buildCharts(newSample);
  
  }
  
  // Demographics Panel 
  function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      // Filter the data for the object with the desired sample number
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      // Use d3 to select the panel with id of `#sample-metadata`
      var PANEL = d3.select("#sample-metadata");
  
      // Use `.html("") to clear any existing metadata
      PANEL.html("");
  
      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
  
    });
  }
  
  // 1. Create the buildCharts function.
  function buildCharts(sample) {
    // 2. Use d3.json to load and retrieve the samples.json file 
    d3.json("samples.json").then((data) => {
      // 3. Create a variable that holds the samples array. 
      var samples = data.samples;
      // 4. Create a variable that filters the samples for the object with the desired sample number.
      var filteredSample = samples.filter(sampleobject => sampleobject.id == sample);
      //  5. Create a variable that holds the first sample in the array.
      varFirstSample = filteredSample[0];
      // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
      var otu_ids = varFirstSample.otu_ids;
      var otu_labels = varFirstSample.otu_labels;
      var sample_values = varFirstSample.sample_values;
  
      // 7. Create the yticks for the bar chart.
      // Hint: Get the the top 10 otu_ids and map them in descending order  
      //  so the otu_ids with the most bacteria are last. 
  
      var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
      var xticks = sample_values.slice(0, 10).reverse();
      var labels = otu_labels.slice(0, 10).reverse();
  
      // 8. Create the trace for the bar chart. 
      var barData = [{
        x: xticks,
        y: yticks,
        text: labels,
        type: 'bar',
        orientation: 'h'
      }
      ];
      // 9. Create the layout for the bar chart. 
      var barLayout = {
        title: "Top 10 OTUs Found",
      };
      // 10. Use Plotly to plot the data with the layout. 
      Plotly.newPlot("bar", barData, barLayout)
  
      // Trace for Bubble Chart
      var traceBubble = {
        x: otu_ids,
        y: sample_values,
        mode: 'markers',
        marker: {
          size: sample_values,
          color: otu_ids,
        },
        text: otu_labels
      };
  
      var Bubbledata = [traceBubble]
  
      // Layout for Bubble Chart
      var Bubblelayout = {
        title: "Bacteria Cutures Per Sample",
        xaxis: { title: 'OTU ID' }
      };
  
      // Creating Bubble Chart
      Plotly.newPlot('bubble', Bubbledata, Bubblelayout);
  
      // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata_SelId = data.metadata.filter(data => data.id == sample);
    console.log(metadata_SelId);  

    // 3. Create a variable that holds the washing frequency.
    var washFreq = +metadata_SelId[0].wfreq;
    
    // 4. Create the trace for the gauge chart.
    var gaugeTrace = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: washFreq,
        title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per week"},
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: {
            range: [null, 10],
            tickmode: "array",
            tickvals: [0,2,4,6,8,10],
            ticktext: [0,2,4,6,8,10]
          },
          bar: {color: "black"},
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "green" },
            { range: [8, 10], color: "blue" }]
        }
      }
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
        autosize: true
      };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeTrace, gaugeLayout);
  });
  
}
  