import React from 'react'
import {atom, useRecoilState, useRecoilValue} from 'recoil'

const darkModeState = atom({
    key: 'darkModeState',
    default: false,
})

const CheckBox = () => {
    const [darkMode, setDarkMode] = useRecoilState(darkModeState)

    return (
        <div>
            <input onChange={(e) => setDarkMode(e.target.checked)} type="checkbox" />
        </div>
    )
}

const Button = () => {
    const darkMode = useRecoilValue(darkModeState)

    return (
        <div>
            <button style={{color: darkMode ? 'black' : 'white'}}>click</button>
        </div>
    )
}

const Example = () => {
    return (
        <div>
            <CheckBox />
            <Button />
        </div>
    )
}

export default Example
