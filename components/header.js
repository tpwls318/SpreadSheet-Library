import React from "react";
import styled from "styled-components";
let i;
class Header extends React.Component {
    sum = (arr,n) => {
        let result = arr.slice(i,i+n).reduce((acc,e)=>acc+e);
        i+=n;
        console.log(`result,i,n :${result}, ${i}, ${n}`);
        return result;
    }
        
    render() {
        console.log(this.props);
        const { nestedHeader, colWidths } = this.props
        i = 0;
        return (
            <React.Fragment>
                {nestedHeader.map(
                    (h, index) => 
                        h.label ? 
                        <Th className="columnHeaders" scope="colgroup" colWidths={this.sum(colWidths,h.colspan)} colSpan={h.colspan} key={index} >{h.label}</Th> : 
                        <Th className="columnHeaders" scope="col" colWidths={colWidths[i++]} key={index} >{h}</Th>
                )}  
            </React.Fragment>
        )
    }
}

const Th = styled.th`
    width: ${props=>props.colWidths+2}px
`

export default Header;