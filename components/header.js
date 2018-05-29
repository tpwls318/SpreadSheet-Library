import React from "react";
import styled from "styled-components";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import actionCreators from "../redux/actions/action";
let i, acc;
class Header extends React.Component {
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
    selectColumn = (e, i, colSpan) => {
        acc=0;
        for (let index=colSpan?i-colSpan+1:i; index<i+1; index++ )
        {
            if( e.ctrlKey || e.metaKey ){
            this.props.changeCurCell([`h${this.props.index}`,index]);
            Array.from({length: this.props.rowLength},(e,i)=>[i,index]).forEach( position =>
                this.props.saveState(position, 'selected', !this.props.cellState[position[0]][position[1]].selected) )
            }
            else if ( e.shiftKey ){
                this.props.selections.forEach((position,i) => {
                    this.props.saveState(position, 'selected', false)
                }); 
                this.props.curCell[1]<=index ? 
                Array.from({length: index-this.props.curCell[1]+1},(e1,i1)=>[i1,
                Array.from({length: this.props.rowLength},(e2,i2)=>[i2,i1+this.props.curCell[1]]).forEach( position =>
                    this.props.saveState(position, 'selected', true) ) ]) :
                Array.from({length: this.props.curCell[1]-index+1},(e1,i1)=>[i1,
                Array.from({length: this.props.rowLength},(e2,i2)=>[i2,i1+index]).forEach( position =>
                    this.props.saveState(position, 'selected', true) ) ])
                // console.log('cellState',this.props.cellState);
            }
            else {
                this.props.changeCurCell([`h${this.props.index}`,index]);
                this.props.selections.forEach(position => {
                    this.props.saveState(position, 'selected', false)
                });
                Array.from({length: this.props.rowLength},(e,i)=>[i,index]).forEach( position =>
                    this.props.saveState(position, 'selected', !this.props.cellState[position[0]][position[1]].selected) )
                console.log('selections,curCell,cellState',this.props.selections, this.props.curCell,this.props.cellState);
            }         
        }
    }
        
    render() {
        console.log(this.props);
        const { nestedHeader, colWidths, saveState } = this.props
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
                            colSpan={h.colspan} 
                            onClick={e=>this.selectColumn(e,this.headerIndex(nestedHeader)[index], h.colspan)}
                            key={index} 
                            >{h.label}</Th> : 
                        <Th 
                            className="columnHeaders" 
                            scope="col" 
                            colWidths={colWidths[i++]}
                            onClick={e=>this.selectColumn(e,this.headerIndex(nestedHeader)[index])} 
                            key={index} 
                            >{h}</Th>
                )}  
            </React.Fragment>
        )
    }
}

const Th = styled.th`
    width: ${props=>props.colWidths}px
`
const mapDispatchToProps = dispatch =>
    ({
        saveState: bindActionCreators(actionCreators.saveState, dispatch),
        saveData: bindActionCreators(actionCreators.saveData, dispatch),
        changeCurCell: bindActionCreators(actionCreators.changeCurCell, dispatch),
    })
export default connect(null, mapDispatchToProps)(Header);
