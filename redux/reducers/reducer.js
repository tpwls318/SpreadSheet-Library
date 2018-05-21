// M

//Reducer
const getData = (rows, cols) => {
    return Array.from({ length: rows }, (e,i) => new Array(cols).fill(0).fill('Kia',1,2) );
    // [[
    // ]]
}
// settings
const initialState= {
    data: getData(20, 5), //데이터를 연결
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
            type: 'dropdown',
            selectOptions: ['Kia', 'Nissan', 'Toyota', 'Honda']
        },
        {
            type: 'checkbox',
            checkOptions: ['want some?']
            // checkOptions: ['bulgogi', 'kimchi', 'pajeon', 'samso']
        },
        {
            type: 'numeric',
            format: '0,000',
        },
        {}
    ],
    cellState: Array.from({ length: 20 }, (e,i) => new Array(5).fill({}) ),
    cells: (col, row) => { //각 셀의 행과 열을 받아 접근할 수 있습니다.
    //col, row로 필드에 접근할 수 있습니다.
    },
    collapsibleColumns: [ //토글 열(접었다 폈다)을 생성
        {row: -2, col: 1, collapsible: true},
        {row: -2, col: 1, collapsible: true}
        ],
    beforeChange: (changes) => { //값을 저장하기 전에 콜되는 함수
        //changes 안에는 행, 열, 이전값, 변경값이 들어있습니다.
        },
    afterChange: (changes) => { //값이 저장한 후에 콜되는 함수
        //changes 안에는 행, 열, 이전값, 변경값이 들어있습니다.
        },
    editor: 'text', //false면 수정이 불가능합니다.
    fixedRowsTop: 1, //행 하나를 고정(헤더 제외, 헤더는 항상 고정)
    fixedColumnsLeft: 1, //열 하나를 고정(헤더 제외, 헤더는 항상 고정)
}
function reducer(state = initialState, action){
    console.log(state);
    
    switch(action.type){
        case 'SAVE_DATA':
            return applySaveData(state, action.position, action.value);
        case 'SAVE_STATE':
            return applySaveState(state, action.position, action.key, action.value)
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
const applySaveState = (state, position, key, value) =>
    ({
        ...state,
        cellState: state.cellState.map((eRow,i)=>(
            i===position[0] ? eRow.map((eCol,i)=>(
                i===position[1] ? {...eCol, [key]: value} : eCol
                )          
            ) : eRow
        ))
    })

// X Reducer

export default reducer;