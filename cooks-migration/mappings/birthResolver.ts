import { BirthCsvRecord, CsvFields } from '../helpers/csvTypes.ts'

const lookUpNameChange = (CsvFields: CsvFields, birthRef: string) => {
  return CsvFields.deedpoll
    .filter((record) => record.BIRTH_REF === birthRef)
    .sort(
      (a, b) =>
        new Date(toDate(a.DATE)).getTime() - new Date(toDate(b.DATE)).getTime(),
    )
}

const toDate = (dateString: string): string => {
  const [month, day, year] = dateString.split('/').map(Number)
  if (!month || !day || !year) return ''

  const date = new Date(Date.UTC(year, month - 1, day))
  return date.toISOString()
}

export const birthResolver = {
  'informant.contact': '',
  'reason.option': '',
  'reason.other': '',
  'child.name': (data: BirthCsvRecord) => ({
    firstName: data.CHILDS_NAME,
    surname: data.FATHERS_SURNAME,
  }),
  'child.dob': (data: BirthCsvRecord) => toDate(data.CHILDS_DOB),
  'child.reason': '',
  'child.gender': (data: BirthCsvRecord) => data.CHILDS_GENDER,
  'child.placeOfBirth': (data: BirthCsvRecord) => data.CHILDS_BIRTHPLACE, // Calculate from birth.CHILDS_BIRTHPLACE
  'child.birthLocation': (data: BirthCsvRecord) => data.CHILDS_BIRTHPLACE,
  'child.birthLocation.privateHome': '',
  'child.birthLocation.other': (data: BirthCsvRecord) => data.CHILDS_BIRTHPLACE,
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
  'mother.name': (data: BirthCsvRecord) => data.MOTHERS_NAME,
  'mother.dob': (data: BirthCsvRecord) => toDate(data.MOTHERS_DOB),
  'mother.dobUnknown': '',
  'mother.age': (data: BirthCsvRecord) => data.MOTHERS_AGE,
  'mother.maritalStatus': '',
  'mother.maidenName': (data: BirthCsvRecord) => data.MOTHERS_MAIDEN_NAME,
  'mother.placeOfBirth': (data: BirthCsvRecord) => data.MOTHERS_BIRTHPLACE,
  'mother.nationality': (data: BirthCsvRecord) => data.MOTHERS_NATIONALITY,
  'mother.idType': '',
  'mother.passport': '',
  'mother.bc': '',
  'mother.other': '',
  'mother.address': (data: BirthCsvRecord) => data.MOTHERS_ADDRESS,
  'mother.occupation': '',
  'father.detailsUnavailable': '',
  'father.unavailableReason': '',
  'father.name': (data: BirthCsvRecord) => data.FATHERS_NAME,
  'father.dob': (data: BirthCsvRecord) => toDate(data.FATHERS_DOB),
  'father.dobUnknown': (data: BirthCsvRecord) =>
    !data.FATHERS_DOB && data.FATHERS_AGE, // Calculate
  'father.age': (data: BirthCsvRecord) => data.FATHERS_AGE,
  'father.placeOfBirth': (data: BirthCsvRecord) => data.FATHERS_BIRTHPLACE,
  'father.nationality': (data: BirthCsvRecord) => data.FATHERS_NATIONALITY,
  'father.idType': '',
  'father.passport': '',
  'father.bc': '',
  'father.other': '',
  'father.sameAsMotherResidence': '', // Calculate
  'father.address': (data: BirthCsvRecord) => data.FATHERS_ADDRESS,
  'father.occupation': (data: BirthCsvRecord) => data.FATHERS_OCCUPATION,
  'informant.relation': (data: BirthCsvRecord) => data.INFORMANTS_RELATIONSHIP,
  'informant.other.relation': (data: BirthCsvRecord) =>
    data.INFORMANTS_RELATIONSHIP, // Calculate
  'informant.name': (data: BirthCsvRecord) => data.INFORMANTS_NAME,
  'informant.dob': '',
  'informant.dobUnknown': '',
  'informant.age': '',
  'informant.nationality': '',
  'informant.idType': '',
  'informant.passport': '',
  'informant.bc': '',
  'informant.other': '',
  'informant.address': (data: BirthCsvRecord) => data.INFORMANTS_ADDRESS,
  'informant.occupation': (data: BirthCsvRecord) => data.INFORMANTS_OCCUPATION,
  'informant.phoneNo': '',
  'informant.email': '',
}
