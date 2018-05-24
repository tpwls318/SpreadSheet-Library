import React from "react";
import Table from "../components/table";
import reducer from "../redux/reducers/reducer";
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import 'semantic-ui-css/semantic.min.css';

let store = createStore(reducer);

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