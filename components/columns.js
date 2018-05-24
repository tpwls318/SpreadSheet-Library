import React from "react";
import styled from "styled-components";
import classNames from "classnames";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import actionCreators from "../redux/actions/action";
import DropdownSelection from "./dropdown";
import CustomCheckbox from "./checkbox";
import ContextMenu from "./contextMenu";

class Columns extends React.Component {

    render() {
        const { 
            index, 
            data,
            colWidths,
            columnData,
            cellState,
            selections,
            curCell,
            dispatch,
            saveState,
            saveData,
            changeCurCell,
        } = this.props;
        const rowIndex=index;
        return (
            <React.Fragment>
                <th>{rowIndex}</th>
                {data.map(
                    (datum, index) => 
                        <TableData 
                            key={index} 
                            rowIndex={rowIndex} 
                            colIndex={index} 
                            colWidths={colWidths[index]} 
                            datum={datum} 
                            columnData={columnData[index]}
                            cellState={cellState[index]}
                            selections={selections}
                            curCell={curCell}
                            dispatch={dispatch}
                            saveData={saveData}
                            saveState={saveState}
                            changeCurCell={changeCurCell}
                            />
                )}
            </React.Fragment>
        )
    }
}
class TableData extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            isSelected: props.cellState.selected || false,
            colIndex: props.colIndex,
            rowIndex: props.rowIndex,
            isText: true,
            visible: false,
            align: null
        }
    }
    onClick = async (e) => {
        const shiftSelect = (cases) => {
            let condition;
            switch (cases) {
                case 'LL':
                    condition = [this.props.curCell[0],this.state.rowIndex,this.props.curCell[1],this.state.colIndex]
                    break;                
                case 'LS':
                    condition = [this.props.curCell[0],this.state.rowIndex,this.state.colIndex,this.props.curCell[1]]
                    break;
                case 'SL':
                    condition =  [this.state.rowIndex,this.props.curCell[0],this.props.curCell[1],this.state.colIndex]
                    break;
                case 'SS':
                    condition =  [this.state.rowIndex,this.props.curCell[0],this.state.colIndex,this.props.curCell[1]]
                    break;
                default:
                    break;
            }
            for (let rowI = condition[0]; rowI <= condition[1]; rowI++) {
                for (let colI = condition[2]; colI <= condition[3]; colI++) {
                    console.log('row, col :',rowI,colI);
                    this.props.saveState([rowI,colI], 'selected', true)
                }   
            };
            console.log('cases,condition!!!!!!:',cases,condition);
            
        }
        if( e.ctrlKey || e.metaKey ){
            this.props.changeCurCell([this.state.rowIndex,this.state.colIndex]);
            // await this.setState( prevState =>({isSelected: !prevState.isSelected}))
            this.props.saveState([this.state.rowIndex,this.state.colIndex], 'selected', !this.props.cellState.selected)
            console.log('selections,cellState,isSelected',this.props.selections,this.props.cellState, this.state.isSelected);
        }
        else if ( e.shiftKey ){
            this.props.selections.forEach((position,i) => {
                this.props.saveState(position, 'selected', false)
            }); 
            this.props.curCell[0]<=this.state.rowIndex ? 
            this.props.curCell[1]<=this.state.colIndex ? shiftSelect('LL'): shiftSelect('LS') :
            this.props.curCell[1]<=this.state.colIndex ? shiftSelect('SL'): shiftSelect('SS')
            console.log('cellState,isSelected',this.props.cellState, this.state.isSelected);
        }
        else {
            this.props.changeCurCell([this.state.rowIndex,this.state.colIndex]);
            this.props.selections.forEach(position => {
                this.props.saveState(position, 'selected', false)
            });
            console.log('selections,curCell,cellState,isSelected',this.props.selections, this.props.curCell,this.props.cellState, this.state.isSelected);
        }         
    }
    onChange = (e, data, format) => {
        e.preventDefault();
        data ? 
        this.props.saveData([this.state.rowIndex,this.state.colIndex], data.value ):
        format ? this.props.saveData([this.state.rowIndex,this.state.colIndex], this.formation(Number(e.target.value), format) ):
        this.props.saveData([this.state.rowIndex,this.state.colIndex], e.target.value);
        // console.log(`${this.state.rowIndex},${this.state.colIndex}: ${e.target}`)
        // console.log(data.value);  
        return data ? data.value : format ? this.formation(Number(e.target.value), format) : e.target.value;
    };
    formation = (number, format) => {
        let f=format.split(',').pop().length
        let formattedNumber='';
        if(number>=Math.pow(10,f)){
            let tmp=number%Math.pow(10,f)+'';
            while ( tmp.length < 3 ){
                tmp=`0${tmp}`;
            }
            formattedNumber+=`,${tmp}`;
            number=(number-number%Math.pow(10,f))/Math.pow(10,f);
            formattedNumber= this.formation(number,format)+formattedNumber;
        }
        else formattedNumber=number+formattedNumber;
        return formattedNumber;
    }
    alignHandler = (e) => {
        this.setState(prev=>({align:e}))
    }
    render() {
        // console.log('props in TableData!!!!',this.props);
        const { colWidths, datum, index, saveData, columnData, curCell} = this.props;
        let colClass = classNames({
           'col-selected': this.props.cellState.selected,
           'recent-selected': !!curCell && [this.state.rowIndex,this.state.colIndex].map((x,i)=>x===curCell[i]).every(b=>b)
        })
        switch (columnData.type) {
            case 'numeric':;
                return <Td colWidths={colWidths} draggable={true} className={colClass}>
                    <input 
                    type={ this.state.isText ? 'text' : 'number' }
                    // step='1' 
                    // min="1" 
                    // onFocus={()=>{(this.setState(prevState=>({isText: false})));this.onClick();}}
                    onBlur={()=>(this.setState(prevState=>({isText: true})))}
                    className={'numeric '+colClass}
                    onClick={(e)=>{
                        this.setState(prevState=>({isText: false}));
                        this.onClick(e);
                    }}
                    onChange={(e, data)=>this.onChange(e, data, columnData.format)}
                    value={this.state.isText ? datum : isNaN(Number(datum))? datum.split(',').join('') : Number(datum)}
                    />
                </Td>
                break;
            case 'checkbox':
                return  <Td colWidths={colWidths} draggable={true} >
                          <CustomCheckbox 
                            saveData={saveData} 
                            position={[this.state.rowIndex,this.state.colIndex]}
                            datum={datum} 
                            columnData={columnData} 
                            />
                        </Td>
                break;
            case 'dropdown':
                return  <Td colWidths={colWidths} draggable={true} >
                        <DropdownSelection onChange={this.onChange} datum={datum} columnData={columnData} />
                    </Td>
                break;
            default:
                return <Td colWidths={colWidths} draggable={true} className={colClass}>
                    <input 
                    ref={ref => {this.col = ref}}
                    style={{textAlign: this.state.align}}
                    onContextMenu={(e)=>{e.preventDefault();this.setState(prevState=>({visible: !prevState.visible}))}}
                    onFocus={()=>this.setState(prevState=>({visible: !prevState.visible}))}
                    type='text'
                    autoComplete='name' 
                    name='name'
                    className={colClass}
                    onClick={this.onClick}
                    onChange={this.onChange}
                    defaultValue={datum}
                    />
                </Td>
            break;
        }
    }
}
const Td = styled.td`
    width: ${props=>props.colWidths}px
`
const mapDispatchToProps = dispatch =>
    ({
        saveState: bindActionCreators(actionCreators.saveState, dispatch),
        saveData: bindActionCreators(actionCreators.saveData, dispatch),
        changeCurCell: bindActionCreators(actionCreators.changeCurCell, dispatch),
    })
export default connect(null, mapDispatchToProps)(Columns);
