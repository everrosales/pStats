var Drawing = Drawing || {};

Drawing.PoliticalGraph = function(options) {
  var options = options || {};

  this.layout = options.layout || "3d";
  this.layout_options = options.graph_layout || {};
  this.show_stats = options.showStats || false;
  this.show_info = options.showInfo || false;
  this.show_labels = options.showLabels || false;
  this.selection = options.selection || false;
  this.limit = options.limit || 10;
  this.nodes_count = options.numNodes || 20;
  this.edges_count = options.numEdges || 10;

  var camera, controls, scene, renderer, interaction, geometry, object_selection;
  var stats;
  var step;
  var pendingRequests;
  var info_text = {};
  var graph = new Graph({limit: options.limit});

  var geometries = [];

  var partyColorMap = {
      "D": "#1E87DB", //sky blue
      "R": "#F44336", //#FF8566, light orange-red
      "I": "#009688", //turq
      "L": "#7A00A3", //purple
      "3": "#CC0052", //red
      "U": "#FF9900", //orange
  };

  var that=this;

  // document.addEventListener("DOMContentLoaded", function(event) {
  $.extend({
      getUrlVars : function() {
          var vars = [], hash;
          var hashes = window.location.href.slice(
                  window.location.href.indexOf('?') + 1).split('&');
          for ( var i = 0; i < hashes.length; i++) {
              hash = hashes[i].split('=');
              vars.push(hash[0]);
              vars[hash[0]] = hash[1];
          }
          return vars;
      },
      getUrlVar : function(name) {
          return $.getUrlVars()[name];
      }
  });

  init();
  createGraph(options.candidate_id);
    // animate();
  // });


  function init() {
    pendingRequests = 0;
    step = 0;
    // Three.js initialization
    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize( window.innerWidth, window.innerHeight );

    camera = new THREE.PerspectiveCamera(40, window.innerWidth/window.innerHeight, 1, 1000000);
    camera.position.z = 5000;

    controls = new THREE.TrackballControls(camera);

    controls.rotateSpeed = 0.5;
    controls.zoomSpeed = 5.2;
    controls.panSpeed = 1;

    controls.noZoom = false;
    controls.noPan = true;

    controls.staticMoving = false;
    controls.dynamicDampingFactor = 0.3;

    controls.keys = [ 65, 83, 68 ];

    controls.addEventListener('change', render);
    var container = document.getElementById( 'container' );
    scene = new THREE.Scene();

    /* picking scene */
    // pickingScene = new THREE.Scene();
		// pickingTexture = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight );
		// pickingTexture.minFilter = THREE.LinearFilter;
		// pickingTexture.generateMipmaps = false;

    container.appendChild( renderer.domElement );


    var material = new THREE.MeshDepthMaterial( { overdraw: 0.5 } );
    // Node geometry
    if(that.layout === "3d") {
      geometry = new THREE.CubeGeometry( 25, 25, 25 );
    } else {
      geometry = new THREE.CubeGeometry( 50, 50, 0 );
    }

    // Create node selection, if set
    if(that.selection) {
      object_selection = new THREE.ObjectSelection({
        domElement: renderer.domElement,
        selected: function(obj) {
          // display info
          if(obj != null) {
            info_text.select = "Object " + obj.id;
          } else {
            delete info_text.select;
          }
        },
        clicked: function(obj) {
          if ($.getUrlVars('id').id == obj.id) return;
          window.location.replace(SERVER + "?id=" + obj.id);
        }
      });
    }

    // document.body.appendChild( renderer.domElement );

    // Stats.js
    if(that.show_stats) {
      stats = new Stats();
      stats.domElement.style.position = 'absolute';
      stats.domElement.style.top = '0px';
      document.body.appendChild( stats.domElement );
    }

    // Create info box
    if(that.show_info) {
      var info = document.createElement("div");
      var id_attr = document.createAttribute("id");
      id_attr.nodeValue = "graph-info";
      info.setAttributeNode(id_attr);
      document.body.appendChild( info );
    }

  }

  /**
   *
   *
   */
   function createPoliticalGraph(candidate_id) {
     var info, neighbors, neighbor_url;
    //  var info_url = "http://politistats.herokuapp.com/data/candidate/info/" + candidate_id;
    if (candidate_id[0] == "N") {
      // info_url = "http://politistats.herokuapp.com/data/candidate/info/" + candidate_id;
      neighbor_url= "http://politistats.herokuapp.com/data/candidate/contributions/" + candidate_id + "/10";
      neighbor_url_out = "http://politistats.herokuapp.com/data/candidate/expenditures/" + candidate_id + "/5";
      // neighbor_url_to= "http://politistats.herokuapp.com/data/committee/expenditures/" + candidate_id + "/10";
    } else {
      // info_url = "http://politistats.herokuapp.com/data/committee/info" + candidate_id;
      neighbor_url= "http://politistats.herokuapp.com/data/committee/contributions/" + candidate_id + "/10";
      neighbor_url_out = "http://politistats.herokuapp.com/data/candidate/expenditures/" + candidate_id + "/5";
      // neighbor_url_to= "http://politistats.herokuapp.com/data/committee/expenditures/" + candidate_id + "/10";
    }
     pendingRequests++;
     $.ajax({url: neighbor_url, success: function(result) {
      //  neighbors_gathered = true;
       neighbors = result.records;
       pendingRequests--;
       createRootGraph(result.info, result.records, candidate_id);
     }, error: function(event) {
       alert("well...funny story");
     }});
   }


   function createRootGraph(info, neighbors, id) {
     var step = 0;
     var root_node = new Node(id, {label: info.name, node_party: info.party, depth: 0});
     graph.addNode(root_node);
     addPointsToGraph(root_node, neighbors, root_node);
    //  drawNode(root_node);
    //  renderChildren(root_node);
   }

   function addNegativePointsToGraph(parent_node, neighbors, root_node) {
     target_neighbor_nodes = [];
     for (var i = 0; i < neighbors.length; i++) {
       var target_depth = parent_node.data.depth + 1;

       var target_node = new Node(neighbors[i].recipient_id, { db_id: neighbors[i].recipient_id,
         node_party: neighbors[i].receipient_code, name: neighbors[i].recipient_name,
         weight: neighbors[i].amount, depth: target_depth});
       if (graph.addNode(target_node)) {
         target_node.data.title = target_node.data.name;
         parent_node.addChild(target_node, - target_node.data.weight);
         target_neighbor_nodes.push(target_node);
       }
     }
    //  renderChildren(parent_node);
    //  for (var i = 0; i < target_neighbor_nodes.length; i++) {
    //    var target_node = target_neighbor_nodes[i];
    //    if (target_node.data.depth < 2) queryAndAddNegativePoints(target_node, target_node.data.db_id || target_node.data.db_id, root_node);
    //  }
     //  renderGraph(root_node)
   }

   function addPointsToGraph(parent_node, neighbors, root_node) {
     target_neighbor_nodes = [];
     for (var i = 0; i < neighbors.length; i++) {
       var target_depth = parent_node.data.depth + 1;
       var target_node = new Node(neighbors[i].pac_id || neighbors[i].candidate_id, { db_id: neighbors[i].pac_id || neighbors[i].candidate_id,
         node_party: neighbors[i].pac_party || neighbors[i].candidate_party, name: neighbors[i].pac_name || neighbors[i].candidate_name,
         weight: neighbors[i].amount, depth: target_depth});
       if (graph.addNode(target_node)) {
         target_node.data.title = target_node.data.name;
         parent_node.addChild(target_node, target_node.data.weight);
         target_neighbor_nodes.push(target_node);
       }
     }
    //  renderChildren(parent_node);
     for (var i = 0; i < target_neighbor_nodes.length; i++) {
       var target_node = target_neighbor_nodes[i];
       if (target_node.data.depth < 2) queryAndAddPoints(target_node, target_node.data.db_id || target_node.id, root_node);
     }
    //  renderGraph(root_node)

   }

   function queryAndAddPoints(parent_node, candidate_id, root_node) {
     var info_url, neighbor_url;
     if (!candidate_id) {
       return;
     }
     if (candidate_id[0] == "N") {
      //  info_url = "http://politistats.herokuapp.com/data/candidate/info/" + candidate_id;
       neighbor_url= "http://politistats.herokuapp.com/data/candidate/contributions/" + candidate_id + "/10";
       neighbor_url_out = "http://politistats.herokuapp.com/data/candidate/expenditures/" + candidate_id + "/5";
     } else {
      //  info_url = "http://politistats.herokuapp.com/data/committee/info" + candidate_id;
       neighbor_url= "http://politistats.herokuapp.com/data/committee/contributions/" + candidate_id + "/10";
       neighbor_url_out = "http://politistats.herokuapp.com/data/candidate/expenditures/" + candidate_id + "/5";
     }
     pendingRequests++;

     $.ajax({url: neighbor_url, success: function(result) {
      //  neighbors_gathered = true;
       neighbors = result.records;
       addPointsToGraph(parent_node, neighbors, root_node);
       pendingRequests--;

       if (pendingRequests == 0)
        renderGraph(root_node);

     }, error: function(event) {
       alert("well...funny story");
     }})

     pendingRequests++;

     $.ajax({url: neighbor_url_out, success: function(result) {
      //  neighbors_gathered = true;
       neighbors = result.records;
       addNegativePointsToGraph(parent_node, neighbors, root_node);
       pendingRequests--;

       if (pendingRequests == 0)
        renderGraph(root_node);

     }, error: function(event) {
       alert("well...funny story");
     }})

   }

  /**
   * Creates a random set of nodes and edges to be rendered for the data
   *   visualization.
   */
   function createDataGraph() {
     var root_node = new Node(0, {depth: 0});
     var nodes = [];

     root_node.data.title = "This is node " + root_node.id;
     nodes.push(root_node);
     graph.addNode(root_node);

     var steps = 1;
     while(nodes.length != 0 && steps < 20) {
       var node = nodes.shift();
       var numEdges = randomFromTo(1, 10);
       for (var i = 1; i <= numEdges; i++) {
         var target_depth = node.data.depth + 1;
         var target_node = new Node(i*steps, {depth: target_depth});
         if (graph.addNode(target_node)) {
           target_node.data.title = "This is node " + target_node.id;
           node.addChild(target_node, randomFromTo(-1000,1000));
           if (!target_node.data.depth || target_node.data.depth < 5) nodes.push(target_node);
         }
       }
       steps++;
     }

     renderGraph(root_node);
     return root_node;
   }

   function renderGraph(root_node) {
     drawNode(root_node);
     renderChildren(root_node);

     that.layout_options.width = that.layout_options.width || 2000;
     that.layout_options.height = that.layout_options.height || 2000;
     that.layout_options.iterations = that.layout_options.iterations || 100000;
     that.layout_options.layout = that.layout_options.layout || that.layout;
     graph.layout = new Layout.ForceDirected(graph, that.layout_options);
     graph.layout.init();
    //  info_text.nodes = "Nodes " + graph.nodes.length;
    //  info_text.edges = "Edges " + graph.edges.length;

     animate();
   }

   function renderChildren(parent_node) {
     for (var i = 0; i < parent_node.children.length; i++) {
       var target_node = parent_node.children[i].node;
       drawNode(target_node);
      //  if (parent_node && target_node) {
         if(graph.addEdge(parent_node, target_node)) {
           drawEdge({source:parent_node, target:target_node, color:"red", weight:parent_node.children[i].weight});
         }
      //  }
     }
     for (var i = 0; i < parent_node.children.length; i++) {
       renderChildren(parent_node.children[i].node);
     }
   }

  /**
   *  Creates a graph with random nodes and edges.
   *  Number of nodes and edges can be set with
   *  numNodes and numEdges.
   */
  function createGraph(target_id) {
    // graph.layout.finished = false;
    var candidate_id = target_id || $.getUrlVar('id') || "N00030768";
    var root_node = createPoliticalGraph(candidate_id);

    // var root_node = createDataGraph();
    // drawNode(root_node);
    // renderChildren(root_node);
    //
    // graph.layout.init();
    // that.layout_options.width = that.layout_options.width || 2000;
    // that.layout_options.height = that.layout_options.height || 2000;
    // that.layout_options.iterations = that.layout_options.iterations || 100000;
    // that.layout_options.layout = that.layout_options.layout || that.layout;
    // graph.layout = new Layout.ForceDirected(graph, that.layout_options);
    // graph.layout.init();
    // info_text.nodes = "Nodes " + graph.nodes.length;
    // info_text.edges = "Edges " + graph.edges.length;
  }

  /**
   *  Create a node object and add it to the scene.
   */
  function drawNode(node) {
    console.log("drawing");
    var node_color;
    if (node && node.data && node.data.node_party) {
      console.log(node.data.node_party);
      node_color = partyColorMap[node.data.node_party] || "#C0C0C0";
    } else {
      node_color =  "#C0C0C0";
    }
    var size = Math.min(Math.max(Math.abs(node.data.subtree_weight)/10, 25), 500);
    // console.log(size);
    var node_geometry = new THREE.SphereGeometry(size/2, 32, 32);
    var draw_object = new THREE.Mesh( node_geometry, new THREE.MeshBasicMaterial( { color: node_color, opacity: 0.5 } ) );

    if(that.show_labels) {
      if(node.data.title != undefined) {
        label_object = new THREE.Label(node.data.title, {color: 0xffffff});
        label_object.translateZ(-100);
        label_object.material.color.setHex(0x000000);
      } else {
        label_object = new THREE.Label("", {color: 0xffffff});
        label_object.translateZ(-100);
        label_object.material.color.set(new THREE.Color(0xffffff));
      }
      node.data.label_object = label_object;

      console.log("cry");
      scene.add( node.data.label_object );
    }

    var area = 5000;
    draw_object.position.x = Math.floor(Math.random() * (area + area + 1) - area);
    draw_object.position.y = Math.floor(Math.random() * (area + area + 1) - area);

    if(that.layout === "3d") {
      draw_object.position.z = Math.floor(Math.random() * (area + area + 1) - area);
    }

    draw_object.id = node.id;
    node.data.draw_object = draw_object;
    node.position = draw_object.position;
    scene.add( node.data.draw_object );
    return node;
  }


  /**
   *  Create an edge object (line) and add it to the scene.
   */
  function drawEdge(edge) {
      // console.log( RGBtoHex(255, Math.min(255, 5 * edge.weight), 0));
      var label_color = edge.weight < 0 ? "red" : "green";
      material = new THREE.LineBasicMaterial({ color: label_color , opacity: 1, linewidth: 0.5 });

      var tmp_geo = new THREE.Geometry();
      tmp_geo.vertices.push(edge.source.data.draw_object.position);
      tmp_geo.vertices.push(edge.target.data.draw_object.position);

      line = new THREE.Line( tmp_geo, material, THREE.LinePieces );
      line.scale.x = line.scale.y = line.scale.z = 1;
      line.originalScale = 1;

      geometries.push(tmp_geo);

      scene.add( line );
  }


  function animate() {
    $('#loadingDiv').hide();
    requestAnimationFrame( animate );
    controls.update();
    render();
    if(that.show_info) {
      printInfo();
    }
  }


  function render() {
    // Generate layout if not finished
    if(!graph.layout.finished) {
      info_text.calc = "<span style='color: red'>Calculating layout...</span>";
      graph.layout.generate();
    } else {
      info_text.calc = "";
      // pick();
    }

    // Update position of lines (edges)
    for(var i=0; i<geometries.length; i++) {
      geometries[i].verticesNeedUpdate = true;
    }


    // Show labels if set
    // It creates the labels when this options is set during visualization
    if(that.show_labels) {
      var length = graph.nodes.length;
      for(var i=0; i<length; i++) {
        var node = graph.nodes[i];
        if(node.data.label_object != undefined) {
          node.data.label_object.position.x = node.data.draw_object.position.x;
          node.data.label_object.position.y = node.data.draw_object.position.y - 100;
          node.data.label_object.position.z = node.data.draw_object.position.z;
          node.data.label_object.lookAt(camera.position);
        } else {
          if(node.data.title != undefined) {
            console.log(node);
            var label_object = new THREE.Label(node.data.title, node.data.draw_object);
            console.log(label_object);
          } else {
            var label_object = new THREE.Label(node.id, node.data.draw_object);
          }
          node.data.label_object = label_object;
          scene.add( node.data.label_object );
        }
      }
    } else {
      var length = graph.nodes.length;
      for(var i=0; i<length; i++) {
        var node = graph.nodes[i];
        if(node.data.label_object != undefined) {
          scene.remove( node.data.label_object );
          node.data.label_object = undefined;
        }
      }
    }

    // render selection
    if(that.selection) {
      object_selection.render(scene, camera);
    }

    // update stats
    if(that.show_stats) {
      stats.update();
    }

    // render scene
    renderer.render( scene, camera );
  }

  /**
   *  Prints info from the attribute info_text.
   */
  function printInfo(text) {
    var str = '';
    for(var index in info_text) {
      if(str != '' && info_text[index] != '') {
        str += " - ";
      }
      str += info_text[index];
    }
    document.getElementById("graph-info").innerHTML = str;
  }

  // Generate random number
  function randomFromTo(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
  }

  // Stop layout calculation
  this.stop_calculating = function() {
    graph.layout.stop_calculating();
  }

  function RGBtoHex(red, green, blue) {
      var decColor = red + green * 256 + blue * 256 * 256;
      var upperTwoHex = decColor % (256 * 256);
      var lowerFourHex = decColor - (upperTwoHex * 256 * 256)

      return upperTwoHex.toString(16) + lowerFourHex.toString(16);
    }
    //
    // function pick() {
    //
		// 		//render the picking scene off-screen
    //
		// 		renderer.render( pickingScene, camera, pickingTexture );
    //
		// 		//create buffer for reading single pixel
		// 		var pixelBuffer = new Uint8Array( 4 );
    //
		// 		//read the pixel under the mouse from the texture
		// 		renderer.readRenderTargetPixels(pickingTexture, mouse.x, pickingTexture.height - mouse.y, 1, 1, pixelBuffer);
    //
		// 		//interpret the pixel as an ID
    //
		// 		var id = ( pixelBuffer[0] << 16 ) | ( pixelBuffer[1] << 8 ) | ( pixelBuffer[2] );
		// 		var data = pickingData[ id ];
    //
		// 		if ( data) {
    //
		// 			//move our highlightBox so that it surrounds the picked object
    //
		// 			if ( data.position && data.rotation && data.scale ){
    //
		// 				highlightBox.position.copy( data.position );
		// 				highlightBox.rotation.copy( data.rotation );
		// 				highlightBox.scale.copy( data.scale ).add( offset );
		// 				highlightBox.visible = true;
    //
		// 			}
    //
		// 		} else {
    //
		// 			highlightBox.visible = false;
    //
		// 		}
    //
		// 	}



}
