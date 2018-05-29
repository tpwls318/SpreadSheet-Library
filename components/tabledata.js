import React from "react";
import styled from "styled-components";
import classNames from "classnames";
import DropdownSelection from "./dropdown";
import CustomCheckbox from "./checkbox";
import ContextMenu from "./contextMenu";

class TableData extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            colIndex: props.colIndex,
            rowIndex: props.rowIndex,
            isText: true,
            visible: false,
            align: null
        }
    }
    shiftSelect = (cases, row, col) => {
        let condition;
        switch (cases) {
            case 'LL':
                condition = [this.props.curCell[0],row,this.props.curCell[1],col]
                break;                
            case 'LS':
                condition = [this.props.curCell[0],row,col,this.props.curCell[1]]
                break;
            case 'SL':
                condition =  [row,this.props.curCell[0],this.props.curCell[1],col]
                break;
            case 'SS':
                condition =  [row,this.props.curCell[0],col,this.props.curCell[1]]
                break;
            default:
                break;
        }
        for (let rowI = condition[0]; rowI <= condition[1]; rowI++) {
            for (let colI = condition[2]; colI <= condition[3]; colI++) {
                console.log('row, col :',rowI,colI);
                this.props.saveState([rowI,colI], 'selected', true)
            }   
        }
    }
    onClick = async (e) => {
        e.preventDefault();
        const { row, col }=this.eventToCellLocation(e);
        // console.log('row, col, this.props.curCell: ',row, col, this.props.curCell);
        // console.log('e.type,this.props.selectionStarted: ',e.type,this.props.selectionStarted);
        if( e.ctrlKey || e.metaKey ){
            if( e.type === 'click'){
                this.props.changeCurCell([row,col]);
                this.props.saveState([row,col], 'selected', !this.props.cellState.selected)
                console.log('selections,cellState',this.props.selections,this.props.cellState);
                console.log(e.type);
            }
        }
        else if ( e.shiftKey || e.type==='touchmove' ){
            this.props.selections.forEach((position,i) => {
                this.props.saveState(position, 'selected', false)
            }); 
            // console.log(this.props.curCell);
            let pos=[row, col];
            this.props.curCell[0]<=row ? 
            this.props.curCell[1]<=col ? this.shiftSelect('LL',...pos): this.shiftSelect('LS',...pos) :
            this.props.curCell[1]<=col ? this.shiftSelect('SL',...pos): this.shiftSelect('SS',...pos)
            // console.log('cellState',this.props.cellState);
        }
        else if( e.type === 'click' || e.type === 'mousedown' || e.type === 'touchstart'){
            if( e.type !== 'click' )
                this.props.toggleSelectionStarted(true)
            this.props.changeCurCell([row,col]);
            this.props.selections.forEach(position => {
                this.props.saveState(position, 'selected', false)
            });
            console.log('selections,curCell,cellState',this.props.selections, this.props.curCell,this.props.cellState);
        }         
    }
    onMouseMove = e => {
        e.preventDefault();
        const { row, col }=this.eventToCellLocation(e);
        if (this.props.selectionStarted) {
            this.props.selections.forEach((position,i) => {
                this.props.saveState(position, 'selected', false)
            }); 
            // console.log(this.props.curCell);
            let pos=[row, col];
            this.props.curCell[0]<=row ? 
            this.props.curCell[1]<=col ? this.shiftSelect('LL',...pos): this.shiftSelect('LS',...pos) :
            this.props.curCell[1]<=col ? this.shiftSelect('SL',...pos): this.shiftSelect('SS',...pos)
            // console.log('cellState',this.props.cellState);
        }
    }
    handleTouchStartCell = e => {
        const isLeftClick = e.button === 0;
        const isTouch = e.type !== "mousedown";
        e.preventDefault();
        const { row, col } = this.eventToCellLocation(e);
        this.props.changeCurCell([row,col]);
        console.log('row, col: ',row, col);
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
    alignHandler = e => {
        this.setState(prev=>({align:e}))
    }
    handleTouchMoveCell = e => {
          e.preventDefault();
          const { row, col } = this.eventToCellLocation(e);
          console.log('row, col: ',row, col);
      };
    eventToCellLocation = e => {
        let target;
        // For touchmove and touchend events, e.target and e.touches[n].target are
        // wrong, so we have to rely on elementFromPoint(). For mouse clicks, we have
        // to use e.target.
        if (e.touches) {
          const touch = e.touches[0];
          target = document.elementFromPoint(touch.clientX, touch.clientY);
        } else {
          target = e.target;
        }
        while (target.tagName !== "TD") {
            target = target.parentNode;
          }
        return {
          row: target.parentNode.rowIndex - this.props.headerLength,
          col: target.cellIndex - 1
        };
      };
    render() {
        // console.log('props in TableData!!!!',this.props);
        const { colWidths, datum, index, saveData, columnData, curCell} = this.props;
        let colClass = classNames({
           'col-selected': this.props.cellState.selected,
           'recent-selected': !!curCell && [this.state.rowIndex,this.state.colIndex].map((x,i)=>x===curCell[i]).every(b=>b)
        })
        switch (columnData.type) {
            case 'numeric':;
                return <Td colWidths={colWidths} className={colClass}>
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
                    onTouchStart={this.onClick}
                    onMouseDown={this.onClick}
                    onTouchMove={this.onClick}
                    onMouseMove={this.onMouseMove}
                    onChange={(e, data)=>this.onChange(e, data, columnData.format)}
                    value={this.state.isText ? datum : isNaN(Number(datum))? datum.split(',').join('') : Number(datum)}
                    />
                </Td>
                break;
            case 'checkbox':
                return  <Td 
                            colWidths={colWidths} 
                            className={colClass} 
                            onClick={this.onClick}
                            onTouchStart={this.onClick}
                            onMouseDown={this.onClick}
                            onTouchMove={this.onClick}
                            onMouseMove={this.onMouseMove}
                            >
                          <CustomCheckbox 
                            saveData={saveData} 
                            position={[this.state.rowIndex,this.state.colIndex]}
                            datum={datum} 
                            columnData={columnData} 
                            />
                        </Td>
                break;
            case 'dropdown':
                return  <Td 
                            colWidths={colWidths} 
                            className={colClass} 
                            onClick={this.onClick}
                            onTouchStart={this.onClick}
                            onMouseDown={this.onClick}
                            onTouchMove={this.onClick}
                            onMouseMove={this.onMouseMove}
                            >
                        <DropdownSelection onChange={this.onChange} datum={datum} columnData={columnData} />
                    </Td>
                break;
            default:
                return <Td colWidths={colWidths} className={colClass}>
                    <input 
                    style={{textAlign: this.state.align}}
                    onFocus={()=>this.setState(prevState=>({visible: !prevState.visible}))}
                    type='text'
                    autoComplete='name' 
                    name='name'
                    className={colClass}
                    onClick={this.onClick}
                    onChange={this.onChange}
                    onTouchStart={this.onClick}
                    onMouseDown={this.onClick}
                    onTouchMove={this.onClick}
                    onMouseMove={this.onMouseMove}
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
export default TableData;