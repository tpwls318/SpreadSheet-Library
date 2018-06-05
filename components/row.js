import React from "react";
import Header from "./header";
import Columns from "./columns";

class Row extends React.Component {
    render(){
        const { 
                data, 
                nestedHeader, 
                headerLength, 
                rowLength, 
                columnData, 
                ...rest
            } = this.props;
        return (
            <tr>
                { nestedHeader && (!this.props.index && <td className="edge" rowSpan={headerLength}></td>)}
                {                     
                nestedHeader ? 
                <Header 
                    nestedHeader={nestedHeader} 
                    rowLength={rowLength}
                    {...rest}
                    /> :
                <Columns 
                    columnData={columnData} 
                    data={data} 
                    headerLength={headerLength}
                    {...rest}
                    /> 
                }
            </tr>
        )
    }
}

export default Row;