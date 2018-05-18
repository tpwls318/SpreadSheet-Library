import React from "react";
import PropTypes from "prop-types"
import Columns from "./columns"
import Header from "./header";
import Row from "./row";
import "../styles/table";
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
    const { data, nestedHeaders, colWidths, columns } = state;
    return {
        data,
        nestedHeaders,
        colWidths,
        columns
    }
}
class Table extends React.Component {

    collectSelections = ( obj, item ) => {
        obj[item] = obj[item] ? obj[item]+1 : 1
        return obj
    }
    viewSelections = ( obj ) => {
        let result=[];
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                result.push(`${key}: ${obj[key]}`);
            }
        }
        return result;
    }

    render() {
        console.log('props in Table by redux', this.props);
        const {
            data,
            nestedHeaders,
            colWidths,
            columns
        } = this.props;
        return (
            <table className="table">
                <tbody >
                    {nestedHeaders.map(
                        (nestedHeader, index) => 
                        <Row key={index} index={index} nestedHeader={nestedHeader} colWidths={colWidths} headerLength={nestedHeaders.length}/>
                    )}
                    {data.map(
                        (dataInRow, index) => 
                        <Row key={index} columnData={columns} data={dataInRow} index={index} colWidths={colWidths}/>
                    )}
                    <tr>
                        <th>Sum</th>
                        {data[0].map(
                            (e, index) => 
                            columns[index].type==='dropdown' ? 
                            <td key={index} >{ `${this.viewSelections( data.reduce( (acc,e)=>{ console.log('acc:',acc);
                             return this.collectSelections( acc,e[index] )}, {}) )}` }</td> :
                            columns[index].type==='numeric' ? 
                            <td key={index} >{data.reduce( (acc,e)=>( acc+parseInt(`${e[index]}`.split(',').join(''))), 0) }</td> :
                            <td key={index} >{data.reduce( (acc,e)=>( acc+parseInt(e[index]) ), 0) }</td>
                        )}
                        
                    </tr>
                </tbody>
            </table> 
        )
    }
}

Table.propTypes={
    // Header: PropTypes.Component.isRequired
}

export default connect(mapStateToProps)(Table);

