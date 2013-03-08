sand.define("LayoutJS/demo/GraphBuilder", ["Seed/Seed"], function(r){
  
  return r.Seed.extend({
      "+options" : {
        "$edges" : { 
          properties : {
            "tree" : {
              type : "boolean",
              title : "Tree",
              _inputex : {
                interactions: [{
                    valueTrigger: false, 
                    actions: [{ name: 'n', action: 'show'}]
                  },{
                    valueTrigger: true, // when set to true:
                    actions: [
                      { name: 'n', action: 'hide'},
                      { name: 'n', action: 'clear'}
                    ]
                }]
              }
            },
            "n" : {
              type : "integer",
              title : "Number of Edges",
              optional : true
            }
            
          },
          default : {
            tree : true
          }
        },
        
        "$nVertices" : {
          type : "integer",
          title : "Number of Vertices",
          default : 10
        }
      
      }, 
      
      "+init" : function(){    
        
        var n = this.nVertices, tree = this.edges.tree,nEdges = this.edges.n, vertices = [];
        
        for(var i = 0; i < n ; i++){
          var v = { id : i };
          vertices.push(v);
          if(tree && i>0){
            to = Math.floor(Math.random()*i);
            fr = i;
            es.push({from : fr, to : to})
          }
        }

        if(!tree){
          for(var i = 0; i < nEdges ; i++){ 
            to = 0;
            fr = 1;
            while(to <= fr || esIndex[fr+","+to]){
               fr = Math.floor(Math.random()*n), to = Math.floor(Math.random()*n); 
            }

            esIndex[fr+","+to] = true;
            es.push({
                from : fr,
                to: to
            });
          }        
        }
        
        this.graph = {
          vertices : vertices,
          edges : es
        };
        
      }
  });
  
  
});