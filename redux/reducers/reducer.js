// M

//Reducer
const getData = (rows, cols) => {
    return Array.from({ length: rows }, (e,i) => new Array(cols).fill('0').fill(10000,1,2) );
    // [[
    // ]]
}
// settings
const initialState= {
    data: getData(20, 5), //데이터를 연결
    selectionStarted: false,
    nestedHeaders: [ //헤더부분
        ['A', {label: 'B', colspan: 3}, 'C'],
        ['D', {label: 'E', colspan: 2}, 'F', 'G'],
        ['N', 'O', 'P', 'Q', 'R']
    ],
    colHeaders: true, //true일 경우 기본 열 헤더가 존재
    rowHeaders: true, //true일 경우 기본 행 헤더가 존재
    colWidths: [200, 100, 150, 200, 250], //각 열의 크기를 지정
    columns: [ //각 컬럼의 속성과 기본 값들을 설정 가능
        {},
        {
            type: 'numeric',
            format: '0,000',
            // type: 'dropdown',
            // selectOptions: ['Kia', 'Nissan', 'Toyota', 'Honda']
        },
        {
            type: 'numeric',
            format: '0,000',
            // type: 'checkbox',
            // checkOptions: ['want some?']
            // checkOptions: ['bulgogi', 'kimchi', 'pajeon', 'samso']
        },
        {
            type: 'numeric',
            format: '0,000',
        },
        {}
    ],
    curCell: null,
    cellState: Array.from({ length: 20 }, (e,i) => new Array(5).fill({}) ),
    colHeaderState: Array.from({ length: 3 }, (e,i) => new Array(5).fill({}) ),
    rowHeaderState: new Array(20).fill({selected: false}),
    cells: (col, row) => { //각 셀의 행과 열을 받아 접근할 수 있습니다.
    //col, row로 필드에 접근할 수 있습니다.
    },
    collapsibleColumns: [ //토글 열(접었다 폈다)을 생성
        {row: -2, col: 1, collapsible: true},
        {row: -2, col: 1, collapsible: true},
    ],
    beforeChange: (type, row, col, prevVal, curVal) => {
        //값을 저장하기 전에 콜되는 함수
        //changes 안에는 행, 열, 이전값, 변경값이 들어있습니다.
        const removeChar = (str) => {
			let result='';
            for (let e of str) {
                if( !isNaN(Number(e)) )
                   result+=e;
            }
            return result;
        }
        console.log('beforeChange: ');
        let nextVal={};
        nextVal['value'] =
        type === 'numeric' ? `${Math.round(Number(curVal)/10)*10}`:
        type === undefined ? removeChar(curVal):  
        curVal
        console.log(`
            row: ${row}, 
            col: ${col}, 
            prevVal: ${prevVal}, 
            curVal: ${curVal}, 
            nextVal: ${nextVal.value},
            type: ${type}
            `);
        return nextVal;
        // return !isNaN(Number(curVal))
    },
    afterChange: (row, col, prevVal, curVal) => { //값이 저장한 후에 콜되는 함수
        //changes 안에는 행, 열, 이전값, 변경값이 들어있습니다.
        console.log('afterChange');
    },
    beforeHeaderCollapsed: ( columns, values, entries) => { //값을 저장하기 전에 콜되는 함수
        //changes 안에는 행, 열, 이전값, 변경값이 들어있습니다.
        console.log('columns, values, entries: ',columns, values, entries);
        // console.log(values.reduce( (acc, col) => 
        // acc.map((row,i)=>row+Number(col[i].split(',').join('')))));
        
        return values.reduce( (acc, col) => 
        acc.map((row,i)=>Number(`${row}`.split(',').join(''))+Number(col[i].split(',').join(''))));
    },
    afterHeaderCollapsed: ( columns, values, entries) => { //값이 저장한 후에 콜되는 함수
        //changes 안에는 행, 열, 이전값, 변경값이 들어있습니다.
    },
    editor: 'text', //false면 수정이 불가능합니다.
    fixedRowsTop: 1, //행 하나를 고정(헤더 제외, 헤더는 항상 고정)
    fixedColumnsLeft: 1, //열 하나를 고정(헤더 제외, 헤더는 항상 고정)
}
function reducer(state = initialState, action){
    switch(action.type){
        case 'SAVE_DATA':
            return applySaveData(state, action.position, action.value);
        case 'SAVE_STATE':
            return applySaveState(state, action.position, action.key, action.value)
        case 'CHANGE_CUR_CELL':
            return applyChangeCurCell(state, action.position)
        case 'TOGGLE_SEL_STARTED':
            return applyToggleSelectionStarted(state, action.isStarted)
        case 'SET_RH_STATE':
            return applySetRowHeaderState(state, action.rows, action.key, action.value)
        case 'SET_CH_STATE':
            return applySetColHeaderState(state, action.cols, action.key, action.value, action.isCollapsed)
        default:
            return state;  
    }
}

//Reducer Functions
const applySaveData = (state, position, value) =>
    ({
        ...state,
        data: state.data.map((e,i)=>(
            i===position[0] ? e.map((e,i)=>(
                i===position[1] ? value : e
                )          
            ) : e
        )),
    })
const changeOne = (arr, position, key, value) => {
    let newArr = [...arr];
    const [row, col] = position;
    newArr[row][col] = {...newArr[row][col], [key]: value}
    return newArr;
}
const applySaveState = (state, position, key, value) =>
    ({
        ...state,
        cellState: changeOne([...state.cellState], position, key, value)
        // state.cellState.map((eRow,i)=>(
        //     i===position[0] ? eRow.map((eCol,i)=>(
        //         i===position[1] ? {...eCol, [key]: value} : eCol
        //         )          
        //     ) : eRow
        // ))
    })
const applyChangeCurCell = (state, position) =>
    ({
        ...state,
        curCell: position,
    })
const applyToggleSelectionStarted = (state, isStarted) => 
    ({
        ...state,
        selectionStarted: isStarted
    })
const applySetRowHeaderState = (state, rows, key, value) => 
    (
        !key?
        {
            ...state,
            rowHeaderState: state.rowHeaderState.map((e,i)=>({...e, selected: rows.includes(i)})),
            cellState: state.cellState.map((eRow,i)=>
                rows.includes(i)?
                eRow.map(eCol=>({...eCol, selected: true}) ) :
                eRow 
            )
        }:
        {
            ...state,
            rowHeaderState: state.rowHeaderState.map((e,i)=>(rows.includes(i)?{...e, [key]: value}:e)),
            cellState: state.cellState.map((eRow,i)=>
                rows.includes(i)?
                eRow.map(eCol=>({...eCol, [key]: value}) ) :
                eRow 
            )
            }
)
const applySetColHeaderState = (state, cols, key, value, isCollapsed) => 
    (
        isCollapsed?
        {
            ...state,
            colHeaderState: state.colHeaderState.map((e,i)=>i===cols[0] ? e.map((e,i)=>(cols[1].includes(i)?{...e, [key]: value}:e)):e),
            cellState: state.cellState.map((eRow)=>
                eRow.map((eCol,i)=>cols[1].includes(i)?({...eCol, [key]: value}):eCol )
            )
        }:
        {
            ...state,
            colHeaderState: state.colHeaderState.map((e,i)=>i===cols[0] ? e.map((e,i)=>(cols[1].includes(i)?{...e, [key]: value}:e)):e),
            cellState: state.cellState.map((eRow)=>
                eRow.map((eCol,i)=>cols[1].includes(i)?({...eCol, [key]: value}):eCol )
            )
        }
)
// X Reducer

export default reducer;