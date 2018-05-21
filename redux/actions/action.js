//Actions

const SAVE_DATA = 'SAVE_DATA';
const SAVE_STATE = 'SAVE_STATE';

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

// X Action Creators

const actionCreators = {
    saveData,
    saveState,
}

export default actionCreators;