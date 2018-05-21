import React from "react";
import styled from "styled-components";
import classNames from "classnames";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import actionCreators from "../redux/actions/action";
import DropdownSelection from "./dropdown";
import CustomCheckbox from "./checkbox";


class Columns extends React.Component {

    render() {
        const { index, data, colWidths, saveState, saveData, dispatch, columnData } = this.props;
        const rowIndex=index;
        return (
            <React.Fragment>
                <th>{rowIndex}</th>
                {data.map(
                    (datum, index) => 
                        <TableData 
                            key={index} 
                            rowIndex={rowIndex} 
                            colIndex={index} 
                            colWidths={colWidths[index]} 
                            datum={datum} 
                            saveData={saveData}
                            saveState={saveState}
                            dispatch={dispatch}
                            columnData={columnData[index]}
                            />
                )}
            </React.Fragment>
        )
    }
}
class TableData extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            isSelected: false,
            colIndex: props.colIndex,
            rowIndex: props.rowIndex,
            isText: true,
        }
    }
    onClick = async () => {
        await this.setState( prevState =>({isSelected: !prevState.isSelected}))
        this.props.saveState([this.state.rowIndex,this.state.colIndex], 'selected', this.state.isSelected)
    }
    onChange = (e, data, format) => {
        e.preventDefault();
        data ? 
        this.props.saveData([this.state.rowIndex,this.state.colIndex], data.value ):
        format ? this.props.saveData([this.state.rowIndex,this.state.colIndex], this.formation(Number(e.target.value), format) ):
        this.props.saveData([this.state.rowIndex,this.state.colIndex], e.target.value);
        // console.log(`${this.state.rowIndex},${this.state.colIndex}: ${e.target}`)
        // console.log(data.value);  
        return data ? data.value : format ? this.formation(Number(e.target.value), format) : e.target.value;
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
    render() {
        console.log('props in TableData!!!!',this.props);
        const { colWidths, datum, index, saveData, columnData } = this.props;
        let colClass = classNames({
           'col-selected': this.state.isSelected
        })
        switch (columnData.type) {
            case 'numeric':
                console.log(this.formation(Number(datum), columnData.format));
                return <Td colWidths={colWidths} draggable={true} >
                    <input 
                    type={ this.state.isText ? 'text' : 'number' }
                    // step='1' 
                    // min="1" 
                    className={'numeric '+colClass}
                    onClick={this.onClick}
                    onFocus={()=>(this.setState(prevState=>({isText: false})))}
                    onBlur={()=>(this.setState(prevState=>({isText: true})))}
                    onChange={(e, data)=>this.onChange(e, data, columnData.format)}
                    value={this.state.isText ? datum : isNaN(Number(datum))? datum.split(',').join('') : Number(datum)}
                    />
                </Td>
                break;
            case 'checkbox':
                return  <Td colWidths={colWidths} draggable={true} >
                          <CustomCheckbox 
                            saveData={saveData} 
                            position={[this.state.rowIndex,this.state.colIndex]}
                            datum={datum} 
                            columnData={columnData} 
                            />
                        </Td>
                break;
            case 'dropdown':
                return  <Td colWidths={colWidths} draggable={true} >
                        <DropdownSelection onChange={this.onChange} datum={datum} columnData={columnData} />
                    </Td>
                break;
            default:
                return <Td colWidths={colWidths} draggable={true} >
                    <input 
                    type='string' 
                    // step='1' 
                    // min="1" 
                    className={colClass}
                    onClick={this.onClick}
                    onChange={this.onChange}
                    defaultValue={datum}
                    />
                </Td>
            break;
        }
    }
}
const Td = styled.td`
    width: ${props=>props.colWidths}px
`
const mapDispatchToProps = dispatch =>
    ({
        saveState: bindActionCreators(actionCreators.saveState, dispatch),
        saveData: bindActionCreators(actionCreators.saveData, dispatch),
    })
export default connect(null, mapDispatchToProps)(Columns);
// export default Columns;