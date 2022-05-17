import {Box, Text, VStack} from '@chakra-ui/layout'
import {Skeleton} from '@chakra-ui/skeleton'
import {selector, useRecoilValue} from 'recoil'
import {callApi} from '../api'
import {selectElementState} from '../Canvas'
import {elementState} from './Rectangle/Rectangle'

const imageIdState = selector({
  key: 'imageIdState',
  get: ({get}) => {
    const selectedElementId = get(selectElementState)
    if (selectedElementId == null) return

    const element = get(elementState(selectedElementId))
    if (element == null) return

    return element.style.image?.id
  },
})

const imageInfoState = selector({
  key: 'imageInfoState',
  get: ({get}) => {
    const id = get(imageIdState)
    if (id == null) return

    return callApi('image-details', {queryParams: {seed: id}})
  },
})

export const ImageInfo = () => {
  const imageDetail = useRecoilValue(imageInfoState)
  if (!imageDetail) return null
  return (
    <VStack spacing={2} alignItems="flex-start" width="100%">
      <Info label="Author" value={imageDetail.author} />
      <Info label="Image URL" value={imageDetail.url} />
    </VStack>
  )
}
export const ImageInfoFallback = () => {
  return (
    <VStack spacing={2} alignItems="flex-start" width="100%">
      <Info label="Author" />
      <Info label="Image URL" />
    </VStack>
  )
}

export const Info = ({label, value}: {label: string; value?: string}) => {
  return (
    <Box width="175px">
      <Text fontSize="14px" fontWeight="500" mb="2px">
        {label}
      </Text>
      {value === undefined ? (
        <Skeleton width="100%" height="21px" />
      ) : (
        <Text fontSize="14px">{value}</Text>
      )}
    </Box>
  )
}
