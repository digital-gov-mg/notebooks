import { BirthCsvRecord, CsvFields } from '../helpers/csvTypes.ts'
import { BirthResolver, BirthInformant } from '../helpers/birthTypes.ts'
import { Gender, LocationMap } from '../helpers/types.ts'
import { Address } from '../helpers/addressConfig.ts'
import { birthInformantMap } from '../lookupMappings/informantTypes.ts'

const lookUpNameChange = (CsvFields: CsvFields, birthRef: string) => {
  return CsvFields.deedpoll
    .filter((record) => record.BIRTH_REF === birthRef)
    .sort(
      (a, b) =>
        new Date(toISODate(a.DATE)).getTime() -
        new Date(toISODate(b.DATE)).getTime(),
    )
}

const toISODate = (dateString: string): string => {
  const [month, day, year] = dateString.split('/').map(Number)
  if (!month || !day || !year) return ''

  const date = new Date(Date.UTC(year, month - 1, day))
  return date.toISOString()
}

const toDate = (dateString: string): string => {
  const [month, day, year] = dateString.split('/').map(Number)
  if (!month || !day || !year) return ''

  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

const resolveAddress = (
  addressString: string,
  locationMap: LocationMap[],
): Address | undefined => {
  const location = locationMap.find((loc) => loc.name === addressString)
  if (location?.id) {
    return {
      addressType: 'DOMESTIC',
      country: 'COK',
      administrativeArea: location.id,
      streetLevelDetails: {},
    }
  }
}

const toName = (firstname: string, surname: string) => ({
  firstname,
  surname,
})

const toAge = (ageString: string) => {
  const age = Number(ageString)
  return isNaN(age) || age === 0 ? null : age
}

const toGender = (genderString: string): Gender => {
  switch (genderString) {
    case 'M':
      return 'male'
    case 'F':
      return 'female'
    default:
      return 'unknown'
  }
}

export const birthResolver: BirthResolver = {
  'informant.contact': '',
  'reason.option': '',
  'reason.other': '',
  'child.name': (data: BirthCsvRecord) =>
    toName(data.CHILDS_NAME, data.FATHERS_SURNAME || data.MOTHERS_SURNAME),
  'child.dob': (data: BirthCsvRecord) => toDate(data.CHILDS_DOB),
  'child.reason': '',
  'child.gender': (data: BirthCsvRecord) => toGender(data.CHILDS_GENDER),
  'child.placeOfBirth': (data: BirthCsvRecord) => data.CHILDS_BIRTHPLACE, // Calculate from birth.CHILDS_BIRTHPLACE
  'child.birthLocation': (
    data: BirthCsvRecord,
    _: CsvFields,
    locationMap: LocationMap[],
  ) => resolveAddress(data.CHILDS_BIRTHPLACE, locationMap),
  'child.birthLocation.privateHome': '',
  'child.birthLocation.other': (
    data: BirthCsvRecord,
    _: CsvFields,
    locationMap: LocationMap[],
  ) => resolveAddress(data.CHILDS_BIRTHPLACE, locationMap),
  'child.birthType': (data: BirthCsvRecord) => data.CHILDS_TWIN, // TODO these will all need some kind of interpretation function
  'child.orderOfBirth.twins': (data: BirthCsvRecord) => data.CHILDS_TWIN,
  'child.orderOfBirth.triplets': (data: BirthCsvRecord) => data.CHILDS_TWIN,
  'child.orderOfBirth.higherMultiple': (data: BirthCsvRecord) =>
    data.CHILDS_TWIN,
  'child.weightAtBirth': '',
  'child.attendantAtBirth': '',
  'child.attendantAtBirth.other': '',
  'child.attendantAtBirth.givenNames': '',
  'child.attendantAtBirth.surname': '',
  'child.isRenamed': (data: BirthCsvRecord) => !!data.CHILDS_NEW_NAME, // Calculate !!birth.CHILDS_NEW_NAME

  'nameChange.deedPollNumber1': (data: BirthCsvRecord, all: CsvFields) =>
    lookUpNameChange(all, data.BIRTH_REF)[0]?.DP_REF,
  'nameChange.newGivenNames1': (data: BirthCsvRecord, all: CsvFields) =>
    lookUpNameChange(all, data.BIRTH_REF)[0]?.NEW_FIRSTNAMES,
  'nameChange.newSurname1': (data: BirthCsvRecord, all: CsvFields) =>
    lookUpNameChange(all, data.BIRTH_REF)[0]?.NEW_SURNAME,
  'nameChange.addAnother1': '',
  'nameChange.deedPollNumber2': (data: BirthCsvRecord, all: CsvFields) =>
    lookUpNameChange(all, data.BIRTH_REF)[1]?.DP_REF,
  'nameChange.newGivenNames2': (data: BirthCsvRecord, all: CsvFields) =>
    lookUpNameChange(all, data.BIRTH_REF)[1]?.NEW_FIRSTNAMES,
  'nameChange.newSurname2': (data: BirthCsvRecord, all: CsvFields) =>
    lookUpNameChange(all, data.BIRTH_REF)[1]?.NEW_SURNAME,
  'nameChange.addAnother2': '',
  'nameChange.deedPollNumber3': (data: BirthCsvRecord, all: CsvFields) =>
    lookUpNameChange(all, data.BIRTH_REF)[2]?.DP_REF,
  'nameChange.newGivenNames3': (data: BirthCsvRecord, all: CsvFields) =>
    lookUpNameChange(all, data.BIRTH_REF)[2]?.NEW_FIRSTNAMES,
  'nameChange.newSurname3': (data: BirthCsvRecord, all: CsvFields) =>
    lookUpNameChange(all, data.BIRTH_REF)[2]?.NEW_SURNAME,

  'mother.detailsUnavailable': '',
  'mother.unavailableReason': '',
  'mother.name': (data: BirthCsvRecord) =>
    toName(data.MOTHERS_NAME, data.MOTHERS_SURNAME),
  'mother.dob': (data: BirthCsvRecord) => toDate(data.MOTHERS_DOB),
  'mother.dobUnknown': (data: BirthCsvRecord) =>
    Boolean(!data.MOTHERS_DOB && data.MOTHERS_AGE),
  'mother.age': (data: BirthCsvRecord) => toAge(data.MOTHERS_AGE),
  'mother.maritalStatus': '',
  'mother.maidenName': (data: BirthCsvRecord) => data.MOTHERS_MAIDEN_NAME,
  'mother.placeOfBirth': (data: BirthCsvRecord) => data.MOTHERS_BIRTHPLACE,
  'mother.nationality': (data: BirthCsvRecord) => data.MOTHERS_NATIONALITY,
  'mother.idType': '',
  'mother.passport': '',
  'mother.bc': '',
  'mother.other': '',
  'mother.address': (
    data: BirthCsvRecord,
    _: CsvFields,
    locationMap: LocationMap[],
  ) => resolveAddress(data.MOTHERS_ADDRESS, locationMap),
  'mother.occupation': '',
  'father.detailsUnavailable': '',
  'father.unavailableReason': '',
  'father.name': (data: BirthCsvRecord) =>
    toName(data.FATHERS_NAME, data.FATHERS_SURNAME),
  'father.dob': (data: BirthCsvRecord) => toDate(data.FATHERS_DOB),
  'father.dobUnknown': (data: BirthCsvRecord) =>
    Boolean(!data.FATHERS_DOB && data.FATHERS_AGE),
  'father.age': (data: BirthCsvRecord) => toAge(data.FATHERS_AGE),
  'father.placeOfBirth': (data: BirthCsvRecord) => data.FATHERS_BIRTHPLACE,
  'father.nationality': (data: BirthCsvRecord) => data.FATHERS_NATIONALITY,
  'father.idType': '',
  'father.passport': '',
  'father.bc': '',
  'father.other': '',
  'father.sameAsMotherResidence': '', // Calculate
  'father.address': (
    data: BirthCsvRecord,
    _: CsvFields,
    locationMap: LocationMap[],
  ) => resolveAddress(data.FATHERS_ADDRESS, locationMap),
  'father.occupation': (data: BirthCsvRecord) => data.FATHERS_OCCUPATION,
  'informant.relation': (data: BirthCsvRecord): BirthInformant => {
    const relation = data.INFORMANTS_RELATIONSHIP || ''
    return birthInformantMap[relation] || 'OTHER'
  }, // Map to data type
  'informant.other.relation': (data: BirthCsvRecord) =>
    data.INFORMANTS_RELATIONSHIP, // Calculate
  'informant.name': (data: BirthCsvRecord) => {
    const names = data.INFORMANTS_NAME.split(' ').filter(Boolean)
    const surname = names.length > 1 ? names.pop() || '' : ''
    const firstname = names.join(' ')
    return toName(firstname, surname)
  },
  'informant.dob': '',
  'informant.dobUnknown': '',
  'informant.age': '',
  'informant.nationality': '',
  'informant.idType': '',
  'informant.passport': '',
  'informant.bc': '',
  'informant.other': '',
  'informant.address': (
    data: BirthCsvRecord,
    _: CsvFields,
    locationMap: LocationMap[],
  ) => resolveAddress(data.INFORMANTS_ADDRESS, locationMap),
  'informant.occupation': (data: BirthCsvRecord) => data.INFORMANTS_OCCUPATION,
  'informant.phoneNo': '',
  'informant.email': '',
}
