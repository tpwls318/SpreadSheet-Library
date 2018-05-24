import React from "react";
import Header from "./header";
import Columns from "./columns";

class Row extends React.Component {
    render(){
        const { 
                data, 
                nestedHeader, 
                index, 
                colWidths, 
                headerLength, 
                rowLength, 
                columnData, 
                cellState, 
                selections, 
                curCell 
            } = this.props;
        return (
            <tr>
                { headerLength && (!index && <td rowSpan={headerLength}></td>)}
                {                     
                nestedHeader ? 
                <Header 
                    nestedHeader={nestedHeader} 
                    colWidths={colWidths} 
                    rowLength={rowLength}
                    cellState={cellState}
                    selections={selections}
                    curCell={curCell}
                    index={index}
                    /> :
                <Columns 
                    columnData={columnData} 
                    data={data} 
                    index={index} 
                    colWidths={colWidths} 
                    cellState={cellState}
                    selections={selections}
                    curCell={curCell}
                    /> 
                }
            </tr>
        )
    }
}

export default Row;