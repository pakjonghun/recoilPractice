import {Suspense} from 'react'
import {atomFamily, useRecoilState} from 'recoil'
import {selectElementState} from '../../Canvas'
import {Drag} from '../Drag'
import {Resize} from '../Resize'
import {RectangleContainer} from './RectangleContainer'
import {RectangleInner} from './RectangleInner'
import RectangleLoading from './RectangleLoading'

export type ElementStyle = {
  position: {top: number; left: number}
  size: {width: number; height: number}
  image?: {src: string; id: number}
}

export const defaultElement = {
  style: {
    position: {
      top: 0,
      left: 0,
    },
    size: {
      width: 50,
      height: 50,
    },
  },
}

export type Element = {style: ElementStyle}

export const elementState = atomFamily<Element, number>({
  key: 'elementState',
  default: defaultElement,
})

export const Rectangle = ({id}: {id: number}) => {
  const [selectedElement, setSelectedElement] = useRecoilState(selectElementState)
  const [element, setElement] = useRecoilState(elementState(id))
  const isSelected = id === selectedElement
  return (
    <RectangleContainer
      position={element.style.position}
      size={element.style.size}
      onSelect={() => {
        setSelectedElement(id)
      }}
    >
      <Resize
        position={element.style.position}
        size={element.style.size}
        selected={isSelected}
        onResize={(style) => setElement({...element, style: {...element.style, size: style.size}})}
        lockAspectRatio={!!element.style.image}
      >
        <Drag
          position={element.style.position}
          onDrag={(position) => {
            setElement({
              style: {
                ...element.style,
                position,
              },
            })
          }}
        >
          <div>
            <Suspense fallback={<RectangleLoading selected={isSelected} />}>
              <RectangleInner selected={isSelected} id={id} />
            </Suspense>
          </div>
        </Drag>
      </Resize>
    </RectangleContainer>
  )
}
