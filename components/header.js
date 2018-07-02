import React from "react";
import styled from "styled-components";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import actionCreators from "../redux/actions/action";
import { Icon } from 'semantic-ui-react';
let i, acc;
class Header extends React.Component {
    state = {
        isExtended: true,
    }
    sum = (arr,n) => {
        let result = arr.slice(i,i+n).reduce((acc,e)=>acc+e);
        i+=n;
        return result;
    }
    // nestedHeader [a,{label:b, colspan:3]=> {0:0,1:3}
    headerIndex = (nestedHeader) => {
        let result={}, n=0;
        nestedHeader.forEach((e,i)=>{
            result[i] = e.colspan ? n+=e.colspan-1 :n 
            n++; 
        })
        return result;
    }
    valuesToObject = (data, cols) => 
        Object.assign({},...cols.map( col=>({[col]:data.map(row=>row[col])}) ))
    selectColumn = (e, i, colSpan, CHI, index) => {
        const   { 
                    colHeaderState, 
                    data, 
                    nestedHeaders, 
                    curCell,  
                    cellState, 
                    changeCurCell, 
                    saveState, 
                    setColHeaderState,
                    beforeHeaderCollapsed,
                    afterHeaderCollapsed,
                    setSelection,
                    headerStateTree
                } = this.props;
        acc=0;
        let selections = cellState.reduce( (acc,e,rowI) => 
             acc.concat(e.map( (e, colI) => [rowI, colI, e.selected] ).filter(e=>e.pop()) )
        ,[]);
        let span = Array.from({length: colSpan||1},(e,j)=>colSpan?i-colSpan+1+j:i+j);
        let curHeaderNode = headerStateTree.BFSelect((label, depth)=>depth===CHI+1)[index];
        if (e.target.tagName === 'I') {
            let headerObj = this.valuesToObject(data, span);
            let firstChild=curHeaderNode.children[0];
            let sumOfCOls =
            beforeHeaderCollapsed(span, Object.values(headerObj), Object.entries(headerObj));
            while(firstChild.children.length) 
                firstChild=firstChild.children[0]
            let firstIndex = nestedHeaders[nestedHeaders.length-1].indexOf(firstChild.label);
            if( curHeaderNode.children[0].colspan && !curHeaderNode.children[0].isCollapsed){
                sumOfCOls.forEach((val,i) => {
                    saveState([i,firstIndex], 'sumTemp', !curHeaderNode.isCollapsed ? val: !curHeaderNode.isCollapsed )
                });
            } else{
                sumOfCOls.forEach((val,i) => {
                    saveState([i,firstIndex], 'sum', !curHeaderNode.isCollapsed ? val: !curHeaderNode.isCollapsed )
                    if(!this.state.isExtended){
                        saveState([i,firstIndex], 'sumTemp', !curHeaderNode.isCollapsed )
                    }
                }); 
            } 
            setColHeaderState([CHI, span.slice(curHeaderNode.children[0].colspan || 1), index], 'isCollapsed', !curHeaderNode.isCollapsed)
            afterHeaderCollapsed(span, Object.values(headerObj), Object.entries(headerObj));
        }
        else {
            if( e.ctrlKey || e.metaKey ){
                changeCurCell([`h${index}`,span]);
                setSelection([[0,span[0]],[data.length-1,span[span.length-1]]])
                setColHeaderState([CHI, span, index], 'selected', !curHeaderNode.selected)
            }
            else if ( e.shiftKey ){
                setSelection(false)
                selections.forEach((position,i) => {
                    saveState(position, 'selected', false)
                }); 
                let curIndex = Number(curCell[0].slice(1))
                let length=curCell[1][0]<=span[0] ? 
                span[span.length-1]-curCell[1][0]+1:
                curCell[1][curCell[1].length-1]-span[0]+1;
                let newSpan = 
                curCell[1][0]<=span[0] ?  
                Array.from({length},(e,i)=>i+curCell[1][0]):
                Array.from({length},(e,i)=>i+span[0])
                let headers = 
                curIndex >= index ?
                Array.from({length:curIndex-index+1}, (e,i)=>i+index):
                Array.from({length:index-curIndex+1}, (e,i)=>i+curIndex)
 
                setSelection([[0,newSpan[0]],[data.length-1,newSpan[newSpan.length-1]]])
                setColHeaderState([CHI, newSpan, headers], 'selected', !colHeaderState[CHI][newSpan[0]].selected)
                }
            else if(e.type === 'click')
            {   
                changeCurCell([`h${index}`,span]);
                setSelection(false)
                selections.forEach(position => {
                    saveState(position, 'selected', false)
                });
                if( !curHeaderNode.selected )
                    setSelection([[0,span[0]],[data.length-1,span[span.length-1]]])
                setColHeaderState([CHI, span, index], 'selected', !curHeaderNode.selected)
            } 
        }
    }

