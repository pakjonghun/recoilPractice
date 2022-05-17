import {
  InputGroup,
  InputRightElement,
  NumberInput,
  NumberInputField,
  SelectField,
  Text,
  VStack,
} from '@chakra-ui/react'
import {
  selector,
  selectorFamily,
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
} from 'recoil'
import {selectElementState} from './Canvas'
import {Element, elementState} from './components/Rectangle/Rectangle'
import {produce} from 'immer'
import _ from 'lodash'
import {ImageInfo, ImageInfoFallback} from './components/ImageInfo'
import {Suspense} from 'react'

export const updateElementPropertyState = selectorFamily<
  any,
  {id: number; path: string}
>({
  key: 'updateElementPropertyState',
  get:
    ({path, id}) =>
    ({get}) => {
      const element = get(elementState(id))
      return _.get(element, path)
    },
  set:
    ({path, id}) =>
    ({get, set}, newValue) => {
      const atomKey = elementState(id)
      const newElement = produce(get(atomKey), (draft) => {
        _.set(draft, path, newValue)
      })

      set(atomKey, newElement)
    },
})

const hasImageState = selector({
  key: 'hasImageState',
  get: ({get}) => {
    const selectedElementId = get(selectElementState)
    if (selectedElementId == null) return

    const selectedElement = get(elementState(selectedElementId))
    if (selectedElement == null) return

    return !!selectedElement.style.image
  },
})

const resizeState = selectorFamily<
  any,
  {dimenion: 'width' | 'height'; id: number}
>({
  key: 'resizeState',
  get:
    ({dimenion, id}) =>
    ({get}) => {
      return get(
        updateElementPropertyState({id, path: `style.size.${dimenion}`}),
      )
    },
  set:
    ({dimenion, id}) =>
    ({get, set}, newValue) => {
      if (!newValue) return

      const hasImage = !!get(elementState(id)).style.image
      if (hasImage) {
        const size = updateElementPropertyState({id, path: 'style.size'})

        const {width, height} = get(size)
        const ratio = width / height

        if (dimenion === 'width') {
          set(size, {width: newValue, height: Math.round(newValue / ratio)})
        } else {
          set(size, {width: Math.round(ratio * newValue), height: newValue})
        }

        return
      }

      set(
        updateElementPropertyState({id, path: `style.image.size${dimenion}`}),
        newValue,
      )
    },
})

export const EditProperties = () => {
  const selectedElement = useRecoilValue(selectElementState)
  const hasImage = useRecoilValue(hasImageState)
  if (selectedElement == null) return null

  return (
    <Card>
      <Section heading="Position">
        <Property id={selectedElement} label="Top" path="style.position.top" />
        <Property
          id={selectedElement}
          label="Left"
          path="style.position.left"
        />
      </Section>
      <Section heading="Size">
        <PropertyResize id={selectedElement} label="Width" dimenion="width" />
        <PropertyResize id={selectedElement} label="Height" dimenion="height" />
      </Section>
      {hasImage && (
        <Section heading="ImageInfo">
          <Suspense fallback={<ImageInfoFallback />}>
            <ImageInfo />
          </Suspense>
        </Section>
      )}
    </Card>
  )
}

const Section: React.FC<{heading: string}> = ({heading, children}) => {
  return (
    <VStack spacing={2} align="flex-start">
      <Text fontWeight="500">{heading}</Text>
      {children}
    </VStack>
  )
}

const PropertyResize = ({
  label,
  dimenion,
  id,
}: {
  id: number
  label: string
  dimenion: 'width' | 'height'
}) => {
  const [value, setValue] = useRecoilState(resizeState({dimenion, id}))
  console.log(value)

  return <PropertyInput value={value} label={label} onChange={setValue} />
}

const Property = ({
  label,
  path,
  id,
}: {
  id: number
  label: string
  path: string
}) => {
  const [value, setValue] = useRecoilState(
    updateElementPropertyState({id, path}),
  )

  return <PropertyInput value={value} label={label} onChange={setValue} />
}

const PropertyInput = ({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (value: number) => void
}) => {
  return (
    <div>
      <Text fontSize="14px" fontWeight="500" mb="2px">
        {label}
      </Text>
      <InputGroup size="sm" variant="filled">
        <NumberInput value={value} onChange={(_, value) => onChange(value)}>
          <NumberInputField borderRadius="md" />
          <InputRightElement
            pointerEvents="none"
            children="px"
            lineHeight="1"
            fontSize="12px"
          />
        </NumberInput>
      </InputGroup>
    </div>
  )
}

const Card: React.FC = ({children}) => (
  <VStack
    position="absolute"
    top="20px"
    right="20px"
    backgroundColor="white"
    padding={2}
    boxShadow="md"
    borderRadius="md"
    spacing={3}
    align="flex-start"
    onClick={(e) => e.stopPropagation()}
  >
    {children}
  </VStack>
)

export default EditProperties
