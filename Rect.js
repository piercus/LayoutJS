(sand.define("LayoutJS/Rect",["LayoutJS/Base","core/extend", "Array/where"],function(r){
  var d = {};
  /*
  *  options is :{
  *      vertices : [{radius: 2, id:0 , post_id: },{radius: 1, id: 1},{radius: 0.5}],// edges can also be an object it can contains a parents
  *      edges: [{from: 0, to: 1},{from: 1, to: 2}],
  *      directed : false,//(default: true)
  *      range : [[minX,maxX],[minY,maxY]],
  *      rounded : true//(default: false)
  *     }
  *
  */

  return r.Base.extend({ 
      "+options" : {
        "$size" : { 
          type : "array", 
          items : { type : "number", minimum : 0, exclusiveMinimum : true },
          maxItems : 2, 
          minItems : 2,
          default : [1,1],
          "title" : "Size [X, Y]",
          "description" : "size of a vertice"
        },
        "$margin" : { 
          type : "array", 
          items : { type : "number", minimum : 0},
          maxItems : 2, 
          minItems : 2,
          default : [0,0],
          "title" : "Margin [X, Y]",
          "description" : "Margin between vertices"
        }
        
      },  
      /*
      *  Structural
      *
      */
      "+init" : function(){
        this._setVertices();
      },
      "+_setParents": function(){
        this._setTreeStructure();
      },
      
      tree : true,
      
      _setTreeStructure: function(){
          var v;
          for (var i = this.vertices.length; i--; ) {
              this.vertices[i].mainParent = (this.vertices[i].parents && this.vertices[i].parents[0]);
          }
          for (var i = this.vertices.length; i--; ) {
              v = this.vertices[i];
              this.vertices[i].mainChildren = (this.vertices[i].children || []).where(function(c){
                return (c.mainParent && c.mainParent.id === v.id);
              });
          }
      },
      compute: function(){
           var root;
           this._lvls = [];
           // first set Level in the tree
           for (var i = this.vertices.length; i--; ) (this._setX(this.vertices[i]) == 0) && (root = this.vertices[i]);
           
           this._placeVertice(root);
           this._setPosition(root,this.root);
           
      },
      _setPosition : function(v,start,signX,sensY,maxY){
        signX = signX || 1;
        sensY = sensY || 1;   
        
        v.position = [start[0]+signX*v._x,start[1]+ (sensY > 0 ? v._dy :  maxY-v._dy)];
        for (var i = 0, n = v.mainChildren.length; i < n; i++) this._setPosition(v.mainChildren[i],[start[0],v.position[1]-v.insideRect[1]/2],signX ,sensY,v.rect[1]);
      },
      _getSize: function(v){
        return v.size || this.size;
      },
      _placeVertice: function(v){
        var c = v.mainChildren, cs = [];
        var sV = this._getSize(v);
        
        d.d&&console.log(c,v);
        if (c.length) {
          var size = [0,0]
          for (var i = 0, n = c.length; i < n; i++) {
              this._placeVertice(c[i]);  
              c[i]._dy = size[1] + (size[1] > 0 ? this.margin[1] : 0) + c[i]._dy;
              size[1] = (size[1] > 0 ? this.margin[1] : 0) + size[1]+c[i].rect[1];
              size[0] = Math.max(size[0],c[i].rect[0]);
          }
          v.rect = [
            size[0]+this.margin[0]+sV[0],
            Math.max(size[1],sV[1])
          ];
          v.insideRect = size;
          v._dy = v.rect[1]/2;
          
        } else {
          v._dy = sV[1]/2;          
          v.rect = [sV[0]+this.margin[0],sV[1]];//+this.margin[1]];
        }
      },
      _setX: function(v){
        var size = this._getSize(v);
        //console.log(size, this.margin);
        return (v._x || 
                (v._x = (v.mainParent ? (this._setX(v.mainParent)+this._getSize(v.mainParent)[0]/2+size[0]/2+this.margin[0]) : 0)));
      }
      /*defaultPosConfig:{
          radiusTable :  [1,1,1,1],
          margin: [0],
          butterfly: true,
          root: [0,0] ,
          size : [1,1]
      },*/
      
  });
}));
