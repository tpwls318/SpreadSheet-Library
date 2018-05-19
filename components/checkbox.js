import React from 'react'
import { Checkbox } from 'semantic-ui-react'

const CustomCheckbox = ({onChange, datum, columnData}) => 

    <div>
    {columnData.checkOptions.map( checkOption => 
        <Checkbox className='check-box' label={checkOption} />
    )} 
    </div>


export default CustomCheckbox;