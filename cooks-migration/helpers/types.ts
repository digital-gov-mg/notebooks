export type LocationMap = {
  id: string
  name: string
}

export type EventType =
  | 'birth'
  | 'death'
  | 'marriage'
  | 'marriage-licence'
  | 'divorce'
  | 'name-change'

export type ActionType = 'CREATE' | 'REGISTER'

export type Gender = 'male' | 'female' | 'unknown'
