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
    selectColumn = (e, i, colSpan, CHI) => {
        acc=0;
        console.log(Array.from({length: colSpan||1},(e,j)=>colSpan?i-colSpan+1+j:i+j));
        console.log(this.props.colHeaderState);
        
        let span = Array.from({length: colSpan||1},(e,j)=>colSpan?i-colSpan+1+j:i+j);
        if (e.target.tagName === 'I') {
            console.log('button : ',e.target.tagName, this.props.index);
            console.log('i, colSpan, CHI, span: ', i, colSpan, CHI, span);
            
            this.setState(prev=>({isExtended: !prev.isExtended}))
            span=span.slice(this.headersToSpan(this.props.nestedHeaders)[CHI][i-colSpan+1][0])
            this.props.setColHeaderState([CHI, span], 'hidden', !this.props.colHeaderState[CHI][span[0]].hidden)
        }
        else {
            if( e.ctrlKey || e.metaKey ){
                this.props.changeCurCell([`h${this.props.index}`,span]);
                this.props.setColHeaderState([CHI, span], 'selected', !this.props.colHeaderState[CHI][span[0]].selected)
            }
            else if ( e.shiftKey ){
                this.props.selections.forEach((position,i) => {
                    this.props.saveState(position, 'selected', false)
                }); 
                let length=this.props.curCell[1][0]<=span[0] ? 
                span[span.length-1]-this.props.curCell[1][0]+1:
                this.props.curCell[1][this.props.curCell[1].length-1]-span[0]+1;
                let newSpan = 
                this.props.curCell[1][0]<=span[0] ?  
                Array.from({length},(e,i)=>i+this.props.curCell[1][0]):
                Array.from({length},(e,i)=>i+span[0])

                this.props.setColHeaderState([CHI, newSpan], 'selected', !this.props.colHeaderState[CHI][newSpan[0]].selected)
                }
            else if(e.type === 'click')
            {
                this.props.changeCurCell([`h${this.props.index}`,span]);
                this.props.selections.forEach(position => {
                    this.props.saveState(position, 'selected', false)
                });
                this.props.setColHeaderState([CHI, span], 'selected', !this.props.colHeaderState[CHI][span[0]].selected)
                console.log('selections,curCell,cellState',this.props.selections, this.props.curCell,this.props.cellState);
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
    const { selectionStarted, colHeaderState, nestedHeaders } = state;
    return {
        selectionStarted,
        colHeaderState,
        nestedHeaders
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
