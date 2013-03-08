////////////
//
//  Inpired from https://github.com/Elucidation/Barnes-Hut-Tree-N-body-Implementation-in-HTML-Js
//
/////////////


// Reality
// var MINMASS = 1e20;
// var MAXMASS = 1e30;
// var G = 6.673e-11; // Gravitational Constant
// var ETA = 0.01; // Softening constant
// var GFACTOR = 1.3; // Higher means distance has more effect (3 is reality)
// var dt; // Global DT set by html
// var MAXDEPTH = 50; // BN tree max depth ( one less than actual, example with maxdepth = 2, the levels are [0 1 2] )
// var BN_THETA = 0.5;
// var DISTANCE_MULTIPLE = 1e9; // # meters per pixel (ex 1, 1 meter per pixel)
// 1e3 = km, 1e6 = Mm, 1e9 = Gm, 149.60e9 = Au, 9.461e15 = LightYear, 30.857e15 = Parsec
//var MINMASS = 1e2;
//var MAXMASS = 1e10;
//var G = 1e-5; // Gravitational Constant
//var ETA = 10; // Softening constant
//var GFACTOR = 1.3; // Higher means distance has more effect (3 is reality)

//var DISTANCE_MULTIPLE = 2;

//var INTERACTION_METHOD = "BN"; // BN or BRUTE, type of tree search to use
//var MAXDEPTH = 50; // BN tree max depth ( one less than actual, example with maxdepth = 2, the levels are [0 1 2] )
//var BN_THETA = 0.5;

