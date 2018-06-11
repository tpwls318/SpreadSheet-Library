
var Tree = function(label='root', colspan=null, collapsible=false, isCollapsed=false, hidden=false){
    this.label = label;
    this.colspan = colspan;
    this.collapsible = collapsible; 
    this.isCollapsed = isCollapsed;
    this.hidden = hidden;
    this.children = [];
  };
   
Tree.prototype.BFSelect = function(filter) {
// return an array of labels for which the function filter(label, depth) returns true
    let result=[], curTrees=[];
    let depth=0;
    if( filter(this.label, depth) ) result.push(this)
    curTrees.push(this)
    const traverse =(trees)=>{
        curTrees=[];
        if(trees.length){
            depth++;
            for (const tree of trees) {
                if(tree.children){
                    for (const child of tree.children) {
                        curTrees.push(child)   
                        if( filter(child.label, depth) ) result.push(child)
                    } 
                }    
            }       
        } 
        else return 0; 
        traverse(curTrees);
    }
    traverse(curTrees);
    return result;
};
  

  Tree.prototype.addFamily = function(nestedHeaders) {
    nestedHeaders.forEach(header=>header.reverse())
    let index;
    const traverse = (child, tree) => {
      child = tree.addChild(child.label?child.label:child, child.colspan, child.collapsible, child.hidden);
      let span = child.colspan || 1;
      while ( span && index<nestedHeaders.length-1 ){
        let childHeader = nestedHeaders[++index].pop();
        traverse(childHeader, child)
        span -= childHeader.colspan? childHeader.colspan : 1;
        index--;
      }
    }
    while(nestedHeaders[0].length){
      index=0;
      traverse(nestedHeaders[index].pop(), this);
    } 
  }
Tree.prototype.addChild = function(child, colspan=null, collapsible=false, isCollapsed=false, hidden=false){
    if (!child || !(child instanceof Tree)){
      child = new Tree(child, colspan, collapsible, isCollapsed);
    }
    if(!this.isDescendant(child)){
      this.children.push(child);
    }else {
      throw new Error("That child is already a child of this tree");
    }
    // return the new child node for convenience
    return child;
  };

Tree.prototype.DFtraverse = function(iterator){
  let depth=0, maxDepth=0;
  const recursion = (tree, index, depth) => {
    if(tree.children.length){
      iterator(tree, index, depth, false);
      tree.children.forEach((child,index) => {
        recursion(child,index,depth+1);
      });
    } else {
      iterator(tree, index, depth, true);
    }
  }
  recursion(this, -1, depth);
}
  /**
    * check to see if the provided tree is already a child of this
    * tree __or any of its sub trees__
    */
  Tree.prototype.isDescendant = function(child){
    if(this.children.indexOf(child) !== -1){
      // `child` is an immediate child of this tree
      return true;
    }else{
      for(var i = 0; i < this.children.length; i++){
        if(this.children[i].isDescendant(child)){
          // `child` is descendant of this tree
          return true;
        }
      }
      return false;
    }
};
  
  /**
    * remove an immediate child
    */
Tree.prototype.removeChild = function(child){
    var index = this.children.indexOf(child);
    if(index !== -1){
      // remove the child
      this.children.splice(index,1);
    }else{
      throw new Error("That node is not an immediate child of this tree");
    }
};

export default Tree;
  