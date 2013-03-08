(sand.define("LayoutJS/Butterfly",["LayoutJS/Rect","core/extend"],function(r){
  
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
  return r.Rect.extend({
      /*
      *  Structural
      *
      */
      compute: function(cb){   
           var root;
           this._lvls = [];
           // first set Level in the tree
           for (var i = this.vertices.length; i--; ) (this._setX(this.vertices[i]) == 0) && (root = this.vertices[i]);
           
           this._placeVertice(root);
           this._setPosition(root,this.root);   
           cb(null,{vertices : this.vertices});
           
      },       
      
      _setPosition: function(root,start){
        root._dy = 0;
        root.position = start;
        this.dichoVertices(root);
      },            
      
      dichoVertices: function(root){
        var right = true,size=this._getSize(root), limit = root.rect[1]/2,cumul = 0,cumulRight = 0;
        for (var i = 0, l=root.mainChildren.length; i< l; i++){
          if(root.rect[1] <= 2*size[1] || right && cumul+root.mainChildren[i].rect[1]/2 <= limit){
            root.mainChildren[i].right = true;
            cumulRight = cumulRight + root.mainChildren[i].rect[1];
          } else {
            root.mainChildren[i].right = false;
          }
          cumul = cumul + root.mainChildren[i].rect[1];
        } 
        for (var i = 0, l=root.mainChildren.length; i< l; i++){ 
          r.Rect.prototype._setPosition(
             root.mainChildren[i],
             [
               root.position[0],
               root.position[1]+root._dy - (root.mainChildren[i].right ? cumulRight : 2*cumulRight+(cumul-cumulRight))/2
             ],
             root.mainChildren[i].right ? 1 : -1,
             root.mainChildren[i].right ? 1 : -1,
             cumul+cumulRight
            );
          }
      },
      _setLeft: function(){
        
      },
      _setRight: function(){
        
      }
  });

}));
