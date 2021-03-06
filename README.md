# Excalidraw Clone built with Recoil

This is the start of an [Exaclidraw](https://excalidraw.com/) clone that I am building with [Recoil](https://recoiljs.org/).

It is for my **upcoming free Recoil course**, [Learn Recoil](https://learnrecoil.com/), where I will show you how to build a **full featured Excalidraw clone using Recoil** for state management.

## What you'll learn to build in the course (on top of what's already in this repo)...

- π Rotating shapes
- βοΈ Multi-select
- π΅ More kinds of shapes
- πΎ Saving a drawing to a file and opening it again
- π Saving the drawing to a server (shareable drawing URL)
- π Loading content (e.g. images) from an API with Recoil and Suspense
- π―ββοΈ Enabling concurrent mode
- π§ͺ Adding full test coverage
- π€ Your own dev tools for debugging
- π Authentication
- π Performance debugging, testing, and improvement
- And more...

**Have any other suggestions? Tweet or DM me [@jacques_codes](https://twitter.com/jacques_codes).**

## Sign up for the Recoil course here π https://learnrecoil.com/ π today!

## μκ²λμ 

- atomFamily
  - get(atomState(args))λ μν°μ μλ value λ°ν
  - atomState(args)λ μν° μμ²΄λ₯Ό λ°ν(ν€κ°μΌλ‘ μκ°)
  - ν€κ°μΌλ‘ μλ ν°μμ set(key,value)ν  μ μλ€.
- selector
  - selector<T> T λ μλ ν°μμ get μ λ¦¬ν΄κ° νμ
  - selector<T> T λ μλ ν°μμ set μ args νμ
  - λλ€ κ°λ€.
- selectFamily
  - atomFamily μ μμ  κ°λ€κ³  μκ° μλ ν°λ λλ€λ₯Έ μν°μ΄λΌκ³  μκ°
  - λΉλκΈ° ν΅μ  κ΄κ³μμ΄ κ° μ»΄ν¬λνΈμλ μμ΄λλ§ μ£Όκ³  κ° μ»΄ν¬λνΈμμ
  - κ·Έ μμ΄λλ₯Ό κ°κ³  μλ ν°μ μ ννλ μλ ν° ν¨λ°λ¦¬μ μμ²­νλ©΄
  - κ° μ»΄ν¬λνΈλ λλ¦½λ λΆλ¦¬λ μμ λ§μ μ€νμ΄νΈλ₯Ό κ°κ²λλ€
- μνλ‘ λ°λ³΅λλ©° λκ³ μλ μ»΄ν¬λνΈλΌλ©΄?
  - λ°λ―μ΄ family λ₯Ό μ¬μ©ν  μκ°μ ν΄μΌ νλ€.
  - κ° μ»΄ν¬λνΈμ μ λ¬λλ νλ‘­μ€λ μ΅μν λμΌνλ€(μμ΄λλ§ μ λ¬ν΄ μ£Όλ©΄ family λ₯Ό κ°κ³  ν΅μ νλ©΄λ¨)

## ν¨ν΄

- μΌλ°μ μΈ ν¨ν΄
  - number[] : μμ΄λ λ₯Ό λͺ¨μλμ νΉμ κ³ μ ν κ°(κ°λ¨ν 1κ°μμνμ) λ°°μ΄ μν°
  - DataType[]: μ΄ μμ΄λλ‘ λ§λ  family atom μ¬κΈ°μ μ λ§ λ³΅μ‘ν κ²λ€μ λ€ λ£λλ€ μμ±μ΄λ κ°μ²΄λ‘ λλλ κ²λ€
  - <Item id={id}> : κ·Έλ¦¬κ³  family atom μ μ»΄ν¬λνΈμμ κ°κ° ν΅μ νλλ° κ³ μ  μμ΄λλ₯Ό κ°κ³  μ»΄ν¬λνΈλ₯Ό λ§λ€κ³ 
  - κ·Έ μμ΄λλ₯Ό μ»΄ν¬λνΈμ λΏλ €μ€μ μ»΄ν¬λνΈμμ μμμ κ°κ° atom family λ₯Ό λΆλ¬μ¨λ€(λλ¦½λ μ€νμ΄νΈ)
- selectorFamily ν¨ν΄

  - redux μ selector μμ κ°μ²΄ λ€ λΆλ¬μ€μ§ λ§κ³  μμκ°μ λ½μΌλΌκ³  κΆμ₯νλ―μ΄
  - recoil μμλ κ·Έκ²μ΄ κ°λ₯νλ€ .

  ```
  //μμ΄λμ path(κ°μ²΄ μμ ν€κ°μ μ€νΈλ§ ννλ‘ λ°μκ²)λ₯Ό λ°μμ κ·Έ μμ΄λμ μνλ κ°μ²΄λ₯Ό λΆλ¬μμ κ·Έ κ°μ²΄μ€ νμνκ²λ§ λ½μλ΄κ±°μ¬ νμν κ²λ§ μμ ν  μ μμ.
  //immer μ lodash λ₯Ό κ°μ΄ μ¬μ©ν κ² λμ¬κ²¨ λ³Ό κ²!!
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

  //μλμ κ°μ΄ μ¬μ©νλ©΄ λ¨ μΈννκ³  λΆλ¬μ€κ³ !
  const [value, setValue] = useRecoilState(updateElementPropertyState({id, path}))
  ```

  - selectorFamily λ familyAtom κ³Ό κ°μ΄ μ»΄ν¬λνΈ λ¨λμΌλ‘ μ¬μ©νκ±°λ
  - λΉλκΈ°μ κ²½μ° μμμ μΊμ λλ―λ‘ κΈλ‘λ²νκ² μ±λ₯ κ±±μ  μμ΄ λ§ μ¬μ© ν  μ μλ€.
  - μ’λ μΊμμ λͺννκ² νκ±°λ νΈλ€λ§ νλ €λ©΄ atomEffect λ₯Ό μ°λ©΄ μ’λ€.

  ```
  //src λ₯Ό κ°κ³  μλ μ΄λ―Έμ§ κ°μ²΄ λ₯Ό λ²Ήμ΄λ΄λ μλ ν° ν¨λ°λ¦¬!
  const imageSizeState = selectorFamily({
    key: 'imageSizeState',
    get: (src?: string) => () => {
      if (!src) return
      return getImageDimensions(src)
    },
  })

  ```

## μ£Όμμ¬ν­

- selector ν΅μ μ΄ λ¬΄μ‘°κ±΄ μΊμλλκ±΄ μλλ€
- dep κ° κ°μ²΄ μΌκ²½μ° λ€μ ν΅μ νλ€. κ·μ°?λλΌλ dep(νλΌλ―Έν° λ μ£Όμμ λ€μ΄κ°λ κ°)
- μλ ν°λ‘ λ€μ λλ μ λ°λ‘ μμκ°μΌλ‘ λ°μμ€λλ‘ ν΄μΌ νλ€.

  ```
    //νλΌλ―Έν°λ₯Ό κ°μ²΄μμ λ½μμ λ°λ‘ μ€ κ²½μ° κ°μ²΄ μ κ°μ λΉκ΅νλ―λ‘ ν­μ false
    //μλλ κ·Έλμ κ³μ κ°μ ν΅μ μ λ°λ³΅νλ€.
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

  //νμ§λ§ μμ΄λλ₯Ό μλ ν°λ‘ λλ λ²λ¦¬λ©΄ μμκ°μ λΉκ΅νλ―λ‘ true!!
  //κ°μν΅μ μ λ°λ³΅νμ§ μλλ€
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
