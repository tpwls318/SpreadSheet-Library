import Tree from "../Tree";

// M

//Reducer
const getData = (rows, cols) => {
    let arr = ['김인긔','구일몽','이허용','이웅히','왕중희','박중헌','하자연','에이브','전빽길','안충봉','꺄르로스','인성멘토','이원곡','백용재','꺄재현','구준표','이슬참','','','']
    return Array.from({ length: rows }, (e,i) => new Array(cols).fill('0').fill(10000,1,2).fill(arr[i],0,1) );
    // [[
    // ]]
}
const nestedHeaders = () => [ //헤더부분
    ['', {label: '총 급여', colspan: 4, collapsible: true}, {label: '자산', colspan: 2, collapsible: false}],
    ['', '비과세 항목', {label: '과세 항목', colspan: 3, collapsible: true}, {label: '부동 자산', colspan: 2, collapsible: false}],
    ['이름', '식대', '기본급', '연장수당', '휴일수당', '승용차', '집']
];
// settings
const headerStateTree = (arr) => {
    var root = new Tree();
    root.addFamily(arr);
    return root;
}
const initialState = {
    data: getData(20, 7), //데이터를 연결
    selectionStarted: false,
    selectedArea: [[[],[]]],
    colHeaders: true, //true일 경우 기본 열 헤더가 존재
    rowHeaders: true, //true일 경우 기본 행 헤더가 존재
    colWidths: [130, 150, 100, 130, 130, 180, 100], //각 열의 크기를 지정
    columns: [ //각 컬럼의 속성과 기본 값들을 설정 가능
        {},
        {
            type: 'numeric',
            format: '0,000',
            
        },
        {
            type: 'numeric',
            format: '0,000',
            // checkOptions: ['bulgogi', 'kimchi', 'pajeon', 'samso']
        },
        {
            type: 'numeric',
            format: '0,000',
        },
        {
            type: 'numeric',
            format: '0,000',
        },
        {
            type: 'dropdown',
            selectOptions: ['Kia', 'Nissan', 'Toyota', 'Honda']
        },
        {
            type: 'checkbox',
            checkOptions: ['Own house?']
        }
    ],
    curCell: [0,0],
    cellState: Array.from({ length: 20 }, (e,i) => new Array(7).fill({}) ),
    colHeaderState: Array.from({ length: 3 }, (e,i) => new Array(7).fill({}) ),
    headerStateTree: headerStateTree(nestedHeaders()),
    nestedHeaders: nestedHeaders(),
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
        // type === undefined ? removeChar(curVal):  
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
        case 'SET_SELECTION':
            return applySetSelection(state, action.position)
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
    const [row, col] = position;
    arr[row][col] = {...arr[row][col], [key]: value}
    return arr;
}
const applySaveState = (state, position, key, value) =>
    ({
        ...state,
        cellState: changeOne(state.cellState, position, key, value)
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
const setHeaderStateTree = (tree, row, col, key, value) => {
    let curHeader;
    col = Array.isArray(col) ? col : [col];
    
    while(col.length){
        curHeader = tree.BFSelect((label, depth)=>depth===row+1)[col.pop()];
        curHeader[key] = value;
        if (key==='isCollapsed'){
            let isFirst = true;
            curHeader.DFtraverse( (child,i,depth,deepest) => {
                if( !(i===-1 || isFirst) ){
                    child.hidden=value;
                    if(!value) child.isCollapsed = value
                }
                if(deepest) isFirst=false;
            })
        } else {
            curHeader.DFtraverse( (child,i,depth,deepest) => {
                child[key]=value;
            })
        }
    }
    return tree;
}    
const applySetColHeaderState = (state, pos, key, value) => {
        switch (key) {
        case 'isCollapsed':
            return ({
                ...state,
                headerStateTree: setHeaderStateTree(state.headerStateTree, pos[0], pos[2], key, value),
                cellState: state.cellState.map((eRow)=>
                    eRow.map((eCol,i)=>pos[1].includes(i)?{...eCol,hidden: value}:eCol )
                )
            })
            break;
        default:
            return ({
                ...state,
                headerStateTree: setHeaderStateTree(state.headerStateTree, pos[0], pos[2], key, value),
                cellState: state.cellState.map((eRow)=>
                    eRow.map((eCol,i)=>pos[1].includes(i)?{...eCol,[key]: value}:eCol )
                )
            })
            break;
    }
}
// const applySetColHeaderState = (state, cols, key, value, isCollapsed) => 
//     (
//         isCollapsed?
//         {
//             ...state,
//             colHeaderState: state.colHeaderState.map((e,i)=>i===cols[0] ? e.map((e,i)=>(cols[1].includes(i)?{...e, [key]: value}:e)):e),
//             cellState: state.cellState.map((eRow)=>
//                 eRow.map((eCol,i)=>cols[1].includes(i)?({...eCol, [key]: value}):eCol )
//             )
//         }:
//         {
//             ...state,
//             headerStateTree: setHeaderStateTree(state.headerStateTree, pos[0], pos[1], key, value),
//             colHeaderState: state.colHeaderState.map((e,i)=>i===cols[0] ? e.map((e,i)=>(cols[1].includes(i)?{...e, [key]: value}:e)):e),
//             cellState: state.cellState.map((eRow)=>
//                 eRow.map((eCol,i)=>cols[1].includes(i)?({...eCol, [key]: value}):eCol )
//             )
//         }
//     )
const applySetSelection = (state, position) => ({
            ...state, 
            selectedArea: position ? toggleSelect([...state.selectedArea], position).length===state.selectedArea.length ?
            [ ...toggleSelect([...state.selectedArea], position), position]:[ ...toggleSelect([...state.selectedArea], position)]: [[[],[]]]
        })
// filter target  
const toggleSelect = (array ,target) => array.filter( e => JSON.stringify(e)!==JSON.stringify(target))
// X Reducer

export default reducer;