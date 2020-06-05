
import ABC from './beeClass.js';

var ABCRunner_Button = document.querySelector('.ionic-menu-button');
ABCRunner_Button.addEventListener('click',ABCRunner);





function openMenu(){
    menuController.open()
    console.log("Menu is open");

}

function ABCRunner() {
    console.log("Code.js script");
    var colonySize = Number(document.querySelector('#colonySizeID').value);
    var foodNumber = Number(document.querySelector('#foodNumberID').value);
    var limit = Number(document.querySelector('#limitID').value);
    var maxCycle = Number(document.querySelector('#maxCycleID').value);
    var dimension = Number(document.querySelector('#dimensionID').value);
    var runTime = Number(document.querySelector('#runTimeID').value);
    if(!colonySize){colonySize = 20}
    if(!foodNumber){foodNumber = colonySize/2}
    if(!limit){limit = 100}
    if(!maxCycle){maxCycle = 10}
    if(!dimension){dimension = 2}
    if(!runTime){runTime = 1}
    var animate =  document.querySelector('#animationID').checked;
    // console.log("colonysize",colonySize);
    // console.log(foodNumber);
    // console.log(limit);
    // console.log(maxCycle);
    // console.log(dimension);
    // console.log(runTime);
    var Bee = new ABC(colonySize,foodNumber,limit, maxCycle,dimension,runTime);
    Bee.run(animate);

}

// var trace1 = {
//     x: [1, 2, 3, 4],
//     y: [10, 15, 13, 17],
//     type: 'scatter'
//   };
  
//   var data = [trace1];
  
//   var layout = {
//     autosize: false,
//     width: 500,
//     height: 500
// };
//   Plotly.newPlot('myDiv2', data,layout);

//   var trace1 = {
//     x: [1, 2, 3, 4],
//     y: [11, 12, 13, 14],
//     type: 'scatter'
//   };
  
//   var data = [trace1];
  

//   Plotly.animate('myDiv2', {
//     data,
//     traces: [0],
//     layout:layout
//   }, {
//     transition: {
//       duration: 500,
//       easing: 'cubic-in-out'
//     },
//     frame: {
//       duration: 500
//     }
//   },layout);