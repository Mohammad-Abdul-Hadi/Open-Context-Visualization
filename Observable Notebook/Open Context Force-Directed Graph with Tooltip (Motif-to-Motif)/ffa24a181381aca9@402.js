export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["mvm@1.json",new URL("./files/b8e89361f6d095943720b03de72bb11a0f157aa733ffdf9029a45d08b7b90267a973ce068cbdef4e038fee51745a32d150695e151bf3d4ae5b5260f3308a75e2",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# Open Context Force-Directed Graph with Tooltip (Motif-to-Motif)

The JSON Data for Motif-V-Motif can generated using the following [Jupyter Notbook](https://github.com/Mohammad-Abdul-Hadi/OpenContextVisualization/blob/master/Observable%20Notebook/data_for_FDG.ipynb).`
)});
  main.variable(observer("chart")).define("chart", ["data","d3","width","height","color","drag","invalidation"], function(data,d3,width,height,color,drag,invalidation)
{
  const links = data.links.map(d => Object.create(d));
  const nodes = data.nodes.map(d => Object.create(d));

  // keep track of if tooltip is hidden or not
  var isTooltipHidden = true;

  const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id))
      .force("charge", d3.forceManyBody())      
      .force("x", d3.forceX())
      .force("y", d3.forceY());

  const svg = d3.create("svg")
      .attr("viewBox", [-width / 2, -height / 2, width, height]);

  const link = svg.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line")
      .attr("stroke-width", d => Math.sqrt(d.value));

  const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
      .attr("r", 6)
      .attr("fill", color)
      .call(drag(simulation))
     .on("click", clickNode)
      ;
  
  function clickNode(node) {
       // update visibility
       isTooltipHidden = !isTooltipHidden;
       var visibility = (isTooltipHidden) ? "hidden" : "visible";

       // load tooltip content (if it changes based on node)
       loadTooltipContent(node);
       
       if (isTooltipHidden) {
         unPinNode(node);
       }
    
       // place tooltip where cursor was
       return tooltip.style("top", (d3.event.pageY -10) + "px").style("left", (d3.event.pageX + 10) + "px").style("visibility", visibility);
  }
  
  // reset nodes to not be pinned
  function unPinNode(node) {
     node.fx = null;
     node.fy = null;
  }
  
  // add html content to tooltip
  function loadTooltipContent(node) {
      var htmlContent = "<div>";
      htmlContent += "<h4>Motif Name: \"" + node.id + "\"<\/h4>"
      htmlContent += "<\/div>"
      tooltip.html(htmlContent);
  }
  
  // add tooltip to HTML body
  var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("padding", "10px")
    .style("z-index", "10")
    .style("width", "200px")
    //.style("height", "200px")
    .style("background-color", "rgba(230, 242, 255, 0.8)")
    .style("border-radius", "5px")
    .style("visibility", "hidden")
    .text("");

  node.append("title")
      .text(d => d.id);

  simulation.on("tick", () => {
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
  });

  invalidation.then(() => simulation.stop());

  return svg.node();
}
);
  main.variable(observer("data")).define("data", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("mvm@1.json").json()
)});
  main.variable(observer("height")).define("height", function(){return(
800
)});
  main.variable(observer("color")).define("color", ["d3"], function(d3)
{
  const scale = d3.scaleOrdinal(d3.schemeCategory10);
  return d => scale(d.group);
}
);
  main.variable(observer("drag")).define("drag", ["d3"], function(d3){return(
simulation => {
  
  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    
    // setting the fx values will "pin" the nodes to this position
    d.fx = d.x; 
    d.fy = d.y;
  }
  
  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }
  
  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    
    // if these are null, the simulation will relocate them
    // d.fx = null; 
    // d.fy = null;
  }
  
  return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
}
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  main.variable(observer()).define(["md"], function(md){return(
md`# Sources:

- [Can't we all get along?](http://bl.ocks.org/sxv/4491174)
- [Employees Hierarchy Chart using d3.js](https://bl.ocks.org/willzjc/a11626a31c65ba5d319fcf8b8870f281)
`
)});
  return main;
}
