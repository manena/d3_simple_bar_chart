
// svg

//var margin = {top: 40, right: 10, bottom: 60, left: 60};
var margin = {top: 40, right: 10, bottom: 60, left: 60};

var width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("#chart-area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



var orden = -1
d3.select("#ranking-type").on("change", function(){orden = -1; ordenar_data() });

loadData();

var data;

var ranking_type = $("#ranking-type option:selected").val();
function loadData() {
	
	d3.csv("data/airlines.csv", function(error, csv) {

		csv.forEach(function(d){
			d.facturacion = +d.facturacion;
			d.viajeros = +d.viajeros;
		});

		// Almacenamos los datos en una variable global que necesitaremos luego
		data = csv;
		

	    // Dibujar la visualizacion la primera vez
		ordenar_data();
	});
}

function updateVisualization() {
	
	ranking_type = $("#ranking-type option:selected").val();
	

	barWidth = (width / data.length) - 10
	 // Escalas
	
	var x = d3.scale.linear()
		.domain([0, data.length])
	    .range([0, width]);
	
	var x_nombres = d3.scale.ordinal()
    	.rangeRoundBands([0, width], 0, 0)
		.domain(data.map(function(d) { return d.nombre; }));
  
	var y = d3.scale.linear()	    
	    .domain([0, d3.max(data, function(d) { return d[ranking_type]; })])
	    .range([0, height]);

	var y_values = d3.scale.linear()	    
	    .domain([0, d3.max(data, function(d) { return d[ranking_type]; })])
	    .range([height, 0]);

	
	svg.selectAll("rect")
                .data(data)
                .enter()
                        .append( "rect")  
                        .attr('class','bar')
                        .attr("width", barWidth)
				        .attr("y", height)
				        .attr("height", 0)
	svg.selectAll(".axis").remove();
    //Create the Axis
	var xAxis = d3.svg.axis()
	                   .scale(x_nombres)
	                   .orient("bottom")
	//Create an SVG group Element for the Axis elements and call the xAxis function
	var xAxisGroup = svg.append("g")
                        .attr("class", "x axis")                        
      					.attr("transform", "translate(0," + height + ")")
                        .call(xAxis)     

	//Create the Axis
	var yAxis = d3.svg.axis()
	                   .scale(y_values)
	                   .orient("left")


	//Create an SVG group Element for the Axis elements and call the xAxis function
	var yAxisGroup = svg.append("g")
                        .attr("class", "y axis")      					
                              .call(yAxis)                              

	                                   
  
var bars = svg.selectAll("rect.bar")
        .data(data)



    //exit 
    bars.exit()
    .transition()
    .duration(300)
    .ease("exp")
        .attr("height", 0)
        .remove()


    bars
        .attr("stroke-width", 4)
    .transition()
    .duration(300)
    .ease("quad")
        .attr("width", barWidth)
        .attr("y", function( d ){ return height - y(d[ranking_type])})
        .attr("height", function( d ){ return  y(d[ranking_type])})
        .attr("x", function( d, i ){ return x(i) })
        
                           

}

function ordenar_data(){
	ranking_type = $("#ranking-type option:selected").val();
	if(orden == -1)
	{
		data = data.sort(function(a, b){ return d3.descending(a[ranking_type], b[ranking_type]); });
		orden = 1;
		$("#ordenar").val("Orden <<");
	}
	else
	{
		data = data.sort(function(a, b){ return d3.ascending(a[ranking_type], b[ranking_type]); });
		orden = -1;
		$("#ordenar").val("Orden >>");
	}
	updateVisualization();
}	
