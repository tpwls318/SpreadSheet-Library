import React from "react";

class RowHeader extends React.Component {
    state = {
        isSelected: false
    }
    onClick = async e => {
        e.preventDefault();
        const { row, col }=this.eventToCellLocation(e);
        const {
            changeCurCell,
            setRowHeaderState,
            rowHeaderState,
            selections,
            saveState,
            curCell,
            rowIndex,
            toggleSelectionStarted,
            setSelection,
        } = this.props;
        // console.log('row, col, curCell: ',row, col, curCell);
        // console.log('e.type,selectionStarted: ',e.type,selectionStarted);
        if( e.ctrlKey || e.metaKey ){
            changeCurCell([row,0]);
            if( e.type === 'click' ) {
                setRowHeaderState([row], 'selected', !rowHeaderState.selected)
                setSelection([[row,0],[row,this.props.cellState.length-1]])
            }   
        }
        else if (e.shiftKey){
            setSelection(false);
            selections.forEach((position,i) => {
                saveState(position, 'selected', false)
            });
            const curRow = curCell[0];
            
            if( curRow<=rowIndex ){
                setRowHeaderState(Array.from({length: rowIndex-curRow+1}, (v, k) => k+curRow))
                setSelection([[curRow,0],[rowIndex,this.props.cellState.length-1]])
            } else {
                setRowHeaderState(Array.from({length: curRow-rowIndex+1}, (v, k) => k+rowIndex))
                setSelection([[rowIndex,0],[curRow,this.props.cellState.length-1]])
            }
            
        }
        else if ( e.type==='touchmove'){
            setSelection(false);
            selections.forEach((position,i) => {
                saveState(position, 'selected', false)
            }); 
            // console.log(e.type, selectionStarted);
            
            const curRow = curCell[0];
            if(curRow<=row){
                setRowHeaderState(Array.from({length: row-curRow+1}, (v, k) => k+curRow))
                setSelection([[curRow,0],[row,this.props.cellState.length-1]])
            } else {
                setRowHeaderState(Array.from({length: curRow-row+1}, (v, k) => k+row))
                setSelection([[row,0],[curRow,this.props.cellState.length-1]])
            }
        }
        else if( (e.type === 'mousedown' && !e.button ) || e.type === 'touchstart'){
            toggleSelectionStarted(true)
            changeCurCell([row,0]);
            setSelection(false)
            selections.forEach(position => {
                saveState(position, 'selected', false)
            });
        } else if (e.type === 'click') {
            changeCurCell([row,0]);
            setSelection(false)
            selections.forEach(position => {
                saveState(position, 'selected', false)
            });
            setRowHeaderState([row], 'selected', !rowHeaderState.selected)
            if(!rowHeaderState.selected) setSelection([[row,0],[row,this.props.cellState.length-1]])
        }
    }
    onMouseMove = e => {
        
        if( this.props.selectionStarted )
        {
            e.preventDefault();
            const { row, col }=this.eventToCellLocation(e);
            this.props.setSelection(false)
            this.props.selections.forEach((position,i) => {
                this.props.saveState(position, 'selected', false)
            }); 
            const curRow = this.props.curCell[0];
            if(curRow<=row){
                this.props.setRowHeaderState(Array.from({length: row-curRow+1}, (v, k) => k+curRow))
                this.props.setSelection([[curRow,0],[row,this.props.cellState.length-1]])
            } else {
                this.props.setRowHeaderState(Array.from({length: curRow-row+1}, (v, k) => k+row))
                this.props.setSelection([[row,0],[curRow,this.props.cellState.length-1]])
            }
        }
    }
    eventToCellLocation = e => {
        let target;
        if (e.touches) {
          const touch = e.touches[0];
          target = document.elementFromPoint(touch.clientX, touch.clientY);
        } else {
          target = e.target;
        }
        return {
          row: target.parentNode.rowIndex - this.props.headerLength,
          col: target.cellIndex - 1
        };
      };
    render () {
        // console.log('props in rowheader:', this.props);
        return (<th 
                    className={`row-headers ${ this.props.curCell[0]===this.props.rowIndex ? 'cur-header':''}`}
                    onClick={this.onClick}
                    onTouchStart={this.onClick}
                    onMouseDown={this.onClick}
                    onTouchMove={this.onClick}
                    onMouseMove={this.onMouseMove}
                >{this.props.rowIndex}</th>)
    }
}

export default RowHeader;