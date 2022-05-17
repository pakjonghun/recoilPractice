import {createContext, useState} from 'react'
import {atom, useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil'
import {Element, Rectangle} from './components/Rectangle/Rectangle'
import EditProperties from './EditProperties'
import {PageContainer} from './PageContainer'
import {Toolbar} from './Toolbar'

export const elementsState = atom<number[]>({
    key: 'elementsState',
    default: [],
})

export const selectElementState = atom<null | number>({
    key: 'selectElementState',
    default: null,
})

function Canvas() {
    const elements = useRecoilValue(elementsState)
    const setSelectedElement = useSetRecoilState(selectElementState)

    return (
        <PageContainer
            onClick={() => {
                setSelectedElement(null)
            }}
        >
            <Toolbar />
            <EditProperties />
            {elements.map((id) => (
                <Rectangle key={id} id={id} />
            ))}
        </PageContainer>
    )
}

export default Canvas
