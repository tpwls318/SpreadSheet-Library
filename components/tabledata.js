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
        let minPos=[condition[0],condition[2]], maxPos=[condition[1],condition[3]];
        this.props.setSelection([minPos,maxPos])
        for (let rowI = condition[0]; rowI <= condition[1]; rowI++) {
            for (let colI = condition[2]; colI <= condition[3]; colI++) {
                // console.log('row, col :',rowI,colI);
                this.props.saveState([rowI,colI], 'selected', true)
            }   
        }
    }
    onClick = e => {
        // e.preventDefault();
        const { row, col }=this.eventToCellLocation(e);
        const { 
                changeCurCell,
                saveState,
                cellState,
                selections,
                cellStates,
                curCell,
                toggleSelectionStarted,
                setSelection, 
              } = this.props;
        // console.log('row, col, curCell: ',row, col, curCell);
        // console.log('e.type,selectionStarted: ',e.type,selectionStarted);
        if( e.ctrlKey || e.metaKey ){
            if( e.type === 'click'){
                changeCurCell([row,col]);
                saveState([row,col], 'selected', !cellState.selected)
                setSelection([[row,col],[row,col]])
                // console.log('selections,cellState',selections,cellState);
                // console.log(e.type);
            }
        }
        else if ( e.shiftKey ){
            if (e.type==='click') {
                let selections = cellStates.reduce( (acc,e,rowI) => 
                acc.concat(e.map( (e, colI) => [rowI, colI, e.selected] ).filter(e=>e.pop()) )
                 ,[]);
                setSelection(false)
                selections.forEach((position,i) => {
                    saveState(position, 'selected', false)
                }); 
                let pos=[row, col];
                // console.log('curCell,pos: ',curCell, pos);
                curCell[0]<=row ? 
                curCell[1]<=col ? this.shiftSelect('LL',...pos): this.shiftSelect('LS',...pos) :
                curCell[1]<=col ? this.shiftSelect('SL',...pos): this.shiftSelect('SS',...pos)
                // console.log('cellState',cellState);
            }
        }
        else if( e.type === 'click' || (e.type === 'mousedown' && !e.button ) || e.type === 'touchstart'){
            if( e.type !== 'click' )
                toggleSelectionStarted(true)
            
            // console.log(e.type);
            changeCurCell([row,col]);
            setSelection(false)
            selections.forEach(position => {
                saveState(position, 'selected', false)
            });
            // console.log('selections,curCell,cellState',selections, curCell,cellState,e.button);
        }         
    }
    onMouseMove = e => {
        // console.log(this.props.selectedArea);
        
        
    
        if (this.props.selectionStarted) {
            e.preventDefault();
            const { row, col }=this.eventToCellLocation(e);
            let selections = this.props.cellStates.reduce( (acc,e,rowI) => 
             acc.concat(e.map( (e, colI) => [rowI, colI, e.selected] ).filter(e=>e.pop()) )
             ,[]);
            this.props.setSelection(false)
            // console.log('selections',this.props.selections);
            selections.forEach((position,i) => {
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
    }
    deformation = (format, ...values) => {
        return format ? values.map(value=> `${value}`.split(',').join('')) : values;
    }
    onChangeCycle = (type, format, row, col, ...values) => {
        let applychange = this.props.beforeChange(type, row, col, ...this.deformation(format, ...values))
        if( applychange )
        {
            this.props.saveData([row, col], 
                applychange.value ? 
                    format ? this.formation(Number(applychange.value), format)
                            :applychange.value: values[1]);
            this.props.afterChange(type, row, col,...this.deformation(format, ...values));
        }
    }
    onChange = (e, data, format, type) => {
        let curVal, nextVal;
        e.preventDefault();
        // saveData(position, {[data.label]:data.checked});
        switch (type) {
            case 'numeric':
                curVal = format ? 
                this.formation(Number(e.target.value), format):
                e.target.value;
                break;
            case 'checkbox':
                curVal = data;
                break;
            case 'dropdown':
                curVal = data.value;
                break;
            default:
                curVal = e.target.value;
                break;
        }
        // curVal = 
        //     data? data.value: 
        //         format ? this.formation(Number(e.target.value), format):
        //         e.target.value
        return this.onChangeCycle(type, format, this.state.rowIndex, this.state.colIndex, this.props.datum, curVal, nextVal=null)

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
    eventToCellLocation = e => {
        let target;
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
        const { colWidths, datum, index, saveData, columnData, curCell, colHeaderState, cellState, selectedArea, rowIndex, colIndex} = this.props;
        let colClass = classNames({
           'col-selected': cellState.selected,
           'recent-selected': !!curCell && [this.state.rowIndex,this.state.colIndex].map((x,i)=>x===curCell[i]).every(b=>b),
           'selection-top': selectedArea.some(SA => rowIndex===SA[0][0] && colIndex>=SA[0][1] && colIndex<=SA[1][1]),
           'selection-right': selectedArea.some(SA => colIndex===SA[1][1] && rowIndex>=SA[0][0] && rowIndex<=SA[1][0]),
           'selection-bottom': selectedArea.some(SA => rowIndex===SA[1][0] && colIndex>=SA[0][1] && colIndex<=SA[1][1]),
           'selection-left': selectedArea.some(SA => colIndex===SA[0][1] && rowIndex>=SA[0][0] && rowIndex<=SA[1][0]),
        })
        switch (columnData.type) {
            case 'numeric':
                return <Td colWidths={colWidths} className={colClass} hidden={cellState.hidden}>
                    <input 
                        type={ this.state.isText ? 'text' : 'number' }
                        onFocus={(e)=>{e.preventDefault();e.target.select()}}
                        // onFocus={()=>{(this.setState(prevState=>({isText: false})));this.onClick();}}
                        onBlur={()=>(this.setState(prevState=>({isText: true})))}
                        className={'numeric '+colClass}
                        onClick={(e)=>{
                            this.setState(prevState=>({isText: false}));
                            this.onClick(e);
                        }}
                        onTouchStart={this.onClick}
                        onMouseDown={this.onClick}
                        onTouchMove={this.onMouseMove}
                        onMouseMove={this.onMouseMove}
                        onChange={(e, data)=>this.onChange(e, data, columnData.format, columnData.type)}
                        value={this.state.isText ? datum : isNaN(Number(datum))? datum.split(',').join('') : Number(datum)}                    
                    />
                </Td>
                break;
            case 'checkbox':
                return  <Td 
                            colWidths={colWidths} 
                            onClick={this.onClick}
                            onTouchStart={this.onClick}
                            onTouchMove={this.onMouseMove}
                            onTouchMove={this.onClick}
                            onMouseMove={this.onMouseMove}
                            hidden={cellState.hidden}
                        >
                            <div className={colClass} style={{height:'100%', paddingTop:'0.5em'}} >
                                <CustomCheckbox 
                                    saveData={saveData} 
                                    position={[this.state.rowIndex,this.state.colIndex]}
                                    datum={datum} 
                                    columnData={columnData} 
                                    onChange={this.onChange}
                                />
                            </div>
                        </Td>
                break;
            case 'dropdown':
                return  <Td 
                            colWidths={colWidths} 
                            onClick={this.onClick}
                            onTouchStart={this.onClick}
                            onMouseDown={this.onClick}
                            onTouchMove={this.onMouseMove}
                            onMouseMove={this.onMouseMove}
                            hidden={cellState.hidden}
                        >
                        <div className={colClass} >
                            <DropdownSelection onChange={(e,data)=>this.onChange(e,data,null,'dropdown')} datum={datum} columnData={columnData} />
                        </div>
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
                        onTouchMove={this.onMouseMove}
                        onMouseMove={this.onMouseMove}
                        value={datum}
                        hidden={cellState.hidden}
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