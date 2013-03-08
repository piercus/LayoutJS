sand.define("LayoutJS/LinLog", [
    "LayoutJS/Base",
    "LayoutJS/BarnesHut",
    "core/extend", 
    "Array/min",  
    "Array/max",     
    "Array/map"], function(r){
    
    var extend = r.extend;
    
    this.exports = r.Base.extend({
      "+init": function(){
        this._setVertices();
        this.setNumberTo();
        this.positionned = false;
        this.useBarnesHut = true;
      },
      tree : false,
      "+options" : {
        "$dMax" : { 
          "title" : "Repulsive distance",
          "description" : "distance where repusive force == 0",
          "type" : "number", 
          "default" : 2000, 
          "minimum" : 1
        }, 
        "$dRes" : { 
          "type" : "number", 
          "title" : "Attractive distance",
          "description" : "distance where attractive force == 0",         
          "default" : 100, 
          "minimum" : 1
        }, // distance where attractive force == 0
        "$nIter" : { 
          "type" : "number", 
          "title" : "Iterations",
          "description" : "LinLog is iterative, how many iteration do you want ?",         
          "default" : 400, 
          "minimum" : 2
        },
      },
      _setParents: function(){
        this.vertices.each(function(v){
          v.edgesTo = [];
          v.edgesFrom = [];
        });
        
        this.edges.each(function(e){
          this.indexVertices[e.to].edgesTo.push(e);
          this.indexVertices[e.from].edgesFrom.push(e);
        }.bind(this));
      },
     
      setNumberTo: function(){
        for(var i = 0; i < this.vertices.length; i++){
          this.vertices[i].numberTo = this.vertices[i].edgesTo.length;
        }
      },
      repulse : function(ax,ay,bx,by){
        return Math.log(this.norm(ax,ay,bx,by));
      },
      attract: function(ax,ay,bx,by){
        return Math.abs(this.norm(ax,ay,bx,by) - this.dRes*this.dRes);
      },
      norm: function(x1,y1,x2,y2){
        return (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1);
      },
      distance: function(x1,y1,x2,y2){
        return Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
      },
      dynamic: function(options){
        options && options.cb && (this._callback = options.cb);
        options && options.interval && (this._interval = options.interval);
        options && options.iter &&  (this._iter = options.iter);

        var that = this;
        this.dynamicTimer = setInterval(function() { 
          that.iter(that._iter|| 10,that._callback);
        }, this._interval || 50);
      },   
      iter: function(n,cb){
        for(var i = 0; i< n; i++){
          if(i%100 === 0) console.log("start iteration : "+i);
         
          this.runForces(this.vertices,this.edges);
        }
       
        cb(null, {
          vertices : this.vertices, 
          edges : this.edges,
          rect : this.rect
        });
      },
      clearInterval: function(){
        clearInterval(this.dynamicTimer);
      },
      repulse2 : function(ax,ay,bx,by,aTo,bTo){
        return aTo*bTo*this.repulse(ax,ay,bx,by);
      },
     
      start: function(){
        if(this.isRunning){
          this.stop();
        }
        this.isRunning = true;
        this.dynamic(); 
      },

      stop: function(){
        this.dynamicTimer && clearInterval(this.dynamicTimer);
        this.isRunning = false;
      },

      factorRepulsive: function(m1,m2,dist){
        return 200*m1*m2*(1/(dist*dist)-1/(this.dMax*this.dMax));//m1*m2/(dist*dist)
      },
      factorAttractive: function(x1,y1,x2,y2,dist){
        return  -1 * Math.log(1 + dist) / dist;
      },
      getRectWithMargins : function(){
        var margin = 300;
        var xs = this.vertices.map(function(e){return e.position[0];});
        var ys = this.vertices.map(function(e){return e.position[1];});
        return [[
            xs.min()-margin,
            ys.min()-margin
          ],[
            xs.max()-xs.min()+2*margin,
            ys.max()-ys.min()+2*margin
        ]];
      },
      runForces : function(vertices,edges,cb){
        var x1,y1,x2,y2,factor,dist,e,vf,vt;
        if(this.useBarnesHut){
          this.bnTree && this.bnTree.removeBoxes();
          this.rect = this.getRectWithMargins();
          this.bnTree = new r.BarnesHut({
              bods : this.vertices,
              startBox : this.rect,
              getRepulsiveFactor: this.factorRepulsive.bind(this)// [x y], [w h]
          });
          //this.bnTree.computeForces();
        } else {
          this.bnTree = null;
        }
       
        for(var i = vertices.length; i--;){
          this.calculateRepulsive(vertices[i],i);
        }
       
        //attractive
        for(var i = edges.length; i--;){
          this.calculateAttractive(edges[i],this.indexVertices);
        }
       
        //apply forces
        for(var i = vertices.length; i--;){
          this.applyForces(vertices[i]);
        }
        
        if(cb){
          cb(vertices,edges);
        } 
      },
      calculateRepulsive: function(v,i){
        if(this.bnTree){
          return this.bnTree.doBNtree(i);
        }
       
        x1 = v.position[0];
        y1 = v.position[1];
        m1 = v.mass;
        for(var j = i; j--;){
          x2 = vertices[j].position[0];
          y2 = vertices[j].position[1];
          m2 = vertices[j].mass;
          dist = this.distance(x1,y1,x2,y2);
          if(dist < this.dMax){
            factor = this.factorRepulsive(m1,m2,dist);
            v.forceX = (x1-x2)*factor+vertices[i].forceX;
            v.forceY = (y1-y2)*factor+vertices[i].forceY;
            vertices[j].forceX = (x2-x1)*factor+vertices[j].forceX;
            vertices[j].forceY = (y2-y1)*factor+vertices[j].forceY;
          }
        }
        return {
          forceX : v.forceX,
          forceY : v.forceY,
          from : 0,
          to : i
        };
      },
      calculateAttractive: function(edge,vertices){
        vf = vertices[edge.from];
        vt = vertices[edge.to];
        x1 = vf.position[0];
        y1 = vf.position[1];
        x2 = vt.position[0];
        y2 = vt.position[1];
       
        dist = this.distance(x1,y1,x2,y2);
        factor = this.factorAttractive(x1,y1,x2,y2,dist);
        if(isNaN(vf.forceX) || isNaN(vf.forceY) || isNaN(vt.forceX) || isNaN(vt.forceY)){
          throw("error is NaN");
        }
        vf.forceX = (x1-x2)*factor+vf.forceX;
        vf.forceY = (y1-y2)*factor+vf.forceY;
        vt.forceX = (x2-x1)*factor+vt.forceX;
        vt.forceY = (y2-y1)*factor+vt.forceY;
        if(isNaN(vf.forceX) || isNaN(vf.forceY) || isNaN(vt.forceX) || isNaN(vt.forceY)){
          throw("error is NaN");
        }
        // return is for debug
        return {forceX : (x1-x2)*factor, forceY : (y1-y2)*factor};
      },
      applyForces: function(v){
        factor = 1;
        v.dx = factor*v.forceX;
        v.dy = factor*v.forceY;
        v.position[0] = v.position[0] + v.dx;
        v.position[1] = v.position[1] + v.dy;
        if(isNaN(v.position[0]) || isNaN(v.position[1])){
          throw("error is NaN");
        }
        v.forceX = 0;
        v.forceY = 0;
      },
     
      compute : function(cb,options){
        this.initForces();
        this.initRandomPositions(200,500);
        if(options.dynamic){
          this.dynamic({cb:cb, interval : options.interval, iter : options.iter});
        } else {         
          this.iter(this.nIter,cb);
        }
      },
     
      step : function(cb,times){
        for(var i = 0; i<times; i++){
          this.runForces(this.vertices,this.edges,cb);
        }
      },
     
      initForces : function(){
        for (var i =0; i < this.vertices.length; i++){
          this.vertices[i].forceX = 0;
          this.vertices[i].forceY = 0;
        }
      },
     
      initRandomPositions: function(min,max){
        for (var i =0; i < this.vertices.length; i++){
          this.vertices[i].position = [
            Math.random()*(max-min)+min,
            Math.random()*(max-min)+min
          ];
          this.vertices[i].mass = 1;
        }
       
      },
     // debug function
      getDetails: function(v){
        var j = this.vertices.indexOf(v);
        this.bnTree && this.bnTree.buildNodes();
        var r = this.calculateRepulsive(v,j);

        //attractive from
        var edges = v.edgesFrom;
        var a = {forceX : 0, forceY : 0};
        for(var i = edges.length; i--;){
          var b = this.calculateAttractive(edges[i],this.vertices);
          a.forceX = a.forceX + b.forceX;
          a.forceY = a.forceY + b.forceY;    
        } 
       
        //attractive to
        var edges = v.edgesTo;
        for(var i = edges.length; i--;){
          var b = this.calculateAttractive(edges[i],this.vertices);
          a.forceX = a.forceX - b.forceX;
          a.forceY = a.forceY - b.forceY;    
        }
        return {
          repulsive : r,
          attractive : a   
        }    
      },
      // argument is { vertices : [], edges : []}
      updateGraph : function(g) {
        var nIds = g.vertices.collect("id");
        var oIds = this.vertices.collect("id");
        var d = oIds.diff(nIds);
       
        g.vertices.each(function(v){
            if(d.add.indexOf(v.id) !== -1){
              v.position[0] = Math.random()*10-5;
              v.position[1] = Math.random()*10-5;
              v.mass = 1;
              this.vertices.push(v);
            } 
        }.bind(this));
       
        this.vertices.each(function(v){
             if(d.rem.indexOf(v.id) !== -1){
               this.vertices.remove(v);
             }
         }.bind(this));
        
        this.edges = g.edges;
        this._setVertices();
        this.initForces();
      }
   });

});
