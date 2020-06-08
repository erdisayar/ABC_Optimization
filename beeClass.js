
import Plot from './PlotlyClass.js';

var plot = new Plot()
export default class ABC{
    constructor(NP,FoodNumber,limit, maxCycle,D,runtime){
        this.NP = NP;
        this.FoodNumber = FoodNumber;
        this.limit = limit;
        this.maxCycle = maxCycle;
        // this.objfun = objfun;
        this.D=D;
        this.runtime= runtime;
        this.GlobalMins = nj.zeros([1,this.runtime]).flatten();
        // plot.plotInitialize();
        console.log(this.NP, this.FoodNumber, this.limit, this.maxCycle,this.D,this.runtime);

        this.iterationnumber = [];
        this.GlobalMinAllIteration = [];
        this.FoodsAllIteration = []
        this.ObjAllIteration = []
    }


    run(animate_flag=false){

        var ub = nj.ones([1,this.D]).multiply(100);
        var lb = nj.ones([1,this.D]).multiply(-100);
        var D = this.D;

        for (var r=0; r<this.runtime; r++){
    
            var rangeinterval = (ub.subtract(lb)).flatten();
            var FoodNumber = this.FoodNumber;
        
            // mimic repmat element
            var Range = this.repmat(rangeinterval,FoodNumber);
            var Lower = this.repmat(lb.flatten(),FoodNumber);
            var Foods = nj.random([FoodNumber,D]).multiply(Range).add(Lower) ;
            var ObjVal =this.objfun(Foods);
            var Fitness = this.calculateFitness(ObjVal);
        
        
            var trial = nj.zeros([1,FoodNumber]).reshape(-1);
           
            
            var minObjVal = Math.min(...(ObjVal.tolist()));
            var BestInd = ObjVal.tolist().indexOf(minObjVal);
            var GlobalMin = minObjVal;
            var GlobalParams = [];
            for (var i=0; i<D ; i++){
                GlobalParams.push(Foods.get(BestInd,i));
            }
            GlobalParams = nj.array(GlobalParams);
            var iter = 0;
            // console.log(ObjVal);
            // console.log(minObjVal);
            // console.log(BestInd);
            // console.log(GlobalParams);
        
            while (iter <= this.maxCycle){
        
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
                    var ObjValSol =this.objfun(nj.array(sol).reshape(1,D));
                    var FitnessSol = this.calculateFitness(ObjValSol);
        
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
                        ObjValSol =this.objfun(nj.array(sol).reshape(1,D));
                        FitnessSol = this.calculateFitness(ObjValSol);
        
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
        
                var maxTrial = Math.max(...trial.tolist());
                var maxTrialInd = trial.tolist().indexOf(maxTrial);
        
                if (trial.get(maxTrialInd) > this.limit){
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
                this.iterationnumber.push(iter);
                this.GlobalMinAllIteration.push(GlobalMin);
                this.FoodsAllIteration.push(Foods)
                this.ObjAllIteration.push(this.objfun(Foods).tolist());
                // Plot Animation
                if (animate_flag){
                    // plot.PlotlyAnimate(Foods,this.objfun);
                    // plot.animateLine(this.iterationnumber,this.GlobalMinAllIteration,'mydiv');
                    plot.animateMesh(Foods,this.objfun,'mvdiv10');
                }
            }//end while (iter <= maxCycle) (End of ABC)
            
            plot.plotLine([...Array(this.maxCycle).keys()],this.GlobalMinAllIteration,'PlotLine'+ r)
            plot.plotSurface(this.ObjAllIteration,'PlotSurface'+r)
            plot.plotTable(Foods,this.objfun,'PlotTable'+r);
            this.GlobalMins.set(r,GlobalMin);
        }
        
    }


   

    
    calculateFitness(fObjV){

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

    repmat(arr,FoodNumber){
        // Replicate and tile an array.
        //arr is the array to be replicated.
        // replicate is the array defines the number of replication.
    
        var range = [];
        for (var repmat=0; repmat<FoodNumber ; repmat++){
            range.push(arr);
        }
    
        return nj.stack(range);
        
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

    


    }


// var NP = 20;
// var FoodNumber  = NP / 2  ;
// var limit = 100;
// var maxCycle = 10;
// var D = 2;
// var runtime = 1;
// var objfun = "Objective Function";


// var t = new ABC(NP,FoodNumber,limit, maxCycle,D,runtime);
// t.run(true);