    foldHeader = (curHeader) => 
        curHeader.children.reduce( (acc, child) => acc+=child.hidden ? 0: (child.isCollapsed||!child.colspan) ? 1 :child.colspan ,0)

    render() {
        console.log('props in header: ',this.props);
        const { isExtended } = this.state;
        const { nestedHeader, colWidths, saveState, colHeaderState, headerStateTree, curCell } = this.props;
        const CHI = this.props.index;
        let curHeader = 
        i = 0;
        return (
            <React.Fragment>
                {nestedHeader.map(
                    (h, index) => 
                        h.label ? 
                        <Th 
                            className="columnHeaders" 
                            scope="colgroup" 
                            colWidths={this.sum(colWidths,h.colspan)} 
                            colSpan={this.foldHeader(headerStateTree.BFSelect((lable, depth)=>depth===CHI+1)[index])}
                            onClick={e=>this.selectColumn(e,this.headerIndex(nestedHeader)[index], h.colspan,CHI,index)}
                            key={index} 
                            hidden={headerStateTree.BFSelect((lable, depth)=>depth===CHI+1)[index].hidden}
                        >
                            {h.label}
                            {!h.collapsible ? null : !headerStateTree.BFSelect((lable, depth)=>depth===CHI+1)[index].isCollapsed ? 
                            <Icon color='green' name='minus circle' />:
                            <Icon color='green' name='plus circle' />
                            }
                        </Th> : 
                        <Th 
                            className={`columnHeaders ${ CHI===2 && curCell[1]===index ? 'cur-header':''}`}
                            scope="col" 
                            colWidths={colWidths[i++]}
                            onClick={e=>this.selectColumn(e,this.headerIndex(nestedHeader)[index],null,CHI, index)} 
                            key={index} 
                            hidden={headerStateTree.BFSelect((lable, depth)=>depth===CHI+1)[index].hidden}
                        >{h}</Th>
                )}  
            </React.Fragment>
        )
    }
}

const Th = styled.th`
    width: ${props=>props.colWidths}px
`
const mapStateToProps = state => {
    const { selectionStarted, colHeaderState, nestedHeaders, beforeHeaderCollapsed, afterHeaderCollapsed, data, headerStateTree } = state;
    return {
        selectionStarted,
        colHeaderState,
        nestedHeaders,
        beforeHeaderCollapsed,
        afterHeaderCollapsed,
        headerStateTree,
        data
    }
}
const mapDispatchToProps = dispatch =>
    ({
        saveState: bindActionCreators(actionCreators.saveState, dispatch),
        saveData: bindActionCreators(actionCreators.saveData, dispatch),
        changeCurCell: bindActionCreators(actionCreators.changeCurCell, dispatch),
        setColHeaderState: bindActionCreators(actionCreators.setColHeaderState, dispatch),
        setSelection: bindActionCreators(actionCreators.setSelection, dispatch),
    })
export default connect(mapStateToProps, mapDispatchToProps)(Header);
