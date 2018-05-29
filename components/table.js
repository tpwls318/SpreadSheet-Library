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
            if (obj.hasOwnProperty(key)) {
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

    render() {
        console.log('props in Table by redux', this.props);
        const {
            data,
            nestedHeaders,
            colWidths,
            columns,
            cellState,
            curCell
        } = this.props;
        const selections = cellState.reduce( (acc,e,rowI) => 
             acc.concat(e.map( (e, colI) => [rowI, colI, e.selected] ).filter(e=>e.pop()) )
        ,[]).filter(e=>e.length);
        
        return (
            <div style={{overflowX: 'auto'}}>
                <ContextMenu />
                <table className="table">
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
                                key={index} 
                                columnData={columns} 
                                data={dataInRow} 
                                index={index} 
                                colWidths={colWidths} 
                                cellState={cellState[index]}
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
                                <td key={index} >{ `${this.viewSelections( data.reduce( (acc,e)=> this.collectSelections( acc,e[index] ), {}) )}` }</td> :
                                columns[index].type==='numeric' ? 
                                <td key={index} >{this.formation(data.reduce( (acc,e)=>( acc+parseInt(`${e[index]}`.split(',').join(''))), 0),columns[index].format )}</td> :
                                columns[index].type==='checkbox' ? 
                                <td key={index} className='checkbox-arr'>{ this.groupingInToFive(data.reduce( (acc,e)=> this.binarify(acc, e[index]), []))
                                .map((e,i)=><div key={i}>{e.toString()}</div>)  }</td> :
                                <td key={index} >{data.reduce( (acc,e)=>( acc+parseInt(e[index]) ), 0) }</td>
                            )}
                            
                        </tr>
                    </tbody>
                </table> 
            </div>
        )
    }
}

Table.propTypes={
    // Header: PropTypes.Component.isRequired
}
const mapStateToProps = state => {
    const { data, nestedHeaders, colWidths, columns, cellState, curCell, selectionStarted } = state;
    return {
        data,
        nestedHeaders,
        colWidths,
        columns,
        cellState,
        curCell,
        selectionStarted,
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

