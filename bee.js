
var NP = 20;
var FoodNumber  = NP / 2  ;
var limit = 100;
var maxCycle = 10;


// Generating random data..
a=[]; b=[]; c=[];

var x_marker=[];
var y_marker=[];
var z_marker=[];

var layout = {
    autosize: false,
    width: 1000,
    height: 900
  };

for(i=-50;i<100;i++){

for (j=-50;j<100;j++){

    z = i*i + j*j;

    a.push(i);
    b.push(j);
    c.push(z);

}

}


// Plotting the mesh
var data=[
    {
        x: [1],
        y: [1],
        z: [1],
        mode: 'markers',
        type: 'scatter3d',
        marker: {
          color: 'rgb(23, 190, 207)',
          size: 10
        }
    },
    {
      opacity:0.8,
      color:'rgb(300,000,200)',
      type: 'mesh3d',
      x: a,
      y: b,
      z: c,
    }
];
Plotly.newPlot('myDiv', data,layout);



function PlotlyAnimate(foods,objfun){
    /*
     foods nxD Nj type array
     objfun is the callback function
     */


    var x_marker = [];
    var y_marker = [];
    var z_marker = [];

    z_marker = objfun(foods)
               .tolist();
    foods = foods.tolist();

    for (var i = 0 ; i<foods.length;i++){
        x_marker.push(foods[i][0])
        y_marker.push(foods[i][1])

    }

    var data = [{
        x: x_marker,
        y: y_marker,
        z: z_marker,
        mode: 'markers',
        type: 'scatter3d',
        marker: {
          color: 'rgb(23, 190, 207)',
          size: 10
        }
    },];


    Plotly.animate('myDiv', {
        data,
        traces: [0],
        layout: {}
      }, {
        transition: {
          duration: 50,
          easing: 'cubic-in-out'
        },
        frame: {
          duration: 50
        }
      },layout);

}



function repmat(arr,FoodNumber){
    // Replicate and tile an array.
    //arr is the array to be replicated.
    // replicate is the array defines the number of replication.

    var range = [];
    for (var repmat=0; repmat<FoodNumber ; repmat++){
        range.push(arr);
    }

    return nj.stack(range);



}


function calculateFitness(fObjV){

    var fFitness = [];
    fObjV = fObjV.tolist();
    // Find indeces in fObjV greater than 0

    fObjV.forEach(element => {
        if (element >= 0){
            fFitness.push(1/(element+1));
        }
        else{
            fFitness.push(1 + Math.abs(element));
        }



    });
    return nj.array(fFitness);
    


}
objfun = function(foods){
    /* 
       Foods is the nj array 
    */
    var S = foods.multiply(foods);
    S = S.T; //Transpose
    // a= [[1,2],[3,4]]  => shape [2,2] 
    var tmp  = [];
    for (var i=0; i<S.shape[1]; i++){ //S.shape[1] => Number of elements for example:10
        var sum = 0;
        for (var j=0; j<S.shape[0];j++){ // S.shape[0] => Dimension for example: 2
            sum += S.get(j,i);
        }
        tmp.push(sum);
    }


    return nj.array(tmp);
}




var D = 2;
var ub = nj.ones([1,D]).multiply(100);
var lb = nj.ones([1,D]).multiply(-100);
var runtime = 1;
var GlobalMins = nj.zeros([1,runtime]).flatten();

