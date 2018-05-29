import React from "react";

class RowHeader extends React.Component {
    state = {
        isSelected: false
    }
    onClick = async e => {
        e.preventDefault();
        const { row, col }=this.eventToCellLocation(e);
        // console.log('row, col, this.props.curCell: ',row, col, this.props.curCell);
        // console.log('e.type,this.props.selectionStarted: ',e.type,this.props.selectionStarted);
        if( e.ctrlKey || e.metaKey ){
            this.props.changeCurCell([row,'rh']);
            // console.log('selections,cellState',this.props.selections,this.props.cellState);
            if( e.type === 'click' )
                this.props.setRowHeaderState([row], 'selected', !this.props.rowHeaderState.selected)
        }
        else if (e.shiftKey){
            this.props.selections.forEach((position,i) => {
                this.props.saveState(position, 'selected', false)
            });
            const curRow = this.props.curCell[0];
            console.log('curRow<=row',curRow,this.props.rowIndex);
            
            curRow<=this.props.rowIndex ? 
            this.props.setRowHeaderState(Array.from({length: this.props.rowIndex-curRow+1}, (v, k) => k+curRow)):
            this.props.setRowHeaderState(Array.from({length: curRow-this.props.rowIndex+1}, (v, k) => k+this.props.rowIndex))
        }
        else if ( e.type==='touchmove'){
            this.props.selections.forEach((position,i) => {
                this.props.saveState(position, 'selected', false)
            }); 
            console.log(e.type, this.props.selectionStarted);
            
            const curRow = this.props.curCell[0];
            console.log('curRow<=row',curRow,row);
            
            curRow<=row ? 
            this.props.setRowHeaderState(Array.from({length: row-curRow+1}, (v, k) => k+curRow)):
            this.props.setRowHeaderState(Array.from({length: curRow-row+1}, (v, k) => k+row))
            
        }
        else if( e.type === 'click' || e.type === 'mousedown' || e.type === 'touchstart'){
            console.log(e.type);
            
            if( e.type !== 'click' )
                this.props.toggleSelectionStarted(true)
            this.props.changeCurCell([row,'rh']);
            this.props.selections.forEach(position => {
                this.props.saveState(position, 'selected', false)
            });
            console.log(this.props.selectionStarted);
            
            if( e.type === 'click' )
                this.props.setRowHeaderState([row], 'selected', !this.props.rowHeaderState.selected)
            // console.log('selections,curCell,cellState',this.props.selections, this.props.curCell,this.props.cellState);
        } 
    }
    onMouseMove = e => {
        e.preventDefault();
        const { row, col }=this.eventToCellLocation(e);
        if( this.props.selectionStarted )
        {
            this.props.selections.forEach((position,i) => {
            this.props.saveState(position, 'selected', false)
            }); 
            console.log(e.type, this.props.selectionStarted);
            
            const curRow = this.props.curCell[0];
            console.log('curRow<=row',curRow,row);
            
            curRow<=row ? 
            this.props.setRowHeaderState(Array.from({length: row-curRow+1}, (v, k) => k+curRow)):
            this.props.setRowHeaderState(Array.from({length: curRow-row+1}, (v, k) => k+row))
        }
    }
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
        return {
          row: target.parentNode.rowIndex - this.props.headerLength,
          col: target.cellIndex - 1
        };
      };
    render () {
        // console.log('props in rowheader:', this.props);
        
        return (<th 
                    onClick={this.onClick}
                    onTouchStart={this.onClick}
                    onMouseDown={this.onClick}
                    onTouchMove={this.onClick}
                    onMouseMove={this.onMouseMove}
                >{this.props.rowIndex}</th>)
    }
}

export default RowHeader;