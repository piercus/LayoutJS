sand.define("LayoutJS/demo/Demo", [
  "LayoutJS/LinLog", 
  "LayoutJS/Butterfly", 
  "toDOM/toDOM", 
  "Seed/Seed", 
  "Function/bind", 
  "Array/each", 
  "inputex/Field", 
  "inputex/Group", 
  "inputex/String", 
  "inputex/Select", 
  "Array/map",
  "Array/where",
  "Array/flatten", 
  "inputex/Form", 
  "inputex/Number", 
  "inputex/Jsonschema", 
  "inputex", 
  "core/extend", 
  "inputex/List",
  "inputex/Integer",
  "inputex/Checkbox", 
  "inputex/Radio", 
  "inputex/Textarea",
  "LayoutJS/demo/GraphBuilder"], function(r){
  
  var algos = [/*{
      label : "Fruchterman-Reingold (Force-Directed)",
      cstr : r.Fruchterman
    },*/{
      label : "LinLog (Force-directed)",
      value : r.LinLog,
      fields : [{   
            type : "number",
            label : "Number of vertices",
            value : 48,
            name : "n"
         },{
           label : "Number of edges",
           type : "number",
           value : 80,
           name : "nEdges" 
      }]
    } /*{
      label : "LinLog with BarnesHut (Force-directed)",
      cstr : r.BarnesHut      
    }*/,{ 
      label : "Butterfly (Tree)",
      value : r.Butterfly,
      fields : [{   
            type : "number",
            label : "Number of vertices",
            value : 48,
            name : "n"
         },{
            type : "number",
            label : "Interval of random size",
            value : 0,
            name : "interval"
       }],
       defaultOptions : {
         size : [40, 40],
         margin : [10, 10]
       }
    }/*,{
      label : "Rect (Tree)",
      cstr : r.Rect
    },{
      label : "Reingold-Tilford (Tree)",
      cstr : r.Tilford
  }*/];
  
  return r.Seed.extend({
    "options" : {
      parentEl : null,
      paper : null
    },
    
    "+init" : function(){
      this.el = r.toDOM(this.djson.bind(this), this);
      this.parentEl.appendChild(this.el); 

      this.form = new r.Form({
        parentEl : this.groupEl,
        className : "mainForm",
        buttons : [{
          value : "click", 
          onClick : function(){
            var res = this.form.getValue();
            res.graph = res.graphBuilder.builderFields.graph;
            res.Cstr = res.algo;
            //r.extend(res, res["demoFields"]);
            this.onChange(res);
          }.bind(this)
        }],
        fields : [{
            type : "group",
            legend : "Graph Builder",
            name : "graphBuilder",
            fields : [{
                type : "radio",
                choices : [{
                    label : "Random Graph",
                    value : this.getFields(r.GraphBuilder,  "Options for random graph", "builderFields")
                  },{
                    label : "Typical Graphs",
                    value :  {
                      type : "group",
                      name : "builderFields",
                      legend : "Fill the following",
                      fields : [{
                        label : "Available Graphs",
                        type : "select", 
                        name : "graph",
                        choices : ["Choose a typical Graph",{
                            "label" : "A-B-C chain (tree)",
                            value :  {vertices : [0,1,2], edges : [{from : 1, to : 0}, {from : 2, to : 1}]}
                          },{
                            "label" : "10 flower (tree)",
                            "value" : {
                              vertices : [0,1,2,3,4,5,6,7,8,9], 
                              edges : [1,2,3,4,5,6,7,8,9].map(function(i){
                                 return {from : i, to : 0} 
                              })
                            }
                          },{
                              "label" : "6 Bipartite graph (K3,3)",
                              "value" :  {
                                vertices : [0,1,2,3,4,5], 
                                edges : [0,1,2].map(function(i){ return [{ from : 3, to : i},{ from : 4, to : i},{ from : 5, to : i}] }).flatten() 
                              }
                          },{
                            "label" : "5 complete-graph (K5)",
                            "value" :  this.buildCompleteGraph(8)
                          },{
                            "label" : "8 complete-graph",
                            "value" :  this.buildCompleteGraph(8)
                        }]
                      }] 
                    }
                  },{
                    label : "Manual Input",
                    value : {
                      type : "group",
                      name : "builderFields",
                      legend : "Fill the following",
                      fields : [{
                        label : "Enter the graph", 
                        type : "text",
                        name : "manual",
                        description : "Example : { vertices : [0,1], edges : { from : 0, to : 1 }}"
                      }] 
                    }
                }],
                name : "mode"
              }]
          },{ 
              type : "select",
              label : "Algo",
              name : "algo",
              choices : ["Choose algorithm"].concat(algos.map(function(e){
                return {
                  label : e.label,
                  value : e.value
                };
              }))
            }]
      }); 
      
      var algoF = this.form.inputsNames["algo"];
      var gBuilder = this.form.inputsNames["graphBuilder"];
      var gBuilderMode = this.form.inputsNames["graphBuilder"].inputsNames["mode"];
       
      algoF.on("updated", this.onAlgoSelected.bind(this)); 
      gBuilderMode.on("updated", this.onGBuilderModeChange.bind(this));
    },   
    
    buildCompleteGraph : function(n){
      var a = [];
      
      for (var p = 0; p < n ; p++){
        a.push(p)
      } 
      
      return {
        vertices : a,
        edges : a.map(function(i){
            return a.where(function(j){
               return j < i;
            }).map(function(j){
               return {from : i, to : j};
            }); 
        }).flatten()
      } 
    },
    
    onGBuilderModeChange : function(){ 
      var gBuilder = this.form.inputsNames["graphBuilder"],
          gBuilderMode = gBuilder.inputsNames["mode"],
          v = gBuilderMode.getValue();
      gBuilder.removeField("builderFields");
      gBuilder.addField(v);
      
    }, 
    
    getFields : function(Cstr, label, name, value) {
      var schema = {
            "id": "Option",
            "title": label,
            "type":"object",
            _inputex : {"name" : name}
          },
          cstrOptions = Cstr.prototype.options;

      for(var i in cstrOptions) if(cstrOptions.hasOwnProperty(i)) {
        if(i.charAt(0) === "$"){
          schema.properties || (schema.properties = {}); 
          schema.properties[i.substr(1)] = cstrOptions[i];
        }
      }

      var inputExDef = (new r.inputex.JsonSchema.Builder()).schemaToInputEx(schema);
      value && (inputExDef.value = value);
      console.log(inputExDef);
      return inputExDef;      
    },
    
    onAlgoSelected : function(v,e){
      var algoF = this.form.inputsNames["algo"],
          index = algoF.fieldEl.selectedIndex-1,
          choice = algos[index], demoFields, label, defaultOptions, inputExDef,
          V = algoF.getValue();

      if(V.prototype){
        inputExDef = this.getFields(V, choice.label, "algoOpts", choice.defaultOptions);
      }
      
      this.form.inputsNames["algoOpts"] && this.form.removeField("algoOpts");
      this.form.inputsNames["demoFields"] && this.form.removeField("demoFields");  
      
      if(inputExDef){
        this.form.addField(inputExDef);
      } 
      
      if(demoFields){
        this.form.addField({ name : "demoFields", fields : demoFields, "legend" : label +" demo options", type : "group"});
      } 
    },
    
    "djson" : function(){
      return {
        children : ["div.inputex-group->groupEl","div#layout-square"]
      }
    },
    
    onChange : function(options){
      var graph = options.graph, Cstr = options.Cstr;/*vertices = [], 
          es = [],
          esIndex = {}, 
          nEdges = options.nEdges,
          Cstr = options.Cstr,
          interval = options.interval || false,
          size = options.algoOpts.size || [10,10],
          tree = Cstr.prototype.tree || false,
          n = options.n, fr, to;*/
   /*   
      for(var i = 0; i < n ; i++){
        var v = { id : i };
        if(interval){
           v.size = [
             size[0]+(Math.random()-0.5)*2*interval,
             size[1]+(Math.random()-0.5)*2*interval
           ] 
        }
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
      }*/
      
      var algoOpts = options.algoOpts || {};
      
      this.b = new Cstr(r.extend({}, algoOpts, graph));
      this.b.compute(this.layoutCallback.bind(this), {});      
      
    },
    
    layoutCallback : function(err, response){
      var vertices = response.vertices, 
          rect = response.rect || [[-500,-500],[1000,1000]],
          endDate = new Date()
          paper = this.paper;
      paper.clear();
      paper.canvas.style.WebkitTransformOrigin = "0px 0px"; 
      paper.canvas.style.WebkitTransform = "scale("+1000/rect[1].max()+")";
      
      paper.setSize(rect[1][0], rect[1][1]);
      var transform = function(pos){
        return x;
      }         
      
      var tx = function(x){
        return x-rect[0][0];
      };
      var ty = function(y){
        return y-rect[0][1];
      };
      var es = this.b.edges;
      
      es.each(function(e){
        e.redraw || (e.redraw = function(){
          var p = "M"+tx(vertices[e.from].position[0])+","+ty(vertices[e.from].position[1])+"L"+tx(vertices[e.to].position[0])+","+ty(vertices[e.to].position[1]);
          if(this.path){
            this.path.attr({"path":p});
          } else {
            this.path = paper.path(p).attr("stroke", "#f0f");
          }

        });
        e.redraw();
      });
            
      //l.bnTree && l.bnTree.drawBoxes(paper);
      vertices.each(function(v){
        v.redraw || (v.redraw = function(){
          if(!this.circle){
            var size = v.size || [20,20];
            this.circle = paper.rect(tx(v.position[0]-size[0]/2), ty(v.position[1]-size[1]/2), size[0], size[1]).attr("fill", "#f00");
            paper.text(tx(v.position[0]), ty(v.position[1]), v.id);

          } else {
            this.circle.attr({cx: tx(this.x), cy: ty(this.y)});
          }
        });
        v.redraw();
        
      }); 
    } 
  }); 
  
});