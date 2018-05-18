import React from "react";
import Header from "./header";
import Columns from "./columns";

class Row extends React.Component {
    render(){
        const { data, nestedHeader, index, colWidths, headerLength, columnData } = this.props;
        return (
            <tr>
                { headerLength && (!index && <td rowSpan={headerLength}></td>)}
                {                     
                nestedHeader ? 
                <Header nestedHeader={nestedHeader} colWidths={colWidths}/> :
                <Columns columnData={columnData} data={data} index={index} colWidths={colWidths}/> 
                }
            </tr>
        )
    }
}

export default Row;