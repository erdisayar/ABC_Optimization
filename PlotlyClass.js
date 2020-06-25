export default class PlotlyClass {
  constructor() {
    this.plotInitialized_Line = false;
    this.plotInitialized_Mesh = false;
  }

  documentCreateElement(idTag) {
    var selector = document.querySelector(".PlotlyContainer");
    var divTag = document.createElement("div");
    // divTag.setAttribute(
    //   "style",
    //   "position: relative; left: 300px; top: 100px;"
    // );
    divTag.setAttribute("id", idTag);
    selector.append(divTag);
  }


  plotHistogram(allGobalMin,idTag,cycle){
    this.documentCreateElement(idTag);

    
    var y = [];
    var x = [];
    var color = [];
    for (var i = 0; i < allGobalMin.length/(cycle+1); i++) {
      y[i] = Math.min(...allGobalMin.slice(i*cycle,(i+1)*cycle));
      x[i] = "Run " + (i+1).toString();
      color[i] = `rgba(${parseInt(Math.random()*255)},${parseInt(Math.random()*255)},${parseInt(Math.random()*255)},1)`
      var trace = {
        x: x,
        y: y,
        marker:{
          color:color
        },
        type: 'bar',
      };
    var data = [trace];
    Plotly.newPlot(idTag, data);
}


  }

  plotLine(x, y, idTag,r,cycle) {
    this.documentCreateElement(idTag);
    y = y.slice(y.length-cycle,y.length);
    var layout = {
        title: 'Objective Function Vs Iteration for runtime = ' + (r+1).toString(),
        xaxis: {
          title: 'Iteration',
          showgrid: false,
          zeroline: false
        },
        yaxis: {
          title: 'Objective Function',
          showline: false
        }
      };


    var trace1 = {
      x: x,
      y: y,
    //   type: "scatter",
    mode: 'lines+markers',
    };

    var data = [trace1];

    Plotly.newPlot(idTag, data,layout);
  }


  plotObjFunction(foods,obj,idTag){
    this.documentCreateElement(idTag);

    var n_rows = foods.shape[0];
    var dimension = foods.shape[1];
    var number_of_variables = 150;
    var foods_tmp = nj.zeros([number_of_variables,dimension]);


    // var x = this.linespace(0,50,50);
    // var y = this.linespace(0,50,50);

    var foods_random = nj.random([500,2]);
    foods_random = foods_random.multiply(200);
    foods_random = foods_random.subtract(100)
    var result = obj(foods_random).tolist();
    var z = result;
    foods_random = (foods_random.T).tolist();
    var x = foods_random[0];
    var y = foods_random[1];

   


    
    // Plotting the mesh

    var layout = {
      autosize: false,
      width: 500,
      height: 500,
    };

    var foods_marker_container = [Array(),Array(),Array()];
    for (var food_row = 0 ; food_row < foods.shape[0]; food_row++){


      for (var food_col = 0 ; food_col < foods.shape[1]; food_col++){

        foods_marker_container[food_col].push(foods.get(food_row,food_col));

      }

      

    }

    foods_marker_container[foods.shape[1]] = obj(foods).tolist()


    var data = [
      {
        x: foods_marker_container[0],
        y: foods_marker_container[1],
        z: foods_marker_container[2],
        mode: "markers",
        type: "scatter3d",
        marker: {
          color: "rgb(255, 0, 0)",
          size: 5,
        },
      },
      {
        opacity: 0.5,
        color: "rgb(0,255,255)",
        type: "mesh3d",
        x: x,
        y: y,
        z: z,
      },
    ];
    Plotly.newPlot(idTag, data, layout)

    



  }


  linespace(startValue, stopValue, cardinality) {
    var arr = [];
    var step = (stopValue - startValue) / (cardinality - 1);
    for (var i = 0; i < cardinality; i++) {
      arr.push(startValue + (step * i));
    }
    return arr;
  }

  plotMesh(x, y, z,idTag) {
    this.documentCreateElement(idTag);
    // Plotting the mesh

    // var a=[]; 
    // var b=[]; 
    // var c=[];
    // for(var i=-50;i<100;i++){

    //     for (var j=-50;j<100;j++){
        
    //         var z1 = i*i + j*j;
        
    //         a.push(i);
    //         b.push(j);
    //         c.push(z1);
        
    //     }
        
    //     }

    var layout = {
      autosize: false,
      width: 500,
      height: 500,
    };

    var data = [
      // {
      //   x: [1],
      //   y: [1],
      //   z: [1],
      //   mode: "markers",
      //   type: "scatter3d",
      //   marker: {
      //     color: "rgb(255, 0, 0)",
      //     size: 5,
      //   },
      // },
      {
        opacity: 0.5,
        color: "rgb(0,255,255)",
        type: "mesh3d",
        x: x,
        y: y,
        z: z,
      },
    ];
    Plotly.newPlot(idTag, data, layout);
  }

  animateLine(x, y, idTag) {

    if (!this.plotInitialized_Line) {
        this.plotLine([0], [0], idTag);
        this.plotInitialized_Line = true;
    }
    // this.documentCreateElement(idTag);


    var trace1 = {
      x: x,
      y: y,
    //   type: "scatter",
    mode: 'lines+markers',
    };

    var data = [trace1];

    Plotly.animate(
      idTag,
      {
        data,
        traces: [0],
        //layout: layout,
      },
      {
        transition: {
          duration: 50,
          easing: "cubic-in-out",
        },
        frame: {
          duration: 50,
        },
      }
      //layout
    );
  }

  animateMesh(foods, objfun,idTag) {


    if (!this.plotInitialized_Mesh) {
        this.plotMesh([0], [0],[0], idTag);
        this.plotInitialized_Mesh = true;
    }

    
    var x_marker = [];
    var y_marker = [];
    var z_marker = [];

    z_marker = objfun(foods).tolist();
    foods = foods.tolist();

    for (var i = 0; i < foods.length; i++) {
      x_marker.push(foods[i][0]);
      y_marker.push(foods[i][1]);
    }

    var data = [
      {
        x: x_marker,
        y: y_marker,
        z: z_marker,
        mode: "markers",
        type: "scatter3d",
        marker: {
          color: "rgb(255, 0, 0)",
          size: 5,
        },
      },
    ];

    var layout = {
      autosize: false,
      width: 500,
      height: 500,
    };

    Plotly.animate(
        idTag,
      {
        data,
        traces: [0],
        layout: layout,
      },
      {
        transition: {
          duration: 50,
          easing: "cubic-in-out",
        },
        frame: {
          duration: 50,
        },
      },
      layout
    );
  }

  plotSurface(ObjArray, idTag) {
    this.documentCreateElement(idTag);
    // var z1 = [
    //     [8.83,8.89,8.81,8.87,8.9,8.87],
    //     [8.89,8.94,8.85,8.94,8.96,8.92],
    //     [8.84,8.9,8.82,8.92,8.93,8.91],
    //     [8.79,8.85,8.79,8.9,8.94,8.92],
    //     [8.79,8.88,8.81,8.9,8.95,8.92],
    //     [8.8,8.82,8.78,8.91,8.94,8.92],
    //     [8.75,8.78,8.77,8.91,8.95,8.92],
    //     [8.8,8.8,8.77,8.91,8.95,8.94],
    //     [8.74,8.81,8.76,8.93,8.98,8.99],
    //     [8.89,8.99,8.92,9.1,9.13,9.11],
    //     [8.97,8.97,8.91,9.09,9.11,9.11],
    //     [9.04,9.08,9.05,9.25,9.28,9.27],
    //     [9,9.01,9,9.2,9.23,9.2],
    //     [8.99,8.99,8.98,9.18,9.2,9.19],
    //     [8.93,8.97,8.97,9.18,9.2,9.18]
    //   ];

    var z1 = [];
    ObjArray.forEach((e) => z1.push(e));

    var data_z1 = {
      z: z1,
      type: "surface",
      contours: {
        z: {
          show: true,
          usecolormap: true,
          highlightcolor: "#42f462",
          project: { z: true },
        },
      },
    };

    var layout = {
        title: 'Objective Function Foods Iteration',
        scene: {camera: {eye: {x: 1.87, y: 0.88, z: -0.64}},
        xaxis:{title: '#Foods'},
		yaxis:{title: '#Iteration'},
		zaxis:{title: 'Objective Function'},},
        autosize: false,
        width: 500,
        height: 500,
        margin: {
          l: 65,
          r: 50,
          b: 65,
          t: 90,
        }
      };

    Plotly.newPlot(idTag, [data_z1],layout);
  }

  plotTable(foods, objfun, idTag) {
    this.documentCreateElement(idTag);
    var headerValues = ["#Solution"];
    
    var precision_length = 3;
    var food_size = foods.shape;
    var cellValues = [];

    var number_of_columns = new Array();
    number_of_columns.push(0); //This is for Solution column 
    
    for( var ic = 0 ; ic < food_size[1]; ic++){
       headerValues.push("Foods"+ic)
       var foods_container = new Array();
       var number_of_rows = new Array();
       number_of_columns.push(ic+1); // They are for foods column

       for(var ir=0; ir<food_size[0];ir++){
      foods_container.push(foods.get(ir,ic).toFixed(precision_length));
      number_of_rows.push(ir);
    }
      cellValues.push(foods_container);
  }
    number_of_columns.push(ic+1); // This is for objective function column
    headerValues.push("ObjFunction");
    cellValues.unshift(number_of_rows);


    var objSolution = objfun(foods).tolist();
    objSolution = objSolution.map(e=>e.toFixed(precision_length))
    
 
    

    cellValues.push(objSolution);

    // create table
    var table = {
      type: "table",
      columnwidth: 250,
      columnorder: number_of_columns,
      header: {
        values: headerValues,
        align: "center",
        line: { width: 1, color: "rgb(50, 50, 50)" },
        fill: { color: ["rgb(235, 100, 230)"] },
        font: { family: "Arial", size: 11, color: "white" },
      },
      cells: {
        values: cellValues,
        align: ["center", "center"],
        line: { color: "black", width: 1 },
        fill: { color: ["rgb(235, 193, 238)", "rgba(228, 222, 249, 0.65)"] },
        font: { family: "Arial", size: 10, color: ["black"] },
      },
      xaxis: "x",
      yaxis: "y",
      domain: { x: [0, 0.4], y: [0, 1] },
    };

    var data = [table];

    // define layout
    var layout = {
      title: "Solution Table",
      plot_bgcolor: "rgba(228, 222, 249, 0.65)",
      showlegend: false,
    };

    Plotly.newPlot(idTag, data, layout);
  }

  plotInitialize() {
    // Generating random data..

    this.plotLine();
    // this.plotMesh(a, b, c);
    //this.plotSurface()
  }

  PlotlyAnimate(foods, objfun) {
    /*
     foods nxD Nj type array
     objfun is the callback function
     */

    var x_marker = [];
    var y_marker = [];
    var z_marker = [];

    z_marker = objfun(foods).tolist();
    foods = foods.tolist();

    for (var i = 0; i < foods.length; i++) {
      x_marker.push(foods[i][0]);
      y_marker.push(foods[i][1]);
    }

    var data = [
      {
        x: x_marker,
        y: y_marker,
        z: z_marker,
        mode: "markers",
        type: "scatter3d",
        marker: {
          color: "rgb(255, 0, 0)",
          size: 5,
        },
      },
    ];

    var layout = {
      autosize: false,
      width: 500,
      height: 500,
    };

    Plotly.animate(
      "myDiv",
      {
        data,
        traces: [0],
        layout: layout,
      },
      {
        transition: {
          duration: 50,
          easing: "cubic-in-out",
        },
        frame: {
          duration: 50,
        },
      },
      layout
    );

    var trace1 = {
      x: this.iterationnumber,
      y: this.GlobalMinIteration_p,
      type: "scatter",
    };

    var data = [trace1];

    Plotly.animate(
      "myDiv2",
      {
        data,
        traces: [0],
        layout: layout,
      },
      {
        transition: {
          duration: 50,
          easing: "cubic-in-out",
        },
        frame: {
          duration: 50,
        },
      },
      layout
    );
  }

  
printCombination(arr,n,r){

  data = "0".repeat(r);

  this.combinationUtil(arr,data,0,n-1,0,r);
}


combinationUtil(arr,data,start,end,index,r){

  if (index === r){
      console.log(data);
  }

  var i = start;

  while(i<= end && end-i+r >= r - index){
      data = data.replace(data[index],arr[i])
      i++;
      combinationUtil(arr,data,i,end,index+1,r);
  }


}

  
}
