import {Container, Heading, Text} from '@chakra-ui/layout'
import {Select} from '@chakra-ui/select'
import {Suspense, useState} from 'react'
import {ErrorBoundary, ErrorBoundaryProps, ErrorBoundaryPropsWithFallback, FallbackProps} from 'react-error-boundary'
import {atom, atomFamily, selectorFamily, useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil'
import {getWeather} from './fakeApi'

const userInfoState = selectorFamily<any, number>({
  key: 'userInfoState',
  get: (userId) => async () => {
    if (userId === 4) throw new Error('error')
    const userData = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`).then((res) => res.json())

    return userData
  },
})

const requestWeatherState = atomFamily({
  key: 'requestWeatherState',
  default: 0,
})

const weatherState = selectorFamily<null | any, number>({
  key: 'weatherState',
  get:
    (userId: number) =>
    async ({get}) => {
      get(requestWeatherState(userId))

      const user = get(userInfoState(userId))
      if (user == null) return null

      const weather = await getWeather(user.adress)
      return weather
    },
})

const UserWeather = ({userId}: {userId: number}) => {
  const weather = useRecoilValue(weatherState(userId))
  if (!weather) return null
  return (
    <Text>
      <b>Weather:</b> {weather}
    </Text>
  )
}

const useRefresh = (userId: number) => {
  const setRequestState = useSetRecoilState(requestWeatherState(userId))
  return () => setRequestState((pre) => pre + 1)
}

const ErrorFallback = ({error, resetErrorBoundary}: FallbackProps) => {
  return (
    <div>
      <span>error</span>
      <button onClick={resetErrorBoundary}>back</button>
    </div>
  )
}

const UserInfo = ({userId}: {userId: number}) => {
  const userData = useRecoilValue(userInfoState(userId))
  const refresh = useRefresh(userId)
  return (
    <div>
      <Heading as="h2" size="md" mb={1}>
        User data:
      </Heading>
      <Text>
        <b>Name:</b> {userData.name}
      </Text>
      <Text>
        <b>Phone:</b> {userData.phone}
      </Text>

      <Suspense fallback={<div>Loading</div>}>
        <UserWeather userId={userId} />
      </Suspense>

      <Text onClick={() => refresh()}>Click Refresh</Text>
    </div>
  )
}

const Async = () => {
  const [userId, setUserId] = useState<number>(1)

  return (
    <Container py={10}>
      <Heading as="h1" mb={4}>
        View Profile
      </Heading>
      <Heading as="h2" size="md" mb={1}>
        Choose a user:
      </Heading>
      <Select
        placeholder="Choose a user"
        mb={4}
        value={userId}
        onChange={(event) => {
          const value = event.target.value
          setUserId(parseInt(value))
        }}
      >
        <option value="1">User 1</option>
        <option value="2">User 2</option>
        <option value="3">User 3</option>
        <option value="4">User 4 error</option>
      </Select>
      {!Number.isNaN(userId) && (
        <ErrorBoundary
          resetKeys={[userId]}
          FallbackComponent={ErrorFallback}
          // onReset={() => {
          //   setUserId(0)
          // }}
        >
          <Suspense fallback={<div>Loading...</div>}>
            <UserInfo userId={userId} />
          </Suspense>
        </ErrorBoundary>
      )}
    </Container>
  )
}

export default Async
