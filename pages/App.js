import React from "react";
import Table from "../components/table";
import reducer from "../redux/reducers/reducer";
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import 'semantic-ui-css/semantic.min.css';

let store = createStore(reducer);
const hi = async (x) => {
    const y = await x;
}

const getData = (rows, cols) => {
    return Array.from({ length: rows }, () => new Array(cols).fill(0));
    // [[

    // ]]
}
const settings = {
    data: getData(20, 5), //데이터를 연결
    nestedHeaders: [ //헤더부분
        ['A', {label: 'B', colspan: 3}, 'C'],
        ['D', {label: 'E', colspan: 2}, 'F', 'G'],
        ['N', 'O', 'P', 'Q', 'R']
    ],
    colHeaders: true, //true일 경우 기본 열 헤더가 존재
    rowHeaders: true, //true일 경우 기본 행 헤더가 존재
    colWidths: [200, 200, 200, 200, 200], //각 열의 크기를 지정
    columns: [ //각 컬럼의 속성과 기본 값들을 설정 가능
        {},
        {
        editor: 'select',
        selectOptions: ['Kia', 'Nissan', 'Toyota', 'Honda']
        },
        {},
        {
        type: 'numeric',
        format: '0,000',
        },
        {}
    ],
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
export default () => (
    <Provider store={store}>
        <Table />  
    </Provider>
);

// return (
//     <div className="jober-table">
//     <JOBERTABLE {...settings} />
//     </div>
//    );