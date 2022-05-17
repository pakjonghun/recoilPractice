import {Box, useEditable} from '@chakra-ui/react'
import {selectorFamily, useRecoilValue, useSetRecoilState} from 'recoil'
import {getBorderColor, getImageDimensions} from '../../util'
import {updateElementPropertyState} from '../../EditProperties'
import {elementState} from './Rectangle'
import {useEffect} from 'react'

const imageSizeState = selectorFamily({
  key: 'imageSizeState',
  get: (src?: string) => () => {
    if (!src) return
    return getImageDimensions(src)
  },
})

export const RectangleInner = ({selected, id}: {id: number; selected: boolean}) => {
  const element = useRecoilValue(elementState(id))
  const size = useRecoilValue(imageSizeState(element.style.image?.src))
  const setSize = useSetRecoilState(updateElementPropertyState({id, path: 'style.size'}))

  useEffect(() => {
    if (size) setSize(size)
  }, [size, id, setSize])

  return (
    <Box
      position="absolute"
      border={`1px solid ${getBorderColor(selected)}`}
      transition="0.1s border-color ease-in-out"
      width="100%"
      height="100%"
      display="flex"
      padding="2px"
    >
      <Box
        flex="1"
        border="3px dashed #101010"
        borderRadius="255px 15px 225px 15px/15px 225px 15px 255px"
        backgroundColor="white"
        backgroundImage={`url(${element.style.image?.src})`}
        backgroundSize="cover"
      />
    </Box>
  )
}
