import React from "react";
import styled from "styled-components";
import classNames from "classnames";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import actionCreators from "../redux/actions/action";
import TableData from "./tabledata";
import RowHeader from "./rowheader";

class Columns extends React.Component {
    render() {
        const { 
            index, 
            data,
            colWidths,
            columnData,
            cellState,
            rowHeaderState,
            colHeaderState,
            formation,
            ...rest
        } = this.props;
        const rowIndex=index;
        return (
            <React.Fragment>
                <RowHeader 
                    rowIndex={rowIndex} 
                    cellState={cellState} 
                    rowHeaderState={rowHeaderState[index]}
                    {...rest}
                />
                {data.map(
                    (datum, index) => 
                    cellState[index].sum ?
                        <TableData 
                            key={index} 
                            rowIndex={rowIndex} 
                            colIndex={index} 
                            colWidths={colWidths[index]} 
                            datum={formation( cellState[index].sumTemp||cellState[index].sum, columnData[index].format)} 
                            columnData={columnData[index]}
                            cellState={cellState[index]}
                            colHeaderState={colHeaderState}
                            {...rest}
                        />:
                        <TableData 
                            key={index} 
                            rowIndex={rowIndex} 
                            colIndex={index} 
                            colWidths={colWidths[index]} 
                            datum={datum} 
                            columnData={columnData[index]}
                            cellState={cellState[index]}
                            colHeaderState={colHeaderState}
                            {...rest}
                        />
                )}
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    const { selectionStarted, rowHeaderState, colHeaderState, beforeChange, afterChange, selectedArea  } = state;
    return {
        selectionStarted,
        rowHeaderState,
        colHeaderState,
        beforeChange,
        afterChange,
        selectedArea,
    }
}
const mapDispatchToProps = dispatch =>
    ({
        saveState: bindActionCreators(actionCreators.saveState, dispatch),
        saveData: bindActionCreators(actionCreators.saveData, dispatch),
        changeCurCell: bindActionCreators(actionCreators.changeCurCell, dispatch),
        toggleSelectionStarted: bindActionCreators(actionCreators.toggleSelectionStarted, dispatch),
        setRowHeaderState: bindActionCreators(actionCreators.setRowHeaderState, dispatch),
        setSelection: bindActionCreators(actionCreators.setSelection, dispatch),
    })
export default connect(mapStateToProps, mapDispatchToProps)(Columns);
