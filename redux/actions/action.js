//Actions

const SAVE_DATA = 'SAVE_DATA';
const SAVE_STATE = 'SAVE_STATE';
const CHANGE_CUR_CELL = 'CHANGE_CUR_CELL';
const TOGGLE_SEL_STARTED = 'TOGGLE_SEL_STARTED';
const SET_RH_STATE = 'SET_RH_STATE';
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
const toggleSelectionStarted = (isStarted) => ({
    type: TOGGLE_SEL_STARTED,
    isStarted
})
const setRowHeaderState = (rows, key, value) => ({
    type: SET_RH_STATE,
    rows,
    key,
    value
})

// X Action Creators

const actionCreators = {
    saveData,
    saveState,
    changeCurCell,
    toggleSelectionStarted,
    setRowHeaderState,
}

export default actionCreators;