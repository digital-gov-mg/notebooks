export interface Address {
  addressType: 'INTERNATIONAL' | 'DOMESTIC'
  country: string
  administrativeArea?: string
  streetLevelDetails: StreetLevelDetails
}

export interface StreetLevelDetails {
  town?: string
}
