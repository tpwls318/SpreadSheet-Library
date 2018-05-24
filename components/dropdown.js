import React from 'react'
import { Dropdown } from 'semantic-ui-react'

// const options = [
//   { key: 'angular', text: 'Kia', value: 'kia' },
//   { key: 'css', text: 'Nissan', value: 'nissan' },
//   { key: 'design', text: 'Toyota', value: 'toyota' },
//   { key: 'ember', text: 'Honda', value: 'honda' },
// ]

const DropdownSelection = ({onChange, datum, columnData}) => {
  const options = columnData.selectOptions.map(e=>({key: e, text: e, value: e }));
  return (
    <Dropdown 
      style={{ minWidth: 'auto', borderRadius: 15}} 
      className='dropdown' 
      defaultValue={ options.map(e=>e.value).includes(datum) ? datum : null}
      placeholder='Cars' 
      search 
      selection 
      options={options}
      onChange={onChange}
    />)
}

export default DropdownSelection