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
        console.log(`result,i,n :${result}, ${i}, ${n}`);
        return result;
    }
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
    
    selectColumn = (e, i, colSpan, CHI) => {
        const   { 
                    colHeaderState, 
                    index, 
                    data, 
                    nestedHeaders, 
                    curCell, 
                    selections, 
                    cellState, 
                    changeCurCell, 
                    saveState, 
                    setColHeaderState,
                    beforeHeaderCollapsed,
                    afterHeaderCollapsed,
                } = this.props;
        acc=0;
        console.log(Array.from({length: colSpan||1},(e,j)=>colSpan?i-colSpan+1+j:i+j));
        console.log(colHeaderState);
        
        let span = Array.from({length: colSpan||1},(e,j)=>colSpan?i-colSpan+1+j:i+j);
        if (e.target.tagName === 'I') {
            console.log('button : ', e.target.tagName, index);
            console.log('i, colSpan, CHI, span: ', i, colSpan, CHI, span);
            console.log('obj', this.valuesToObject(data, span));
            let headerObj = this.valuesToObject(data, span);
            let sumOfCOls =
            beforeHeaderCollapsed(span, Object.values(headerObj), Object.entries(headerObj));
            let [first, ...rest] = span;
            rest.pop();
            if(cellState.reduce( (acc,row)=> acc.map((e,i)=>Object.assign(e,row[i]))).slice(rest[0],rest[rest.length-1]+1)
            .every(e=>e.hidden===undefined ? true : e.hidden) )
            sumOfCOls.forEach((val,i) => {
                saveState([i,span[0]], 'sum', this.state.isExtended ? val: this.state.isExtended )
            }); 
            this.setState(prev=>({isExtended: !prev.isExtended}))
            span=span.slice(this.headersToSpan(nestedHeaders)[CHI][i-colSpan+1][0])
            setColHeaderState([CHI, span], 'hidden', !colHeaderState[CHI][span[0]].hidden)
            afterHeaderCollapsed(span, Object.values(headerObj), Object.entries(headerObj));
        }
        else {
            if( e.ctrlKey || e.metaKey ){
                changeCurCell([`h${index}`,span]);
                setColHeaderState([CHI, span], 'selected', !colHeaderState[CHI][span[0]].selected)
            }
            else if ( e.shiftKey ){
                selections.forEach((position,i) => {
                    saveState(position, 'selected', false)
                }); 
                let length=curCell[1][0]<=span[0] ? 
                span[span.length-1]-curCell[1][0]+1:
                curCell[1][curCell[1].length-1]-span[0]+1;
                let newSpan = 
                curCell[1][0]<=span[0] ?  
                Array.from({length},(e,i)=>i+curCell[1][0]):
                Array.from({length},(e,i)=>i+span[0])

                setColHeaderState([CHI, newSpan], 'selected', !colHeaderState[CHI][newSpan[0]].selected)
                }
            else if(e.type === 'click')
            {
                changeCurCell([`h${index}`,span]);
                selections.forEach(position => {
                    saveState(position, 'selected', false)
                });
                setColHeaderState([CHI, span], 'selected', !colHeaderState[CHI][span[0]].selected)
                console.log('selections,curCell,cellState',selections, curCell,cellState);
            } 
        }
    }
    wrap = (arr1, arr2) => {
        // arr2.reverse();
        return arr1.map((e,i)=>{
            let arr=[];
            while (e-arr2[arr2.length-1]>0 || (arr.length && e-arr2[arr2.length-1]===0) )
            { e-=arr2[arr2.length-1]; arr.push(arr2.pop()); }
            return arr.length ? arr : arr2.pop();
        })
    }
    headersToSpan = (NH, arr=[]) => {
        NH
        .map(e1=>e1.map(e2=>e2.colspan?e2.colspan:1))
        .reduce( (acc,e,i,array)=>array[arr.push(this.wrap([...acc],[...e].reverse()) )])
        console.log(arr);
        
        return arr;
    }
    foldHeader = (CHI, i, colSpan) => {
        // console.log('i-colSpan+1',i-colSpan+1,i);
        let arr=[];
        for (let j = colSpan?i-colSpan+1:i; j <= i; j++) {
            // console.log('Im here!!!!',CHI,j );
            arr.push(this.props.colHeaderState.reduce((acc,e,index)=>{
                // console.log('acc,e,index,e[j]',acc,e,index,e[j]);
                return e[j].hidden?index:acc
            },null ))
        }
        return arr.reduce((acc,e)=>(Number.isInteger(e))?acc+1:acc,0);
    }
    render() {
        console.log('props in header: ',this.props);
        const { isExtended } = this.state;
        const { nestedHeader, colWidths, saveState, colHeaderState } = this.props;
        const CHI = this.props.index;
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
                            colSpan={h.colspan-this.foldHeader(CHI, this.headerIndex(nestedHeader)[index], h.colspan)}
                            onClick={e=>this.selectColumn(e,this.headerIndex(nestedHeader)[index], h.colspan,CHI)}
                            key={index} 
                            // hidden={this.foldHeader(CHI, i, colSpan)}
                            >{h.label}
                            { isExtended ? 
                            <Icon color='green' name='minus circle' />:
                            <Icon color='green' name='plus circle' />
                            }
                          </Th> : 
                        <Th 
                            className="columnHeaders" 
                            scope="col" 
                            colWidths={colWidths[i++]}
                            onClick={e=>this.selectColumn(e,this.headerIndex(nestedHeader)[index],null,CHI)} 
                            key={index} 
                            hidden={ this.foldHeader(CHI, this.headerIndex(nestedHeader)[index], h.colspan)}
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
    const { selectionStarted, colHeaderState, nestedHeaders, beforeHeaderCollapsed, afterHeaderCollapsed, data } = state;
    return {
        selectionStarted,
        colHeaderState,
        nestedHeaders,
        beforeHeaderCollapsed,
        afterHeaderCollapsed,
        data
    }
}
const mapDispatchToProps = dispatch =>
    ({
        saveState: bindActionCreators(actionCreators.saveState, dispatch),
        saveData: bindActionCreators(actionCreators.saveData, dispatch),
        changeCurCell: bindActionCreators(actionCreators.changeCurCell, dispatch),
        setColHeaderState: bindActionCreators(actionCreators.setColHeaderState, dispatch)
    })
export default connect(mapStateToProps, mapDispatchToProps)(Header);
