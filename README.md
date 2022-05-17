# Excalidraw Clone built with Recoil

This is the start of an [Exaclidraw](https://excalidraw.com/) clone that I am building with [Recoil](https://recoiljs.org/).

It is for my **upcoming free Recoil course**, [Learn Recoil](https://learnrecoil.com/), where I will show you how to build a **full featured Excalidraw clone using Recoil** for state management.

## What you'll learn to build in the course (on top of what's already in this repo)...

- 🔄 Rotating shapes
- ✌️ Multi-select
- 🔵 More kinds of shapes
- 💾 Saving a drawing to a file and opening it again
- 🌍 Saving the drawing to a server (shareable drawing URL)
- 🌄 Loading content (e.g. images) from an API with Recoil and Suspense
- 👯‍♂️ Enabling concurrent mode
- 🧪 Adding full test coverage
- 🤔 Your own dev tools for debugging
- 🔑 Authentication
- 🏃 Performance debugging, testing, and improvement
- And more...

**Have any other suggestions? Tweet or DM me [@jacques_codes](https://twitter.com/jacques_codes).**

## Sign up for the Recoil course here 👉 https://learnrecoil.com/ 👈 today!

## 알게된점

- atomFamily
  - get(atomState(args))는 아톰에 있는 value 반환
  - atomState(args)는 아톰 자체를 반환(키값으로 생각)
  - 키값으로 셀렉터에서 set(key,value)할 수 있다.
- selector
  - selector<T> T 는 셀렉터에서 get 의 리턴값 타입
  - selector<T> T 는 셀렉터에서 set 의 args 타입
  - 둘다 같다.
- selectFamily
  - atomFamily 와 완전 같다고 생각 셀렉터는 또다른 아톰이라고 생각
  - 비동기 통신 관계없이 각 컴포넌트에는 아이디만 주고 각 컴포넌트에서
  - 그 아이디를 갖고 셀렉터에 정확히는 셀렉터 패밀리에 요청하면
  - 각 컴포넌트는 독립된 분리된 자신만에 스테이트를 갖게된다
- 순회로 반복되며 돌고있는 컴포넌트라면?
  - 반듯이 family 를 사용할 생각을 해야 한다.
  - 각 컴포넌트에 전달되는 프롭스는 최소화 되야한다(아이디만 전달해 주면 family 를 갖고 통신하면됨)

## 패턴

- 일반적인 패턴
  - number[] : 아이디 를 모아놓은 혹은 고유한 값(간단한 1개원시타입) 배열 아톰
  - DataType[]: 이 아이디로 만든 family atom 여기에 정말 복잡한 것들을 다 넣는다 속성이나 객체로 나뉘는 것들
  - <Item id={id}> : 그리고 family atom 을 컴포넌트에서 각각 통신하는데 고유 아이디를 갖고 컴포넌트를 만들고
  - 그 아이디를 컴포넌트에 뿌려줘서 컴포넌트에서 알아서 각각 atom family 를 불러온다(독립된 스테이트)
- selectorFamily 패턴

  - redux 에 selector 에서 객체 다 불러오지 말고 원시값을 뽑으라고 권장하듯이
  - recoil 에서도 그것이 가능하다 .

  ```
  //아이디와 path(객체 안에 키값을 스트링 형태로 받은것)를 받아서 그 아이디에 속하는 객체를 불러와서 그 객체중 필요한것만 뽑아내거사 필요한 것만 수정할 수 있음.
  //immer 와 lodash 를 같이 사용한 것 눈여겨 볼 것!!
  export const updateElementPropertyState = selectorFamily<any, {id: number; path: string}>({
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

  //아래와 같이 사용하면 됨 세팅하고 불러오고!
  const [value, setValue] = useRecoilState(updateElementPropertyState({id, path}))
  ```

  - selectorFamily 도 familyAtom 과 같이 컴포넌트 단독으로 사용하거나
  - 비동기의 경우 알아서 캐슁 되므로 글로벌하게 성능 걱정 없이 막 사용 할 수 있다.
  - 좀더 캐슁을 명확하게 하거나 핸들링 하려면 atomEffect 를 쓰면 좋다.

  ```
  //src 를 갖고 있는 이미지 객체 를 벹어내는 셀렉터 패밀리!
  const imageSizeState = selectorFamily({
    key: 'imageSizeState',
    get: (src?: string) => () => {
      if (!src) return
      return getImageDimensions(src)
    },
  })

  ```

## 주의사항

- selector 통신이 무조건 캐슁되는건 아니다
- dep 가 객체 일경우 다시 통신한다. 귀찮더라도 dep(파라미터 나 주소에 들어가는 값)
- 셀렉터로 다시 나눠서 바로 원시갑으로 받아오도록 해야 한다.

  ```
    //파라미터를 객체에서 뽑아서 바로 줄 경우 객체 의 값을 비교하므로 항상 false
    //아래는 그래서 계속 같은 통신을 반복한다.
  const imageInfoState = selector({
      key: 'imageInfoState',
      get: ({get}) => {
      const selectedElementId = get(selectElementState)
      if (selectedElementId == null) return

      const element = get(elementState(selectedElementId))
      if (element == null) return


      const id = element.style.image?.id
      if (id == null) return

        return callApi('image-details', {queryParams: {seed: id}})
      },
    })

  //하지만 아이디를 셀렉터로 나눠버리면 원시값을 비교하므로 true!!
  //같은통신은 반복하지 않는다
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
  ```