for (var r=0; r<runtime; r++){
    
    rangeinterval = (ub.subtract(lb)).flatten();

    // mimic repmat element
    var Range = repmat(rangeinterval,FoodNumber);
    var Lower = repmat(lb.flatten(),FoodNumber);
    var Foods = nj.random([FoodNumber,D]).multiply(Range).add(Lower) ;
    var ObjVal =objfun(Foods);
    var Fitness = calculateFitness(ObjVal);


    var trial = nj.zeros([1,FoodNumber]).reshape(-1);
   
    
    var minObjVal = Math.min(...(ObjVal.tolist()));
    var BestInd = ObjVal.tolist().indexOf(minObjVal);
    var GlobalMin = minObjVal;
    var GlobalParams = [];
    for (var i=0; i<D ; i++){
        GlobalParams.push(Foods.get(BestInd,i));
    }
    GlobalParams = nj.array(GlobalParams);
    iter = 0;
    // console.log(ObjVal);
    // console.log(minObjVal);
    // console.log(BestInd);
    // console.log(GlobalParams);

    while (iter <= maxCycle){

        // Employed Bee Phased
        for (var i =0; i<FoodNumber-1;i++){

            var Param2Change = Math.floor(Math.random() * D);
            var neighbour =   Math.floor(Math.random() * FoodNumber); // Between 0 and 9   

            while (neighbour === i){
                neighbour =   Math.floor(Math.random() * FoodNumber);
            }

            var sol = [];
            for (var j=0; j<D ; j++){
                sol.push(Foods.get(i,j));
            }
            // sol = nj.array(sol);
            sol[Param2Change] = Foods.get(i,Param2Change) + (Foods.get(i,Param2Change) - Foods.get(neighbour,Param2Change))*(Math.random()-0.5)*2;

            // if generated parameter value is out of boundaries, it is shifted onto the boundaries
            sol.forEach((element,ind)=>{

                if (element < lb.get(0,ind)){
                    sol[ind] = lb.get(0,ind);
                }
                else if (element > ub.get(0,ind)){
                    sol[ind] = ub.get(0,ind);
                }
            
            })
            
            // evaluate new solution
            var ObjValSol =objfun(nj.array(sol).reshape(1,D));
            var FitnessSol = calculateFitness(ObjValSol);

            // Greedy Selection
            if (FitnessSol.get(0) > Fitness.get(i)){

                for (var k=0; k<D; k++) {
                    Foods.set(i,k,sol[k]);
                }
                Fitness.set(i,FitnessSol.get(0));
                ObjVal.set(i,ObjValSol.get(0));
                trial.set(i,0);
            }

            else{
                trial.set(i, trial.get(i) + 1) ;
            }
        } // For loop employed bee

        var prob = (Fitness.divide(Math.max(...Fitness.tolist()))).multiply(0.9).add(0.1);
        
        // Onlooker Bee Phase

        var i = 0;
        var t = 0;

        while(t < FoodNumber){
            
            if (Math.random() < prob.get(0)){

                t +=1;
                var Param2Change = Math.floor(Math.random() * D);
                var neighbour =   Math.floor(Math.random() * FoodNumber); // Between 0 and 9   
                while (neighbour === i){
                    neighbour =   Math.floor(Math.random() * FoodNumber);
                }

                
                var sol = [];
                for (var j=0; j<D ; j++){
                    sol.push(Foods.get(i,j));
                }
                // sol = nj.array(sol);
                sol[Param2Change] = Foods.get(i,Param2Change) + (Foods.get(i,Param2Change) - Foods.get(neighbour,Param2Change))*(Math.random()-0.5)*2;

                // if generated parameter value is out of boundaries, it is shifted onto the boundaries
                sol.forEach((element,ind)=>{

                    if (element < lb.get(0,ind)){
                        sol[ind] = lb.get(0,ind);
                    }
                    else if (element > ub.get(0,ind)){
                        sol[ind] = ub.get(0,ind);
                    }
                
                })

                 // evaluate new solution
                ObjValSol =objfun(nj.array(sol).reshape(1,D));
                FitnessSol = calculateFitness(ObjValSol);

                // Greedy Selection
                if (FitnessSol.get(0) > Fitness.get(i)){

                    for (var k=0; k<D; k++) {
                        Foods.set(i,k,sol[k]);
                    }
                    Fitness.set(i,FitnessSol.get(0));
                    ObjVal.set(i,ObjValSol.get(0));
                    trial.set(i,0);
                }

                else{
                    trial.set(i, trial.get(i) + 1) ;
                }

            } // end of if (Math.random() < prob.get(0))

            i += 1;
            if (i === FoodNumber) {
                i = 1;
            }

        }// end of while (t < FoodNumber)

        // Best Food source is memorized
        var minObjVal = Math.min(...(ObjVal.tolist()));
        var BestInd = ObjVal.tolist().indexOf(minObjVal);
        if (ObjVal.tolist()[BestInd] < GlobalMin){
            GlobalMin = minObjVal;
            GlobalParams = [];
            for (var i=0; i<D ; i++){
                GlobalParams.push(Foods.get(BestInd,i));
            }
            GlobalParams = nj.array(GlobalParams);

        }
        
       

        // SCOUT BEE PHASE

        maxTrial = Math.max(...trial.tolist());
        maxTrialInd = trial.tolist().indexOf(maxTrial);

        if (trial.get(maxTrialInd) > limit){
            trial.set(maxTrialInd,0);
            sol =(ub.subtract(lb)).flatten().multiply(nj.random([1,D]).flatten()).add(lb.flatten()).tolist();
            ObjValSol =objfun(nj.array(sol).reshape(1,D));
            FitnessSol = calculateFitness(ObjValSol);
            for (var k=0; k<D; k++) {
                Foods.set(maxTrialInd,k,sol[k]);
            }
            Fitness.set(maxTrialInd,FitnessSol.get(0));
            ObjVal.set(maxTrialInd,ObjValSol.get(0));

            // fitnessSol => 0.00047995880408433395

           

        }




        console.log('Iter',iter,GlobalMin);
        iter +=1;
        // Plot Animation
        PlotlyAnimate(Foods,objfun);

    }//end while (iter <= maxCycle) (End of ABC)

    GlobalMins.set(r,GlobalMin);
}

