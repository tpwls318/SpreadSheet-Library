import React from "react";
import PropTypes from "prop-types"
import Columns from "./columns"
import Header from "./header";
import Row from "./row";
import "../styles/table";
import { connect } from 'react-redux';
import ContextMenu from "./contextMenu";
import { bindActionCreators } from "redux";
import actionCreators from "../redux/actions/action";
import styled from "styled-components";

class Table extends React.Component {
    componentDidMount = () => {
        window.addEventListener("mouseup", this.handleEnd);
        window.addEventListener("touchend", this.handleEnd);
    };
    componentWillUnmount = () => {
    window.removeEventListener("mouseup", this.handleEnd);
    window.removeEventListener("touchend", this.handleEnd);
    };
    handleEnd = () => this.props.toggleSelectionStarted(false)
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
    collectSelections = ( obj, item ) => {
        if (typeof item !== 'string') {
            for (const key in item) {
                if( typeof key === 'string' )
                    obj[key] = obj[key] ? obj[key]+1 : 1;
            }   
        }
        else obj[item] = obj[item] ? obj[item]+1 : 1
        return obj;
    }
    viewSelections = ( obj ) => {
        let result=[];
        for (const key in obj) {
            if ( obj.hasOwnProperty(key) && key!=='0') {
                result.push(` ${key}: ${obj[key]}`);
            }
        }
        return result;
    }
    binarify = (acc, obj) => {
        Object.values(obj).includes(true) ?
        acc.push(1) :
        acc.push(0)
        return acc;
    }
    groupingInToFive = (arr) => {
        let str=``;
        for (const i in arr) {
            (Number(i)+1)===arr.length ?
            str+=`${arr[i]}` :
            (Number(i)+1)%5===0 ?
            str+=`${arr[i]},&` : str+=`${arr[i]}, `
        }
        return str.split('&');
	}
	onKeyDown = e => {
		const { curCell, changeCurCell, data } = this.props;
		length=document.getElementsByClassName("recent-selected").length
		let curElement = length===1? 
		document.getElementsByClassName("recent-selected")[0] :
		document.getElementsByClassName("recent-selected")[1]

		const findParent = (curElement, nodeName) => {
			while (curElement.nodeName !== nodeName){
				curElement = curElement.parentNode;
			}
			return curElement;
		}
		const findInput = (curElement) => {
			while (curElement.nodeName !== 'INPUT'){
				curElement = curElement.childNodes[0];
			}
			return curElement;
		}
		switch (e.which) {
			case 37:
				if(curCell[1]>0) {
					changeCurCell([curCell[0],curCell[1]-1]);
					curElement = findParent(curElement, "TD");
					findInput(curElement.previousSibling).focus();
				} else if (curCell[0]>0){
					changeCurCell([curCell[0]-1,data[0].length-1]);
					curElement = findParent(curElement, "TD");
					findInput(findParent(curElement, "TR").previousSibling.lastChild).focus();
				}
				break;
			case 38:
				if(curCell[0]>0) {
					changeCurCell([curCell[0]-1,curCell[1]]);
					curElement = findParent(curElement, "TD");
					findInput(findParent(curElement, "TR").previousSibling.childNodes[curCell[1]+1]).focus();
				}
				break;
			case 39:
				if(curCell[1]<data[0].length-1) {
					changeCurCell([curCell[0],curCell[1]+1]);
					curElement = findParent(curElement, "TD");
					findInput(curElement.nextSibling).focus();
				} else if (curCell[0]<data.length-1){
					changeCurCell([curCell[0]+1,0]);
					curElement = findParent(curElement, "TD");
					findInput(findParent(curElement, "TR").nextSibling.childNodes[1]).focus();
				}
				break;
			case 40:
				if(curCell[0]<data.length-1){
					changeCurCell([curCell[0]+1,curCell[1]]);
					curElement = findParent(curElement, "TD");
					findInput(findParent(curElement, "TR").nextSibling.childNodes[curCell[1]+1]).focus();
				}
				break;
			default:
				break;
		}
    }

