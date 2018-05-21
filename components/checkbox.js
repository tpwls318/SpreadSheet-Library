import React from 'react'
import { Checkbox } from 'semantic-ui-react'

const CustomCheckbox = ({saveData, position, datum, columnData}) => 
    <div>
    {columnData.checkOptions.map( (checkOption, index) => 
        <Checkbox className='check-box' label={checkOption} key={index} onChange={(e,data)=>saveData(position, {[data.label]:data.checked} )} />
    )} 
    </div>


export default CustomCheckbox;