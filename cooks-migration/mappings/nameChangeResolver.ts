import { CsvFields } from '../helpers/csvTypes.ts'

export const nameChangeResolver = {
  'reason.option': '',
  'reason.other': '',
  'subjects.nationality': '',
  'subjects.brn': (data: CsvFields) => data.deedpoll.BIRTH_REF,
  'subjects.brnText': '',
  'subjects.name': (data: CsvFields) => data.birth.CHILDS_NAME,
  'subjects.dob': (data: CsvFields) => data.birth.CHILDS_DOB,
  'subjects.address': (data: CsvFields) => data.deedpoll.ISLAND, // Not so sure about this
  'subjects.nameChangedViaDeadPoll': '',
  'subjects.nameChange1.deedPollNumber': (data: CsvFields) =>
    data.deedpoll.DP_REF,
  'subjects.nameChange1.firstname': (data: CsvFields) =>
    data.deedpoll.NEW_FIRSTNAMES,
  'subjects.nameChange1.surname': (data: CsvFields) =>
    data.deedpoll.NEW_SURNAME,
  'subjects.nameChange1.addAnother': '',
  'subjects.nameChange2.deedPollNumber': (data: CsvFields) =>
    data.deedpoll.DP_REF,
  'subjects.nameChange2.firstname': (data: CsvFields) =>
    data.deedpoll.NEW_FIRSTNAMES,
  'subjects.nameChange2.surname': (data: CsvFields) =>
    data.deedpoll.NEW_SURNAME,
  'subjects.nameChange2.addAnother': '',
  'subjects.nameChange3.deedPollNumber': (data: CsvFields) =>
    data.deedpoll.DP_REF,
  'subjects.nameChange3.firstname': (data: CsvFields) =>
    data.deedpoll.NEW_FIRSTNAMES,
  'subjects.nameChange3.surname': (data: CsvFields) =>
    data.deedpoll.NEW_SURNAME,
  'newName.name.firstname': (data: CsvFields) => data.deedpoll.NEW_FIRSTNAMES,
  'newName.name.surname': (data: CsvFields) => data.deedpoll.NEW_SURNAME, // Sort by date to determine latest?
  'newName.reason': '',
  'informant.informantType': '',
  'informant.relationship': '',
  'informant.name': '',
  'informant.dob': '',
  'informant.dobUnknown': '',
  'informant.age': '',
  'informant.idType': '',
  'informant.passport': '',
  'informant.bc': '',
  'informant.idOther': '',
  'informant.address': '',
  'informant.address.city': '',
  'informant.phone': '',
  'informant.email': '',
  'witness.name': (data: CsvFields) => data.deedpoll.WITNESS,
  'witness.occupation': (data: CsvFields) => data.deedpoll.WITNESS_OCCUPATION,
  'witness.address': (data: CsvFields) => data.deedpoll.WITNESS_ADDRESS,
}

export const nameChangeMetaDataMapping: Record<string, string> = {
  registrationNumber: 'deedpoll.DP_REF', //doesn't look unique
  dateOfRegistration: 'deedpoll.DATE',
}