//bods = [{x: x, y : y}]
sand.define("LayoutJS/BarnesHut",function(r){
  var BnTree = function(options){
    this.nodes = options.nodes || [];
    this.bods = options.bods;//bods = [{x: x, y : y},...]
    this.maxDepth = 5;
    this.startBox = options.startBox||[[-1000,-1000],[4000,4000]]; // [x y], [w h]
    this.getRepulsiveFactor = options.getRepulsiveFactor;
    this.buildNodes();
  }
  BnTree.prototype = {
    buildNodes : function(){
      this.buildRoot();
      for (var i=0;i<this.bods.length;i++){ 
        //console.log(this.pointInBBOX(this.bods[i].position[0],this.bods[i].position[1],this.root.box));
        if (this.pointInBBOX(this.bods[i].position[0],this.bods[i].position[1],this.root.box)) {
          this.bnAddBody(this.root,i,0);
        }
      }
    },
    buildRoot: function(){
      this.root = {
        body: [], // Body
        leaf:true,
        CoM: null, // center of mass
        nodes:[null,null,null,null],//[leftTop,rightTop,leftBottom,rightBottom]
        box:this.startBox
      };
    },
    pointInBBOX: function(x,y,box){
      return (x > box[0][0] && (x < box[1][0]+box[0][0]) && (y > box[0][1]) && (y < box[1][1]+box[0][1]))
    },
    bnAddBody: function(node,i,depth) {
      // if node has body already
      if ( node.body.length == 0 ) { //if node empty, add body
        node.body = [i];
        node.CoM = [this.bods[i].mass, this.bods[i].position[0],this.bods[i].position[1]]; // Center of Mass set to the position of single body
        return;
      } 
      
      // not empty
      // Check if hit max depth
      if (depth > this.maxDepth) {
        node.body.push(i); // Add body to same node since already at max depth
      } else {
        var subBodies;
        if (!node.leaf) { 
          // Node is a parent with children
          subBodies = [i];
        } else {
          // Node is a leaf node (no children), turn to parent
          subBodies = [node.body[0],i];
        }
            
        for (var k=0;k<subBodies.length;k++) {
          // Add body to children too		
          var quad = this.getQuad(subBodies[k],node.box);
          var child = node.nodes[quad];
          if (child) {
            // if quad has child, recurse with child
            this.bnAddBody(child,subBodies[k],depth+1);
          } else {
            // else add body to child
            node = this.bnMakeNode(node,quad,subBodies[k]);
          }
        }
        node.body = ["PARENT"];
        node.leaf = false; // Always going to turn into a parent if not already
      }

      // Update center of mass
      node.CoM[1] = (node.CoM[1]*node.CoM[0] + this.bods[i].position[0]*this.bods[i].mass)/(node.CoM[0]+this.bods[i].mass);
      node.CoM[2] = (node.CoM[2]*node.CoM[0] + this.bods[i].position[1]*this.bods[i].mass)/(node.CoM[0]+this.bods[i].mass);
      node.CoM[0] += this.bods[i].mass;
      return;
    },
    
    
    bnMakeNode: function(parent,quad,cIndex) {
      var b = this.bods[cIndex],
      child = {
        body: [cIndex],
        leaf: true,
        CoM : [b.mass, b.position[0],b.position[1]], // Center of Mass set to the position of single body
        nodes:[null,null,null,null],
        box:this.getChildrenBox(parent.box,quad)
      };
      parent.nodes[quad] = child;
      return parent;
    },
    
    getQuad: function(i,box) {
      var mx = box[0][0]+box[1][0]/2;
      var my = box[0][1]+box[1][1]/2;
      if (this.bods[i].position[0] < mx) { // Left
        if (this.bods[i].position[1] < my) {return 0;} // Top
        else {return 2;} // Bottom
      } else { // right
        if (this.bods[i].position[1] < my) {return 1;} // Top
        else {return 3;} // Bottom}
      }
    },
    getChildrenBox: function(pBox, quad){
      var size =[pBox[1][0]/2, pBox[1][0]/2];
      switch (quad) {
        case 0: // Top Left
          return [
            [pBox[0][0],pBox[0][1]],
            size
          ];
        break;
        case 1: // Top Right
          return [
            [pBox[0][0]+size[0],pBox[0][1]],
            size
          ];
        break;
        case 2: // Bottom Left
          return [
            [pBox[0][0],pBox[0][1]+size[1]],
            size
          ];
        break;
        case 3: // Bottom Right
          return [
            [pBox[0][0]+size[0],pBox[0][1]+size[1]],
            size
          ];
        break;
      }
    },
    bnDeleteNode: function(node) {
      node.b = null;
      node.box = null;
      // For each child
      for (var i=0;i<4;i++) {
        if (node.nodes[i]) { // If child exists
          node.nodes[i] = bnDeleteNode(node.nodes[i]);
        }
      }
      return null;
    },
    computeForces: function(){
      for(var i = 0; i< this.bods.length; i++){
        this.doBNtree(i);
      }
    },
    doBNtree: function(bI) {
      return this.doBNtreeRecurse(bI,this.root);
    },
    doBNtreeRecurse: function(bI,node) {
      //console.log("in tree",node)
      if (node.leaf) {
        // If node is a leaf node
        for (var k=0;k<node.body.length;k++) {
          if (bI != node.body[k]) { // Skip self
            //console.log("setForce between "+bI +" and "+node.body[k]);
            this.setForce(bI,
              this.bods[node.body[k]].mass,
              this.bods[node.body[k]].position[0],
              this.bods[node.body[k]].position[1]);
            //numChecks += 1;
          }
        }
      } else {
        var s = Math.max(node.box[1][0],node.box[1][1]); // Biggest side of box
          var d = this.dist(this.bods[bI].position[0],this.bods[bI].position[1],node.CoM[1],node.CoM[2]);
          if (s < d) {
            //console.log("setForcefromBox")
            this.setForce(bI,node.CoM[0],node.CoM[1],node.CoM[2]);
            //numChecks += 1;
          } else {
          // Recurse for each child
          for (var k=0;k<4;k++) {
            if (node.nodes[k]) {
              this.doBNtreeRecurse(bI,node.nodes[k]);
            }
          }
        }
      }
      
      // for debug
      return {forceX : this.bods[bI].forceX, forceY : this.bods[bI].forceY};
    },
    dist: function(x1,y1,x2,y2){
      return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
    },
    draw: function(){
      //drawBoxes(this.root);
    },
    drawBoxes: function(paper,n){
      return ;
      var node = n || this.root;
      //console.log(node.box[0][0],node.box[0][0],node.box[1][0],node.box[1][1])
      node.rect = paper.rect(node.box[0][0],node.box[0][1],node.box[1][0],node.box[1][1]);
      node.path = paper.path("M"+node.CoM[1]+","+node.CoM[2]+"l10,0l-20,0l10,0l0,10l0,-20");
      for (var k=0;k<4;k++) {
        if (node.nodes[k]) {
          this.drawBoxes(paper,node.nodes[k]);
        }
      }
    },
    removeBoxes: function(node){
      var n = node || this.root;
      if(n.rect){
        n.rect.remove();
        n.path.remove();
      } 
      n.rect = null;
      n.path = null;
      for (var k=0;k<4;k++) {
        if (n.nodes[k]) {
          this.removeBoxes(n.nodes[k]);
        }
      }
    },
    setForce: function(i,mass2,x2,y2,di){
      var x1 = this.bods[i].position[0],
          y1 = this.bods[i].position[1],
          mass1 = this.bods[i].mass;
      
      var factor = this.getRepulsiveFactor(mass1,mass2,di||this.dist(x1,y1,x2,y2));
      //console.log(factor,i);
      if(isNaN(this.bods[i].forceX) || isNaN(this.bods[i].forceY)){
        throw("is NaN");
      }
      if(factor > 100){
        factor = 100;
      }
      this.bods[i].forceX += (x1-x2)*factor
      this.bods[i].forceY += (y1-y2)*factor

      if(isNaN(this.bods[i].forceX) || isNaN(this.bods[i].forceY)){
        throw("is NaN");
      }
    }
  };
  this.exports = BnTree;
});
