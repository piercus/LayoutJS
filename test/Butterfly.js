sand.define("layoutJS/test/Butterfly",["LayoutJS/Butterfly","vows","assert"],function(r){
   r.vows.describe("Butterfly Layout").addBatch({
     "Butterfly on 3 Points" : {   
       "chain" : {
         'topic' : function(){
           
            var b = new r.Butterfly({
              vertices : [0,1,2],
              edges: [{to: 0, from: 1},{to: 1, from: 2}]
            });   
            
            b.compute(this.callback);
          },    
          "There is 3 vertices with x and y attributes" : function(err,o){
            r.assert.isArray(o);
            r.assert.equal(o.length,3);
            for(var i = 0; i < o.length; i++){    
               r.assert.ok(o[i].position);               
            }
          },
          "Vertice are in good positions" : function(err,o){
            var att = [[0,0],[1,0],[2,0]];
            for(var i = 0; i < o.length; i++){ 
               r.assert.equal(o[i].position[0],att[i][0]); 
               r.assert.equal(o[i].position[1],att[i][1]);                
            }
          }
       },  
       "rooted chain" : {
          'topic' : function(){

             var b = new r.Butterfly({
               vertices : [0,1,2], 
               root : [41,-89],
               edges: [{to: 0, from: 1},{to: 1, from: 2}]
             });   

             b.compute(this.callback);
           },    
           "Vertice are in good positions" : function(err,o){
             var att = [[41,-89],[42,-89],[43,-89]];
             for(var i = 0; i < o.length; i++){ 
                r.assert.equal(o[i].position[0],att[i][0]); 
                r.assert.equal(o[i].position[1],att[i][1]);                
             }
           }
       }, 
       "tree" : {
         'topic' : function(){
           var b = new r.Butterfly({
             vertices : [0,1,2],
             edges: [{to: 0, from: 1},{to: 0, from: 2}]
           });
           b.compute(this.callback);
         }, 
         "Vertice are in good positions" : function(err,o){
           var att = [[0,0],[1,-0.5],[1,0.5]];
           //console.log(o.map(function(e){return {position : e.position, rect: e.rect}}));
           for(var i = 0; i < o.length; i++){
              r.assert.equal(o[i].position[0],att[i][0]); 
              r.assert.equal(o[i].position[1],att[i][1]);               
           }
         }
       },
       "radius tree" : {
         'topic' : function(){
            var b = new r.Butterfly({
              vertices : [0,1,2], 
              size : [300,100],
              edges: [{to: 0, from: 1},{to: 0, from: 2}]
            });
            b.compute(this.callback);
          }, 
          "Vertice are in good positions" : function(err,o){
            var att = [[0,0],[300,-50],[300,50]];
            //console.log(o.map(function(e){return {position : e.position, rect: e.rect}}));
            for(var i = 0; i < o.length; i++){
               r.assert.equal(o[i].position[0],att[i][0]); 
               r.assert.equal(o[i].position[1],att[i][1]);               
            }
          }
       },
       "radius origin tree" : {
         'topic' : function(){
            var b = new r.Butterfly({
              vertices : [0,1,2], 
              size : [100,100], 
              root : [23,67],
              edges: [{to: 0, from: 1},{to: 0, from: 2}]
            });
            b.compute(this.callback);
          }, 
          "Vertice are in good positions" : function(err,o){
            var att = [[23,67],[123,17],[123,117]];
            //console.log(o.map(function(e){return {position : e.position, rect: e.rect}}));
            for(var i = 0; i < o.length; i++){
               r.assert.equal(o[i].position[0],att[i][0]); 
               r.assert.equal(o[i].position[1],att[i][1]);               
            }
          }
       }
     },      
     "Butterfly on 4 Points" : {
       "flower" : {
        'topic' : function(){
          var b = new r.Butterfly({
            vertices : [0,1,2,3],
            edges: [{to: 0, from: 1},{to: 0, from: 2},{to: 0, from: 3}]
          });
          b.compute(this.callback);
        },
        "Vertice are in good positions" : function(err,o){
           var att = [[0,0],[1,-0.5],[1,0.5],[-1,0]];
           //console.log(o.map(function(e){return {position : e.position, rect: e.rect}}));
           for(var i = 0; i < o.length; i++){
              r.assert.equal(o[i].position[0],att[i][0]);
              r.assert.equal(o[i].position[1],att[i][1]);               
           }
         }
       },
       "asym tree" : { 
         
         'topic' : function(){
           var b = new r.Butterfly({
             vertices : [0,1,2,3],
             edges: [{to: 0, from: 1},{to: 1, from: 2},{to: 0, from: 3}]
           });
           b.compute(this.callback);
         }, 
         
         "Vertice are in good positions" : function(err,o){
            var att = [[0,0],[1,-0.5],[2,-0.5],[1,0.5]];
            for(var i = 0; i < o.length; i++){
               r.assert.equal(o[i].position[0],att[i][0]);
               r.assert.equal(o[i].position[1],att[i][1]);               
            }
          } 
          
        },
        "asym tree 2" : {
          
          'topic' : function(){
            var b = new r.Butterfly({
              vertices : [0,1,2,3],
              edges: [{to: 0, from: 1},{to: 1, from: 2},{to: 1, from: 3}]
            });
            b.compute(this.callback);
          },
          
          "Vertice are in good positions" : function(err,o){
             var att = [[0,0],[1,0],[2,-0.5],[2,0.5]];
             for(var i = 0; i < o.length; i++){
                r.assert.equal(o[i].position[0],att[i][0]);
                r.assert.equal(o[i].position[1],att[i][1]);               
             }
           }
           
         },
         "asym tree 2" : { 
           
           'topic' : function(){
             var b = new r.Butterfly({
               vertices : [0,1,2,3],
               edges: [{to: 0, from: 1},{to: 0, from: 2},{to: 2, from: 3}]
             });
             b.compute(this.callback);
           },
           
           "Vertice are in good positions" : function(err,o){
              var att = [[0,0],[1,-0.5],[1,0.5],[2,0.5]];
              for(var i = 0; i < o.length; i++){
                 r.assert.equal(o[i].position[0],att[i][0]);
                 r.assert.equal(o[i].position[1],att[i][1]);               
              }
            }
          },
          "first real life 4 points tree" : {
             'topic' : function(){
                var test = '{"vertices":[{"id":"5rtpi5ne9b5ipb9-2"},{"id":"5rtpi5ne9b5ipb9-3"},{"id":"5rtpi5ne9b5ipb9-4"},{"id":"5rtpi5ne9b5ipb9-1"}],"edges":[{"from":"5rtpi5ne9b5ipb9-2","to":"5rtpi5ne9b5ipb9-1"},{"from":"5rtpi5ne9b5ipb9-3","to":"5rtpi5ne9b5ipb9-1"},{"from":"5rtpi5ne9b5ipb9-4","to":"5rtpi5ne9b5ipb9-1"}],"size":[1,1],"root":[5119.452738287215,3333.7816730032473]}';

                var b = new r.Butterfly(JSON.parse(test));
                b.compute(this.callback);
             },
             "Vertice are in good positions" : function(err,o){
                 //console.log(o.map(function(e){return {position : e.position, rect: e.rect}}));            
                 var att = [[0,0],[1,-0.5],[1,0.5],[2,0.5]];
                 for(var i = 0; i < o.length; i++){
                    r.assert.ok(o[i].position[0]>0);
                    r.assert.ok(o[i].position[1]>0);               
                 }
              }
           },
         "real life 4 points tree" : {
           'topic' : function(){
              var test = '{"vertices":[{"id":"5rtpi5ne9b5ipb9-1"},{"id":"5rtpi5ne9b5ipb9-2"},{"id":"5rtpi5ne9b5ipb9-3"},{"id":"5rtpi5ne9b5ipb9-4"}],"edges":[{"from":"5rtpi5ne9b5ipb9-2","to":"5rtpi5ne9b5ipb9-1"},{"from":"5rtpi5ne9b5ipb9-3","to":"5rtpi5ne9b5ipb9-1"},{"from":"5rtpi5ne9b5ipb9-4","to":"5rtpi5ne9b5ipb9-1"}],"size":[300,200],"root":[5119.452738287215,3333.7816730032473]}';
              
              var b = new r.Butterfly(JSON.parse(test));
              b.compute(this.callback);
           },
           "Vertice are in good positions" : function(err,o){
               //console.log(o.map(function(e){return {position : e.position, rect: e.rect}})); 
               var size = [300,200],root = [5119.452738287215,3333.7816730032473];
               var att = [[0,0],[1,-0.5],[1,0.5],[-1,0]];
               for(var i = 0; i < o.length; i++){
                  r.assert.equal(o[i].position[0],att[i][0]*size[0]+root[0]);
                  r.assert.equal(o[i].position[1],att[i][1]*size[1]+root[1]);               
               }
            }
         }
     }, 
     "Butterfly on 5 Points" : {
       "flower" : {  
         
        'topic' : function(){
          var b = new r.Butterfly({
            vertices : [0,1,2,3,4],
            edges: [{to: 0, from: 1},{to: 0, from: 2},{to: 0, from: 3},{to: 0, from: 4}]
          });
          b.compute(this.callback);
        }, 
        
        "Vertice are in good positions" : function(err,o){
           var att = [[0,0],[1,-0.5],[1,0.5],[-1,0.5],[-1,-0.5]];  
           //console.log(o.map(function(e){return {position : e.position, rect: e.rect}}));
           for(var i = 0; i < o.length; i++){
              r.assert.equal(o[i].position[0],att[i][0]);
              r.assert.equal(o[i].position[1],att[i][1]);               
           }
         }
         
       },
       "tree 1" : {
         
         'topic' : function(){
           var b = new r.Butterfly({
             vertices : [0,1,2,3,4],
             edges: [{to: 0, from: 1},{to: 1, from: 2},{to: 1, from: 3},{to: 0, from: 4}]
           });
           b.compute(this.callback);
         }, 
         
         "Vertice are in good positions" : function(err,o){
           
            var att = [[0,0],[1,0],[2,-0.5],[2,0.5],[-1,0]];
               
            for(var i = 0; i < o.length; i++){
               r.assert.equal(o[i].position[0],att[i][0]);
               r.assert.equal(o[i].position[1],att[i][1]);               
            }
         }
         
       } 
     },
     "Butterfly on 6 Points" : {
        "flower" : {  
         'topic' : function(){
           var b = new r.Butterfly({
             vertices : [0,1,2,3,4,5],
             edges: [{to: 0, from: 1},{to: 0, from: 2},{to: 0, from: 3},{to: 0, from: 4},{to: 0, from: 5}]
           });
           b.compute(this.callback);
         }, 

         "Vertice are in good positions" : function(err,o){
            var att = [[0,0],[1,-1],[1,0],[1,1],[-1,0.5],[-1,-0.5]];
            
            for(var i = 0; i < o.length; i++){
               r.assert.equal(o[i].position[0],att[i][0]);
               r.assert.equal(o[i].position[1],att[i][1]);               
            }
          }

        }
       },
       "Butterfly on 8 Points" : {
        "specialtree" : { 

          'topic' : function(){
            var b = new r.Butterfly({
              vertices : [0,1,2,3,4,5,6,7],
              edges: [{to: 0, from: 1},{to: 1, from: 2},{to: 1, from: 3},{to: 0, from: 4},{to: 0, from: 5},{to: 0, from: 6},{to: 0, from: 7}]
            });
            b.compute(this.callback);
          }, 

          "Vertice are in good positions" : function(err,o){
             //console.log(o.map(function(e){return {position : e.position, rect: e.rect}}));
             var att = [[0,0],[1,-0.5],[2,-1],[2,0],[1,1],[-1,1],[-1,0],[-1,-1]];
             for(var i = 0; i < o.length; i++){
                r.assert.equal(o[i].position[0],att[i][0]);
                r.assert.equal(o[i].position[1],att[i][1]);               
             }
          }

        },
        "specialtree2" : { 

          'topic' : function(){
            var b = new r.Butterfly({
              vertices : [0,1,2,3,4,5,6,7,8,9],
              edges: [{to: 0, from: 1},{to: 1, from: 2},{to: 1, from: 3},{to: 0, from: 4},{to: 0, from: 5},{to: 0, from: 6},{to: 0, from: 7},{ to : 7, from : 8},{ to : 6, from : 9}]
            });
            b.compute(this.callback);
          }, 

          "Vertice are in good positions" : function(err,o){
             //console.log(o.map(function(e){return {position : e.position, rect: e.rect}}));
             var att = [[0,0],[1,-0.5],[2,-1],[2,0],[1,1],[-1,1],[-1,0],[-1,-1],[-2,-1],[-2,0]];
             for(var i = 0; i < o.length; i++){
                r.assert.equal(o[i].position[0],att[i][0]);
                r.assert.equal(o[i].position[1],att[i][1]);               
             }
          }

        } 
      },
     "Asymetric margin/size" : {
       "chain" : {
         'topic' : function(){

              var b = new r.Butterfly({
                vertices : [0,1,2],
                edges: [{to: 0, from: 1},{to: 1, from: 2}],
                margin : [1,2],
                size : [2,2]
              });   

              b.compute(this.callback);
           },    
           "Vertice are in good positions" : function(err,o){
              var att = [[0,0],[3,0],[6,0]];

              for(var i = 0; i < o.length; i++){ 
                 r.assert.equal(o[i].position[0],att[i][0]); 
                 r.assert.equal(o[i].position[1],att[i][1]);                
              }
           }
         },
         "tree" : {
            'topic' : function(){

                 var b = new r.Butterfly({
                   vertices : [0, 1, 2, 3],
                   edges: [{to: 0, from: 1},{to: 1, from: 2},{to: 1, from: 3}],
                   margin : [1, 20],
                   size : [2, 2]
                 });   

                 b.compute(this.callback);
              },    
              "Vertice are in good positions" : function(err,o){
                 var att = [[0, 0], [3, 0], [6, -11], [6, 11]];
                //console.log(o.map(function(e){return {position : e.position, rect: e.rect, _dy : e._dy}})); 
                 for(var i = 0; i < o.length; i++){ 
                    r.assert.equal(o[i].position[0],att[i][0]); 
                    r.assert.equal(o[i].position[1],att[i][1]);                
                 }
              }
            }
       },
       "Variation sizes" : {
         "chain" : {
           'topic' : function(){

                var b = new r.Butterfly({
                  vertices : [{
                      id : 0, 
                      size : [22,10]
                    },{
                      id : 1, 
                      size : [4,32]                      
                    },{
                      id : 2, 
                      size : [10,24]                      
                  }],
                  edges: [{to: 0, from: 1},{to: 1, from: 2}],
                  margin : [10,2],
                  size : [2,2]
                });   

                b.compute(this.callback);
             },    
             "Vertice are in good positions" : function(err,o){
                var att = [[0,0],[23,0],[40,0]];
                //console.log(o.map(function(e){return {position : e.position, rect: e.rect, _dy : e._dy}})); 
                for(var i = 0; i < o.length; i++){ 
                   r.assert.equal(o[i].position[0],att[i][0]); 
                   r.assert.equal(o[i].position[1],att[i][1]);                
                }
             }
           }

         }
   }).run();
});
