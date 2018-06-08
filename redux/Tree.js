
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
  
  /**
   * You shouldn't need to change anything below here, but feel free to look.
    */
  
  /**
    * add an immediate child
    * (wrap labels in Tree nodes if they're not already)
    */
  Tree.prototype.addFamily = function(nestedHeaders) {
    // let child;
    // tree.addChild(label, colspan=null, collapsible=false, isCollapsed=false)
    nestedHeaders.forEach(header=>header.reverse())
    // console.log(nestedHeaders);
    // console.log(this);
    let index;
    const traverse = (child, tree) => {
      //child => tree child
      // console.log(tree);
      
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
    // console.log(nestedHeaders);
    // console.log('after:',this);


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
// let nestedHeaders = [['', {label: '총 급여', colspan: 4, collapsible: true}, {label: '자산', colspan: 2, collapsible: false}],
// ['', '비과세 항목', {label: '과세 항목', colspan: 3, collapsible: true}, {label: '부동 자산', colspan: 2, collapsible: false}],
// ['이름', '식대', '기본급', '연장수당', '휴일수당', '승용차', '집']];

  // var root1 = new Tree(1);
  
  // root1.addFamily(nestedHeaders);
  // console.log('root1: ',root1.children[2].children[0]);
  
  // console.log('root1: ',root1);
  
  // var branch2 = root1.addChild(2);
  // var branch3 = root1.addChild(3);
  // var leaf4 = branch2.addChild(4);
  // var leaf5 = branch2.addChild(5);
  // var leaf6 = branch3.addChild(6);
  // var leaf7 = branch3.addChild(7);
  // root1.DFtraverse((e,i,depth)=>console.log(e.label,depth))
  // console.log(root1.BFSelect(function (label, depth) {
  //   return label % 2;
  // }));
  
  // [1, 3, 5, 7]
  // console.log(root1.BFSelect(function (label, depth) {
  //   return depth === 1;
  // }))
  
  // [2, 3]
export default Tree;
  