import { CsvFields } from '../helpers/csvTypes.ts'

export const adoptionResolver = {
  'reason.option': '',
  'reason.other': '',
  'child.brnSearch': '',
  'child.brn': (data: CsvFields) => data.adoption.BIRTH_REF,
  'child.name': (data: CsvFields) => data.adoption.CHILDS_NAME,
  'child.dob': (data: CsvFields) => data.adoption.CHILDS_DOB,
  'child.gender': (data: CsvFields) => data.adoption.CHILDS_GENDER,
  'child.birthLocation': (data: CsvFields) => data.adoption.CHILDS_BIRTHPLACE,
  'consent.notProvidedOrWaived': '',
  'consent.numberOfParties': '',
  'consenter.cp1.name': '',
  'consenter.cp1.relationship': '',
  'consenter.cp1.relationshipSpecify': '',
  'consenter.cp1.dob': '',
  'consenter.cp1.dobUnknown': '',
  'consenter.cp1.age': '',
  'consenter.cp1.residence': '',
  'consenter.cp1.occupation': '',
  'consenter.cp2.name': '',
  'consenter.cp2.relationship': '',
  'consenter.cp2.relationshipSpecify': '',
  'consenter.cp2.dob': '',
  'consenter.cp2.dobUnknown': '',
  'consenter.cp2.age': '',
  'consenter.cp2.residence': '',
  'consenter.cp2.occupation': '',
  'adoptiveMother.detailsUnavailable': '',
  'adoptiveMother.unavailableReason': '',
  'adoptiveMother.name': (data: CsvFields) => data.adoption.MOTHERS_NAME,
  'adoptiveMother.dob': (data: CsvFields) => data.adoption.MOTHERS_DOB,
  'adoptiveMother.dobUnknown': '', // Calculate
  'adoptiveMother.age': (data: CsvFields) => data.adoption.MOTHERS_AGE,
  'adoptiveMother.maritalStatus': '',
  'adoptiveMother.maidenName': (data: CsvFields) =>
    data.adoption.MOTHERS_MAIDEN_NAME,
  'adoptiveMother.placeOfBirth': (data: CsvFields) =>
    data.adoption.MOTHERS_BIRTHPLACE,
  'adoptiveMother.nationality': (data: CsvFields) =>
    data.adoption.MOTHERS_NATIONALITY,
  'adoptiveMother.idType': '',
  'adoptiveMother.idTypeOther': '',
  'adoptiveMother.idNumber': '',
  'adoptiveMother.residence': (data: CsvFields) =>
    data.adoption.MOTHERS_ADDRESS,
  'adoptiveMother.occupation': '',
  'adoptiveFather.detailsUnavailable': '',
  'adoptiveFather.unavailableReason': '',
  'adoptiveFather.name': (data: CsvFields) => data.adoption.FATHERS_NAME,
  'adoptiveFather.dob': (data: CsvFields) => data.adoption.FATHERS_DOB,
  'adoptiveFather.dobUnknown': '', // Calculate
  'adoptiveFather.age': (data: CsvFields) => data.adoption.FATHERS_AGE,
  'adoptiveFather.placeOfBirth': (data: CsvFields) =>
    data.adoption.FATHERS_BIRTHPLACE,
  'adoptiveFather.nationality': (data: CsvFields) =>
    data.adoption.FATHERS_NATIONALITY,
  'adoptiveFather.idType': '',
  'adoptiveFather.idTypeOther': '',
  'adoptiveFather.idNumber': '',
  'adoptiveFather.residence': (data: CsvFields) =>
    data.adoption.FATHERS_ADDRESS,
  'adoptiveFather.occupation': (data: CsvFields) =>
    data.adoption.FATHERS_OCCUPATION,
  'adoptionOrder.number': (data: CsvFields) => data.adoption.ADOPTION_REF,
  'adoptionOrder.issuingAuthority': () => 'High Court of the Cook Islands',
  'adoptionOrder.date': (data: CsvFields) => data.adoption.DATE_REGISTERED,
  'adoptionOrder.changesChildLegalName': '', // Calculate
  'adoptionOrder.childNewName': (data: CsvFields) =>
    data.adoption.CHILDS_NEW_NAME,
}

export const adoptionMetaDataMapping: Record<string, string> = {
  registrationNumber: 'adoption.ADOPTION_REF',
  dateOfRegistration: 'adoption.DATE_REGISTERED',
  registrar: 'adoption.REGISTRAR',
}

export const adoptionNameMapping: Record<string, string> = {
  'adoptiveMother.name.firstname': 'adoption.MOTHERS_NAME',
  'adoptiveMother.name.surname': 'adoption.MOTHERS_SURNAME',
  'adoptiveFather.name.firstname': 'adoption.FATHERS_NAME',
  'adoptiveFather.name.surname': 'adoption.FATHERS_SURNAME',
}
