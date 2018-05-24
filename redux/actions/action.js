//Actions

const SAVE_DATA = 'SAVE_DATA';
const SAVE_STATE = 'SAVE_STATE';
const CHANGE_CUR_CELL = 'CHANGE_CUR_CELL';

//Action Creators

const saveData = (position, value) => ({
    type: SAVE_DATA,
    position,
    value
})
const saveState = (position, key, value) => ({
    type: SAVE_STATE,
    position,
    key,
    value
})
const changeCurCell = (position) => ({
    type: CHANGE_CUR_CELL,
    position,
})

// X Action Creators

const actionCreators = {
    saveData,
    saveState,
    changeCurCell,
}

export default actionCreators;