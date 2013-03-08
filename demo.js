sand.define("layoutJS/demo", ["layouts/Butterfly", "layouts/LinLog", "DOM/toDOM", "Raphael", "inputex/Group", "inputex/Select"], function(r){
  
  
  var buildRandomChildren = function(av, parentId){
    var res = [], i = 0;
    while(Math.random() < (1-1/av)){
      res.push({id: parentId+"."+i})
    } 
    return res;
  };
  
  
  
  var buildRandomTree = function(pId, lvl){       
    var id = pId || "0",
        level = lvl || 0,
        children = buildRandomChildren(4-level/3, id),
        childrenTree = children.map(function(c){
            return buildRandomTree(c.id, level+1);
        }),
        successorVs =  childrenTree.map(function(c){return c.vs}),
        successorEs =  childrenTree.map(function(c){return c.es});

    return {
      vs : successorVs.concat([{id : id}]),
      es : children.map(function(c){return {from : c.id, to : id}}).concat(successorEs)
    };
  };
  
  var desc = {
    tag : "table",
    children : [{
        tag : "tr",
        children : [{tag : "td",label : "main"},{tag : "td", label: "form"}]
      },{
        tag : "tr",
        children : [{tag : "td"},{tag : "td"}]
    }]                 
  };
  
  document.body.appendChild(r.toDOM(desc,this));
  
  var g = new r.Group({
    fields : [{
        type : "select",
        name : "Layout",
        choices : [{ 
            label : "Tilford 'butterfly'", 
            value : r.Butterfly 
          },{
            label : "LinLog", 
            value : r.LinLog          
        }]
    }],
    parentEl : this.formEl
  });
  
  var paper = r.Raphael(10,50,1000,1000);
  
  var draw = function(vertices,edges){
      var endDate = new Date();
      var transform = function(x){
        return x+500;
      }
      var t = transform;
      //console.log("time in ms :",endDate.getTime()-stDate.getTime())
      
      //l.bnTree && l.bnTree.drawBoxes(paper);
      vertices.each(function(v){
        v.redraw || (v.redraw = function(){
          if(!this.circle){
            this.circle = paper.circle(t(v.x), t(v.y), 10).attr("fill", "#f00");
            this.circle.click(function(){
              console.log(l.getDetails(v));
            });

          } else {
            this.circle.attr({cx: t(this.x), cy: t(this.y)});
          }
          var arrowPath = "M"+t(v.x)+","+t(v.y)+"l"+v.dx*10+","+v.dy*10;
          if(this.arrow){
            this.arrow.attr({"path":arrowPath});
          } else {
            this.arrow = paper.path(arrowPath).attr("fill", "#0FF");
          }
        });
        v.redraw();
        
        v.circle.drag(function(dx,dy,x,y){
          v.x = this._dx+x,
          v.y = this._dy+y;
          v.redraw();
          v.edgesFrom.concat(v.edgesTo).each(function(e){
            e.redraw();
          });
        },function(x,y){
          this._dx = v.x-x;
          this._dy = v.y-y;
        },function(){
          this.getCost();
        }.bind(this))
        
      });
      es.each(function(e){
        e.redraw || (e.redraw = function(){
          var p = "M"+t(vertices[e.from].x)+","+t(vertices[e.from].y)+"L"+t(vertices[e.to].x)+","+t(vertices[e.to].y);
          if(this.path){
            this.path.attr({"path":p});
          } else {
            this.path = paper.path(p).attr("stroke", "#f0f");
          }

        });
        e.redraw();
      });
      
      
  }.bind(this);
  var currentT = 100000;
  
  var onUpdated = function(v){
    var layout = new v.Layout(buildRandomTree);
    layout.compute(draw);
  };
  
  g.on("updated",onUpdated); 
  
});