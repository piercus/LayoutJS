sand.file("uMap-helpers-annealing",function(app){
app.helpers.annealing = function(options){
  var i,dir,rand,t = options.t || 1000,x,y,ox,oy,
      cool = options.cool || 0.99, 
      step = 1,
      len = options.vertices.length*2,
      domain = options.domain || [0,100],
      vec = options.vec || app.helpers.getRandomVector(domain, len),
      costFn = options.costFn,
      cost = costFn(vec),
      cb = options.callback || function(){},
      limit = options.limit || 0.1;
      
//  setInterval(function() {  
//         that.run(); 
//  }, options.interval || 10);
  var count = {};
  for(var i = 0; i<niter; i++){
  // iteration
    if(i%100 === 0){
      console.log(100*i/niter+"%");
    }
    for(var i = 0; i < vertices.length; i = i+2){
      x = vec[i];
      y = vec[i+1];
      ox = x+1;
      oy = y+1;
      var diff = getDiffPot(x,y,ox,oy,i/2);
      if(diff < 0){
        
      }
    }
  }
  while(t>limit){
    rand = Math.random();
    i = Math.floor(rand*len);
    count[i] || (count[i] = [0,0]);
    var rDir = Math.random()
    dir = (rDir > 0.5) ? step : -1*step;
    count[i][(rDir > 0.5) ? 0 : 1]++;
    vecb = vec.clone();
    vecb[i] = vecb[i]+dir;
    (vecb[i] > domain[1]) &&  (vecb[i] > domain[1]);
    (vecb[i] < domain[0]) && (vecb[i] = domain[0])
    
    c2 = costFn(vecb);
    //p = Math.exp((cost-c2)/t);
    //var r = Math.random();
    if(c2 < cost){
      vec = vecb;
      cost = c2;
    }
    //console.log("cost",cost," t : ",t," random : ",r," base : ",p)
    t = t*cool
  }
  console.log(count);
  cb(vec);
  
}
app.helpers.getRandomVector = function(domain, len){
  a = [];
  for(var i = 0; i < len; i++){
    a.push(domain[0]+Math.floor(Math.random()*(domain[1]-domain[0])));
  }
  return a;

};
},{requires : "helpers"});
