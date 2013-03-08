(sand.define("layoutJS/Tree", ["layoutJS/Base","core/extend"],function(r){
  
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
  var Tree = function(options){
      r.Base.call(this,options);
  };
  Tree.prototype = r.extend({},r.Base.prototype,{
      /*
      *  Structural
      *
      */
      _setParents: function(){
          r.Base.prototype._setParents.call(this);
          this._setTreeStructure();
      },
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
      /*
      *  Main Computation
      *
      */
      compute: function(){
           var root;
           this._lvls = [];
           // first set Level in the tree
           for (var i = this.vertices.length; i--; ) (this._setLvl(this.vertices[i]) == 0) && (root = this.vertices[i]);
           
           var tree = this._placeTree(root);
           this._setPosition(tree);
           
      },
      
      /*
      *
      *   Positionning
      *
      */
      
      // default setPosition function : 
      _setPosition: function(tree){
           var root = tree[0][0], maxP = 0, lvl;
           root.position = this.posConfig.root || [0,0];
           root.radius = this._getRadius(root);
           
           if(this.posConfig.butterfly){
               for (var j = 0, n = tree[1].length; j <n; j++){
                    maxP = tree[1].last()._d+this._getDistance(1);
                    for (var i = 2, n = tree.length; i <n; i++){
                          if(maxP < (tree[i].last()._d-tree[i][0]._d+this._getDistance(i))){
                              maxP = tree[i].last()._d-tree[i][0]._d+this._getDistance(i);
                          }
                    }
                                     
               }
               
               this._setButterfly(root.position,maxP,lvl);
           } else {
             for(var i = 0; i < this.vertices.length; i++){
               if(this.vertices[i]._lvl != 0){
                   this.vertices[i].position = [this.vertices[i]._lvl*10,this.vertices[i]._d];                
               }
             }
           }
      },
      
      _setButterfly: function(position,maxD,lvl){

            var hArc = this._getHArc(2);

            var vArc = maxD/4;
            var excentricity = Math.sqrt(Math.abs(vArc*vArc-hArc*hArc))/hArc,
                root = position;
            for(var i = 0; i < this.vertices.length; i++){
              if(this.vertices[i]._lvl != 0){
                  this.vertices[i].position = this._getElipsePosition(this.vertices[i],root,excentricity,maxD);                
              }
            }
        },
        
      _getHArc: function(lvl){
          var hArc = this._getDistance(0)+this._getDistance(lvl);
          for(var i = 1; i < lvl; i++) (hArc = this._getDistance(i)*2+hArc);
          return hArc
      },
      _getVArc: function(hArc,e){
          var a= e*hArc;
          return Math.sqrt(a*a+hArc*hArc);
      },
      _getElipsePosition: function(v,root,e,maxD){
        var a = this._getHArc(v._lvl), b = this._getVArc(a,e), alpha = v._d/maxD*2*Math.PI;
        return  [root[0]+a*Math.cos(alpha),root[1]+b*Math.sin(alpha)]
      },
      posConfig:{
          radiusTable :  [50,50,20,20],
          margin: [50,50,50,50],
          butterfly: false,
          root: [0,0]
      },
      _getMargin: function(lvl){
          if(typeof(this.posConfig.margin) === "number"){
              return this.posConfig.margin
          }
          return (lvl > this.posConfig.margin.length ? this.posConfig.margin.last() : this.posConfig.margin[lvl]);
      },
      
      _getRadius: function(lvl){
          return (lvl > this.posConfig.radiusTable.length ? this.posConfig.radiusTable.last() : this.posConfig.radiusTable[lvl]);
      },
      
      _getDistance: function(lvl){
          return (this._getRadius(lvl)+this._getMargin(lvl));
      },      
      // set Lvl of vertice 
      _setLvl: function(v){
          return (v._lvl || 
                  (v._lvl = (v.mainParent ? (this._setLvl(v.mainParent)+1) : 0)) && 
                  (this._lvls[v._lvl] || (this._lvls[v._lvl] = [])).push(v)
              );
      },

    // place a tree from a vertice
    // return a tree is a list of levels with each position of each vertice at each level
    // tree : [[{_d:0}],[{_d:-1},{_d:0},{_d:1}],[{_d:-1},{_d:0},{_d:1},{_d:2}]]
    _placeTree: function(v) {
        var c = v.mainChildren, cs = [];
        if (c.length) {
          for (var i = 0, n = c.length; i < n; i++) {
              var a = this._placeTree(c[i])
            cs.push(a);
          }
          var mrg = this._mergeChildren(cs, this._getRadius(c[0])+this._getMargin(c[0]));
          v._d = (c.length > 1 ? (mrg[0][0]._d+mrg[0].last()._d)/2 : mrg[0][0]._d);
          return ([[v]].concat(mrg));
        } else {
          v._d = 0;
          return ([[v]]);
        }
      },
      // from a list of childrenTrees, return one tree, be merging each level
      _mergeChildren : function(cs, minDist) {
          while (cs.length > 1) {
            cs[0] = this._mergeTrees(cs[0], cs[1], minDist);
            cs.splice(1, 1);
          }
          return (cs[0]);
      },
      // merge two trees, here the two trees start from the same level   
      // it's the core function of the tilford algorithm     
      _mergeTrees: function(tree1, tree2) {
          var l = Math.min(tree1.length, tree2.length), collision = null, diff,lvl;
          for (var i = l; i--; ) {
            diff = tree1[i].last()._d - tree2[i][0]._d;
            if (collision === null || diff > collision) {
                lvl = i;
                collision = diff;
            }
          }
          var res = [];
          for (var i = 0, l = Math.max(tree1.length, tree2.length); i < l; i++) {
            res[i] = (typeof(tree1[i]) !== 'undefined' ? tree1[i] : []).concat(this._translateX(tree2[i],collision+this._getDistance(lvl)));
          }
          return res;
       },
       // levelTree is one level of a tree : [{_d:0},{_d:1}]
       // translate is a number
       _translateX: function(levelTree,translate){
           if(typeof(levelTree) === "undefined") return [];
           return levelTree.collect(function(v){
               v._d = v._d+translate;
               return v;
           });
       },
       getZ: function(v){
           var a = this._getRadius(v._lvl);
           return a*a/5;
       }
      
  });
  return Tree;
}));
