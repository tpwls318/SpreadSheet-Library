//Actions

const SAVE_DATA = 'SAVE_DATA';

//Action Creators

const saveData = (position, value) => ({
    type: SAVE_DATA,
    position,
    value
})

// X Action Creators

const actionCreators = {
    saveData,
}

export default actionCreators;