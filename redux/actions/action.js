//Actions

const SAVE_DATA = 'SAVE_DATA';
const SAVE_STATE = 'SAVE_STATE';
const CHANGE_CUR_CELL = 'CHANGE_CUR_CELL';
const TOGGLE_SEL_STARTED = 'TOGGLE_SEL_STARTED';
const SET_RH_STATE = 'SET_RH_STATE';
const SET_CH_STATE = 'SET_CH_STATE';
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
const setColHeaderState = (cols, key, value, isCollapsed) => ({
    type: SET_CH_STATE,
    cols,
    key,
    value,
    isCollapsed
})

// X Action Creators

const actionCreators = {
    saveData,
    saveState,
    changeCurCell,
    toggleSelectionStarted,
    setRowHeaderState,
    setColHeaderState,
}

export default actionCreators;