    render() {
        // console.log('props in Table by redux', this.props);
        const {
            data,
            nestedHeaders,
            colWidths,
            columns,
            cellState,
            curCell,
        } = this.props;
        const selections = cellState.reduce( (acc,e,rowI) => 
             acc.concat(e.map( (e, colI) => [rowI, colI, e.selected] ).filter(e=>e.pop()) )
        ,[]);
        return (
            <div style={{marginLeft:'50px',width:'850px',height:'1000px',overflow: 'scroll',border: '1.3px solid'}}>
                <ContextMenu />
				<div style={{width:'983px',height:'1185px'}}>
                <table className="table" onKeyDown={this.onKeyDown} >
                    <tbody >
                        {nestedHeaders.map(
                            (nestedHeader, index) => 
                            <Row 
                                key={index} 
                                index={index} 
                                nestedHeader={nestedHeader} 
                                colWidths={colWidths} 
                                headerLength={nestedHeaders.length} 
                                rowLength={data.length}
                                cellState={cellState}
                                selections={selections}
                                curCell={curCell}
                            />
                        )}
                        {data.map(
                            (dataInRow, index) => 
							<Row 
								formation={this.formation}
                                key={index} 
                                columnData={columns} 
                                data={dataInRow} 
                                index={index} 
                                colWidths={colWidths} 
								cellState={cellState[index]}
								cellStates={cellState}
                                selections={selections} 
                                headerLength={nestedHeaders.length} 
                                curCell={curCell}
                            />
                        )}
                        <tr>
                            <th>Sum</th>
                            {data[0].map(
                                (e, index) => 
                                columns[index].type==='dropdown' ? 
                                <Td key={index} >{ `${this.viewSelections( data.reduce( (acc,e)=> this.collectSelections( acc,e[index] ), {}) )}` }</Td> :
                                columns[index].type==='numeric' ? 
								<Td key={index} hidden={cellState[0][index].hidden}>
								{
									cellState[0][index].sum?
									this.formation(cellState.reduce( (acc,e,i)=>( acc+parseInt(`${e[index].sumTemp || e[index].sum }`.split(',').join(''))), 0),columns[index].format ):
									this.formation(data.reduce( (acc,e)=>( acc+parseInt(`${e[index]}`.split(',').join(''))), 0),columns[index].format )
								}</Td> :
                                columns[index].type==='checkbox' ? 
                                <Td key={index} className='checkbox-arr'>{ this.groupingInToFive(data.reduce( (acc,e)=> this.binarify(acc, e[index]), []))
                                .map((e,i)=><div key={i}>{e.toString()}</div>)  }</Td> :
                                <Td key={index} >{data.reduce( (acc,e)=>( acc+parseInt(e[index]) ), 0) }</Td>
                            )} 
                        </tr>
                    </tbody>
                </table> 
				</div>
            </div>
        )
    }
}
const Td = styled.td`
	text-align: center
`
Table.propTypes={
    // Header: PropTypes.Component.isRequired
}
const mapStateToProps = state => {
    const { data, nestedHeaders, colWidths, columns, cellState, curCell, selectionStarted, selectedArea, changeCurCell } = state;
    return {
        data,
        nestedHeaders,
        colWidths,
        columns,
        cellState,
        curCell,
		selectionStarted,
		selectedArea,
		changeCurCell,
    }
}
const mapDispatchToProps = dispatch =>
    ({
        saveState: bindActionCreators(actionCreators.saveState, dispatch),
        saveData: bindActionCreators(actionCreators.saveData, dispatch),
        changeCurCell: bindActionCreators(actionCreators.changeCurCell, dispatch),
        toggleSelectionStarted: bindActionCreators(actionCreators.toggleSelectionStarted, dispatch),
    })
export default connect(mapStateToProps, mapDispatchToProps)(Table);

