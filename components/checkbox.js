import React from 'react'
import { Checkbox } from 'semantic-ui-react'

const CustomCheckbox = ({saveData, position, datum, columnData, onChange}) => 
    <div>
    {columnData.checkOptions.map( (checkOption, index) => 
        <Checkbox className='check-box' label={checkOption} key={index} onChange={(e,data)=>onChange(e, {[data.label]:data.checked},null,'checkbox' )} />
    )} 
    </div>
export default CustomCheckbox;