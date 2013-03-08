(sand.define("LayoutJS/Base", ["Seed/Seed","Array/each","core/clone"], function(r){
  
  /*
  *  options is :{
  *      vertices : [{id: 0},{id: 1},{id: 3}],// edges can also be an object it can contains a parents
  *      edges: [{from: 0, to: 1},{from: 1, to: 2}],
  *      directed : false,//(default: true)
  *      rounded : true//(default: false)
  *     }
  *
  */
  return r.Seed.extend({
      "+init" : function(options){
          this.vertices = this.formatVertices(options.vertices) || console.log("error", "no vertices when calling layout");

          this.edges = options.edges || console.log("error", "no edges when calling layout");
          this.directed = options.directed || true;
          this.rounded = options.rounded || false;
      },
      
      options : {
         "rounded" : false,
         root : [0,0] 
      },
      
      /*
      *  return a list of edges with x,y position
      *  [{radius: 2, id:0, position: [0,1] },{radius: 1, id: 1, position: [1,1]},{radius: 0.5, {radius: 1, id: 1, position: [1,2]}}],
      *
      */ 
      
      formatVertices : function(vs){
        return vs.map(this.formatVertice.bind(this));
      },
      formatVertice : function(v){
        if(typeof(v) === "object"){
          return v;
        } else if(typeof(v) === "number"){
          return {
            id : v,
            radius : 1,
            position : [0,0],
            size : this.size
          }
        }
      },   
      compute: function(){
          sand.log("error", "override this");
      },
      addVertices: function(vs,es){
        this.vertices = this.vertices.concat(vs);
        this.edges = this.edges.concat(es);
      },
      
      _setVertices: function(){
        this.indexVertices = {};
        this.vertices.each(function(v){
            this.indexVertices[v.id] = v;
        }.bind(this));
        this._setParents();
      },
      
      _setParents: function(){
          this.edges.each(function(e){
              (this.indexVertices[e.from].parents || (this.indexVertices[e.from].parents = [])).push(this.indexVertices[e.to]);
              (this.indexVertices[e.to].children || (this.indexVertices[e.to].children = [])).push(this.indexVertices[e.from]);  
          }.bind(this));         
      },
      
      /*getDatas: function(discussionId){
          var layoutId = 5;
          var self = this;
          return {
              layouts:[{
					id: layoutId,
					averagePos: [2690,3860,4],
					keys: {discussion_id: 1},
					miniMapUrl: "http://localhost:3000/images/tmpImgs/0d7aa3cea0e9cc10200b55e5993501544118dbca_19.gif",
					rect: [[0,0,0],[4761,6177,4]],
			  }],
              positions: this.vertices.collect(function(v){
                  console.log(v.position,v);
                  var p = v.position.multiply(50).add([2000,2000]).round();
                  console.log(v.id,p)
                  return {
  						coords: p.concat([self.getZ(v)]),
  						id: v.id,
  						keys: {
  						  	layout_id : layoutId,
  						    post_id: v.id
  						}
  					};
              })
          }
      }, */
      getZ: function(v){
          return 1;
      }
      
  });
}));
