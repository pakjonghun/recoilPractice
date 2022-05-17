import {Icon, IconButton, VStack} from '@chakra-ui/react'
import {useContext} from 'react'
import {Image, Square} from 'react-feather'
import {atomFamily, useRecoilCallback, useRecoilValue, useSetRecoilState} from 'recoil'
import {elementsState} from './Canvas'
import {defaultElement, elementState} from './components/Rectangle/Rectangle'
import {getRandomImage} from './util'

export const Toolbar = () => {
  const elements = useRecoilValue(elementsState)
  const newId = elements.length

  const addElement = useRecoilCallback(({set}) => (type: 'rectangle' | 'image') => {
    set(elementsState, (pre: number[]) => [...pre, newId])

    if (type === 'image') {
      set(elementState(newId), {
        ...defaultElement,
        style: {
          ...defaultElement.style,
          image: getRandomImage(),
        },
      })
    }
  })

  return (
    <VStack
      position="absolute"
      top="20px"
      left="20px"
      backgroundColor="white"
      padding={2}
      boxShadow="md"
      borderRadius="md"
      spacing={2}
    >
      <IconButton
        onClick={() => addElement('rectangle')}
        aria-label="Add rectangle"
        icon={<Icon style={{width: 24, height: 24}} as={Square} />}
      />

      <IconButton
        onClick={() => addElement('image')}
        aria-label="Add rectangle"
        icon={<Icon style={{width: 24, height: 24}} as={Image} />}
      />
    </VStack>
  )
}
