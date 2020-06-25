
import ABC from './beeClass.js';

var ABCRunner_Button = document.querySelector('.ionic-menu-button');
ABCRunner_Button.addEventListener('click',ABCRunner);

async function alertVisualizationChecker() {
    const alert = await alertController.create({
      header: 'Dimension > 2 ?',
      message: 'Visualization of objective function is not possible for dimension > 2',
      buttons: ['Agree']
    });

    await alert.present();
  }




function openMenu(){
    menuController.open()
    console.log("Menu is open");

}

function ABCRunner() {
    console.log("Code.js script");
    document.querySelector(".PlotlyContainer").innerHTML = " ";
    var colonySize = Number(document.querySelector('#colonySizeID').value);
    var foodNumber = Number(document.querySelector('#foodNumberID').value);
    var limit = Number(document.querySelector('#limitID').value);
    var maxCycle = Number(document.querySelector('#maxCycleID').value);
    var dimension = Number(document.querySelector('#dimensionID').value);
    if (dimension > 2) {
        alertVisualizationChecker();
    }
    var runTime = Number(document.querySelector('#runTimeID').value);
    var objfunction = document.querySelector('#objective_function').value;
    console.log(objfunction);
    if(!colonySize){colonySize = 20}
    if(!foodNumber){foodNumber = colonySize/2}
    if(!limit){limit = 100}
    if(!maxCycle){maxCycle = 10}
    if(!dimension){dimension = 2}
    if(!runTime){runTime = 1}
    // This for animation checkbox , for now it is disabled.
    // var animate =  document.querySelector('#animationID').checked; 
    var animate = false
    // console.log("colonysize",colonySize);
    // console.log(foodNumber);
    // console.log(limit);
    // console.log(maxCycle);
    // console.log(dimension);
    // console.log(runTime);
    var Bee = new ABC(colonySize,foodNumber,limit, maxCycle,dimension,runTime,objfunction);
    Bee.run(animate);

    var source = document.querySelector(".ion-padding");
    var ptag = document.createElement("p").innerText = "Papers https://abc.erciyes.edu.tr/publ.htm";
    source.append(ptag);


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



function printCombination(arr,n,r){

    var data = "0".repeat(r);

    combinationUtil(arr,data,0,n-1,0,r);
}

function combinationUtil(arr,data,start,end,index,r){

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

// var arr = [1, 2, 3, 4, 5]; 
// var r = 2; 
// var n = arr.length 
// printCombination(arr, n, r); 