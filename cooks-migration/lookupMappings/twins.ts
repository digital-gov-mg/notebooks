import {
  BirthType,
  OrderOfBirthHigherMultiple,
  OrderOfBirthTriplets,
  OrderOfBirthTwins,
} from '../helpers/birthTypes.ts'

type twins = {
  type: BirthType
  orderTwins: OrderOfBirthTwins | null
  orderTriplets: OrderOfBirthTriplets | null
  orderHigher: OrderOfBirthHigherMultiple | null
}

export const twinsMap: Record<string, twins> = {
  '(ELDER OF TWINS)': {
    type: 'TWIN',
    orderTwins: 'ELDER_OF_TWINS',
    orderTriplets: null,
    orderHigher: null,
  },
  '(YOUNGER OF TWINS)': {
    type: 'TWIN',
    orderTwins: 'YOUNGER_OF_TWINS',
    orderTriplets: null,
    orderHigher: null,
  },
  '1': {
    type: 'TWIN',
    orderTwins: 'ELDER_OF_TWINS',
    orderTriplets: null,
    orderHigher: null,
  },
  '2': {
    type: 'TWIN',
    orderTwins: 'YOUNGER_OF_TWINS',
    orderTriplets: null,
    orderHigher: null,
  },
  '2ND OF TRIPLETS': {
    type: 'TRIPLETS',
    orderTwins: null,
    orderTriplets: 'SECOND_BORN',
    orderHigher: null,
  },
  ELDER: {
    type: 'TWIN',
    orderTwins: 'ELDER_OF_TWINS',
    orderTriplets: null,
    orderHigher: null,
  },
  'ELDER  OF TWINS': {
    type: 'TWIN',
    orderTwins: 'ELDER_OF_TWINS',
    orderTriplets: null,
    orderHigher: null,
  },
  'ELDER OF TRIPLETS': {
    type: 'TRIPLETS',
    orderTwins: null,
    orderTriplets: 'FIRST_BORN',
    orderHigher: null,
  },
  'ELDER OF TWIN': {
    type: 'TWIN',
    orderTwins: 'ELDER_OF_TWINS',
    orderTriplets: null,
    orderHigher: null,
  },
  'ELDER OF TWINS': {
    type: 'TWIN',
    orderTwins: 'ELDER_OF_TWINS',
    orderTriplets: null,
    orderHigher: null,
  },
  'ELDER OF TWINS.': {
    type: 'TWIN',
    orderTwins: 'ELDER_OF_TWINS',
    orderTriplets: null,
    orderHigher: null,
  },
  'ELDER OF TWINS`': {
    type: 'TWIN',
    orderTwins: 'ELDER_OF_TWINS',
    orderTriplets: null,
    orderHigher: null,
  },
  'ELDER TWINS': {
    type: 'TWIN',
    orderTwins: 'ELDER_OF_TWINS',
    orderTriplets: null,
    orderHigher: null,
  },
  'ELDERS OF TWIN': {
    type: 'TWIN',
    orderTwins: 'ELDER_OF_TWINS',
    orderTriplets: null,
    orderHigher: null,
  },
  'ELDERS OF TWINS': {
    type: 'TWIN',
    orderTwins: 'ELDER_OF_TWINS',
    orderTriplets: null,
    orderHigher: null,
  },
  'ELDEST OF TRIPLETS': {
    type: 'TRIPLETS',
    orderTwins: null,
    orderTriplets: 'FIRST_BORN',
    orderHigher: null,
  },
  'ELDEST OF TWINS': {
    type: 'TWIN',
    orderTwins: 'ELDER_OF_TWINS',
    orderTriplets: null,
    orderHigher: null,
  },
  'ELEDER OF TWINS': {
    type: 'TWIN',
    orderTwins: 'ELDER_OF_TWINS',
    orderTriplets: null,
    orderHigher: null,
  },
  'HAKIHAKIRAU KISSME D.P 93/82': {
    // WTF is this?
    type: 'SINGLE',
    orderTwins: null,
    orderTriplets: null,
    orderHigher: null,
  },
  OLDER: {
    type: 'TWIN',
    orderTwins: 'ELDER_OF_TWINS',
    orderTriplets: null,
    orderHigher: null,
  },
  'OLDER OF TWINS': {
    type: 'TWIN',
    orderTwins: 'ELDER_OF_TWINS',
    orderTriplets: null,
    orderHigher: null,
  },
  QUINTRIPLETS: {
    type: 'HIGHER_MULTIPLE_DELIVERY',
    orderTwins: null,
    orderTriplets: null,
    orderHigher: null,
  },
  'STILL BIRTH': {
    type: 'SINGLE',
    orderTwins: null,
    orderTriplets: null,
    orderHigher: null,
  },
  TRIPLET: {
    type: 'TRIPLETS',
    orderTwins: null,
    orderTriplets: null,
    orderHigher: null,
  },
  'TRIPLET - 1ST': {
    type: 'TRIPLETS',
    orderTwins: null,
    orderTriplets: 'FIRST_BORN',
    orderHigher: null,
  },
  TRIPLETS: {
    type: 'TRIPLETS',
    orderTwins: null,
    orderTriplets: null,
    orderHigher: null,
  },
  'TRIPLETS - 2ND': {
    type: 'TRIPLETS',
    orderTwins: null,
    orderTriplets: 'SECOND_BORN',
    orderHigher: null,
  },
  TWIN: {
    type: 'TWIN',
    orderTwins: null,
    orderTriplets: null,
    orderHigher: null,
  },
  'TWIN NO 1': {
    type: 'TWIN',
    orderTwins: 'ELDER_OF_TWINS',
    orderTriplets: null,
    orderHigher: null,
  },
  TWINS: {
    type: 'TWIN',
    orderTwins: null,
    orderTriplets: null,
    orderHigher: null,
  },
  'TWINS (YOUNGER)': {
    type: 'TWIN',
    orderTwins: 'YOUNGER_OF_TWINS',
    orderTriplets: null,
    orderHigher: null,
  },
  Y: {
    type: 'TWIN',
    orderTwins: 'YOUNGER_OF_TWINS',
    orderTriplets: null,
    orderHigher: null,
  },
  'YONGER OF TWINS': {
    type: 'TWIN',
    orderTwins: 'YOUNGER_OF_TWINS',
    orderTriplets: null,
    orderHigher: null,
  },
  'YOUBGER OF TWINS': {
    type: 'TWIN',
    orderTwins: 'YOUNGER_OF_TWINS',
    orderTriplets: null,
    orderHigher: null,
  },
  'YOUGER OF TWINS': {
    type: 'TWIN',
    orderTwins: 'YOUNGER_OF_TWINS',
    orderTriplets: null,
    orderHigher: null,
  },
  'YOUNDER OF TWINS': {
    type: 'TWIN',
    orderTwins: 'YOUNGER_OF_TWINS',
    orderTriplets: null,
    orderHigher: null,
  },
  YOUNGER: {
    type: 'TWIN',
    orderTwins: 'YOUNGER_OF_TWINS',
    orderTriplets: null,
    orderHigher: null,
  },
  'YOUNGER OF TRIPLETS': {
    type: 'TRIPLETS',
    orderTwins: null,
    orderTriplets: 'THIRD_BORN',
    orderHigher: null,
  },
  'YOUNGER OF TWIN': {
    type: 'TWIN',
    orderTwins: 'YOUNGER_OF_TWINS',
    orderTriplets: null,
    orderHigher: null,
  },
  'YOUNGER OF TWINS': {
    type: 'TWIN',
    orderTwins: 'YOUNGER_OF_TWINS',
    orderTriplets: null,
    orderHigher: null,
  },
  'YOUNGER OF TWINS.': {
    type: 'TWIN',
    orderTwins: 'YOUNGER_OF_TWINS',
    orderTriplets: null,
    orderHigher: null,
  },
  'YOUNGER TWINS': {
    type: 'TWIN',
    orderTwins: 'YOUNGER_OF_TWINS',
    orderTriplets: null,
    orderHigher: null,
  },
  YOUNGEST: {
    type: 'TWIN',
    orderTwins: 'YOUNGER_OF_TWINS',
    orderTriplets: null,
    orderHigher: null,
  },
  'YOUNGEST OF TRIPLETS': {
    type: 'TRIPLETS',
    orderTwins: null,
    orderTriplets: 'THIRD_BORN',
    orderHigher: null,
  },
  'YOUNGEST OF TWINS': {
    type: 'TWIN',
    orderTwins: 'YOUNGER_OF_TWINS',
    orderTriplets: null,
    orderHigher: null,
  },
  'YOUNGRE OF TWINS': {
    type: 'TWIN',
    orderTwins: 'YOUNGER_OF_TWINS',
    orderTriplets: null,
    orderHigher: null,
  },
  younger: {
    type: 'TWIN',
    orderTwins: 'YOUNGER_OF_TWINS',
    orderTriplets: null,
    orderHigher: null,
  },
}
