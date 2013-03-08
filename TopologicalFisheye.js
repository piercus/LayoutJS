sand.define("layoutJS/TopologicalFisheye",["MVC/Extendable","Layout/Base"],function(r) {
  this.exports = r.Extendable.export({
    "+options":{
      vertices : {}, // vs is "3" => 1, "id" => <DIO Degree Of Interest>
      edges : []  // edge is a 2-array of vertices ids,  ["id1","id2"] , ["idFrom", "idTo"],
      focusId : null, 
      interestFn : function(sPL) {  // sPL : shortest Path Length
        return [5,4,3,2,1][sPL] || 0;
      },
      ADOI : function (vId) {// Apriori Degree Of Interest
        return (this.vertices[vId].APIO || (this.vertices[vId].APIO = this.dijkstra(0,vId));
      }
    },
    "+init" : function(o) {
    },
    
    setInterest : function(focusId) {
      this.dijkstra(focusId);
      
      this.dijkstra(focusId,vId)
    },
    
    getInterest : function(vId,shPath) {// vId : verticeId
      var adio = this.ADOI.call(this,vId);
      if(adio === -1) {
        return 0;
      }
      var focus = this.interestFn.call(this, this.vertices[vId].shPath);
      if(focus === -1) {
        return 0;
      }
      return adio+focus;
    },
    
    // retun the shortest path length 
    dijkstra : function(srcId,puitId) {// the shortestpath between srcId and puitId node
      for (var i in this.vertices) if(this.vertices.hasOwnProperty(i))  {
        if(i == srcId) {
          this.vertices[i].tentativ = 0;
        } else {
          this.vertices[i].tentativ = -1; // -1 <=> infinity
        }
      }
      var q = this.vertices,u,neighboors,nTent;
      while (q.length > 0) {
        // u is current node
        u = q.sort(function(v){
          return v.tentativ;
        }).shift();
        
        
        if(u.tentativ === -1) {// no more vertices 
          return -1;
        }
        
        if(u.id === puitId) {// found puit
          return u.tentativ;
        }
        
        for (var i = 0; i < q.length){
          for (var j = 0 ; j < q[i].edgesFrom.length ; j ++) {
            // new tentativ
            if(this.vertices[q[i].edgesFrom[j].from].tentativ > -1) {
              nTent = this.vertices[q[i].edgesFrom[j].from].tentativ+q[i].edgesFrom[j].length;
              if(nTent < q[i].tentativ){
                q[i].tentativ = nTent;
              }
            } 
          }
        }
      }
      for(var i in this.vertices) if(this.vertices.hasOwnProperty(i)){
        this.vertices[i].shPathCache = this.vertices[i].shPathCache;
      }
    }
  });
});
