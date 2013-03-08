(sand.define("uMap-layouts-Random", function(app){
  
  /*
  *  options is :{
  *      vertices : [{radius: 2, id:0 , post_id: },{radius: 1, id: 1},{radius: 0.5}],// edges can also be an object it can contains a parents
  *      edges: [{from: 0, to: 1},{from: 1, to: 2}],
  *      directed : false,//(default: true)
  *      range : [[minX,maxX],[minY,maxY],[minZ,maxZ]],
  *      rounded : true//(default: false)
  *     }
  *
  */
  app.layouts.Random = function(options){
          app.layouts.BaseLayout.constructor.call(this,options);
  };
  app.layouts.Random.prototype = uMap.extend(uMap.layouts.BaseLayout.prototype,{
    _compute: function(){
      return this.vertices.collect(function(v){ 
          v.position = this._getRandomPosition(); 
      }.bind(this));
    },
    posConfig:{
          range: [[0,1],[0,1],[1,2]]
    },
    _getRandomPosition: function(){
        var x = Math.random()*(this.range[0][1]-this.range[0][0])+this.range[0][0];
        var y = Math.random()*(this.range[1][1]-this.range[1][0])+this.range[1][0];
        var z = Math.random()*(this.range[2][1]-this.range[2][0])+this.range[2][0];
        
        return this.rounded ? 
           [x.round(),y.round(),z.round()] :
           [x,y,z];
    }
  });
}, {requires : ["uMap-Layouts-Base"]});
