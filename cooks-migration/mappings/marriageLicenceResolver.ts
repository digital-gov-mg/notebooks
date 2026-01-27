import { CsvFields } from '../helpers/csvTypes.ts'

export const marriageLicenceResolver = {
  'informant.contact': '',
  'reason.option': '',
  'reason.other': '',
  'noticeOfIntendedMarriageDetails.dateOfNoticeLodgement': '',
  'noticeOfIntendedMarriageDetails.dateOfMarriage': (data: CsvFields) =>
    data.marriage.MARRIAGE_DATE,
  'noticeOfIntendedMarriageDetails.placeOfMarriage': (data: CsvFields) =>
    data.marriage.MARRIAGE_PLACE,
  'noticeOfIntendedMarriageDetails.venueName': (data: CsvFields) =>
    data.marriage.CHURCH_NAME,
  'noticeOfIntendedMarriageDetails.officiantType': '',
  'noticeOfIntendedMarriageDetails.officiantFullName': (data: CsvFields) =>
    data.marriage.PASTOR_NAME,
  'noticeOfIntendedMarriageDetails.officiantOrganisation': (data: CsvFields) =>
    data.marriage.DENOMINATION,
  'brideGroom.name': (data: CsvFields) => data.marriage.GROOM_FIRSTNAME,
  'brideGroom.dob': (data: CsvFields) => data.marriage.GROOM_DOB,
  'brideGroom.placeOfBirth': (data: CsvFields) =>
    data.marriage.GROOM_BIRTHPLACE,
  'brideGroom.occupation': (data: CsvFields) => data.marriage.GROOM_OCCUPATION,
  'brideGroom.conjugalStatus': (data: CsvFields) => data.marriage.GROOM_STATUS,
  'brideGroom.dateDecreeAbsolute': '',
  'brideGroom.dateDeathFormerWife': (data: CsvFields) =>
    data.marriage.GROOM_DOD_WIDOW,
  'brideGroom.address': (data: CsvFields) => data.marriage.GROOM_RESIDENCE,
  'brideGroom.fatherFullName': (data: CsvFields) => data.marriage.GROOM_FATHER,
  'brideGroom.fatherOccupation': (data: CsvFields) =>
    data.marriage.GROOM_FATHER_JOB,
  'brideGroom.motherFullName': (data: CsvFields) => data.marriage.GROOM_MOTHER,
  'brideGroom.motherMaidenSurname': (data: CsvFields) =>
    data.marriage.GROOM_MOTHER_MAIDEN,
  'brideGroom.motherOccupation': '',
  'bride.name': (data: CsvFields) => data.marriage.BRIDE_FIRSTNAME,
  'bride.dob': (data: CsvFields) => data.marriage.BRIDE_DOB,
  'bride.placeOfBirth': (data: CsvFields) => data.marriage.BRIDE_BIRTHPLACE,
  'bride.occupation': (data: CsvFields) => data.marriage.BRIDE_OCCUPATION,
  'bride.conjugalStatus': (data: CsvFields) => data.marriage.BRIDE_STATUS,
  'bride.dateOfDecreeAbsolute': '',
  'bride.dateOfDeathOfFormerHusband': (data: CsvFields) =>
    data.marriage.BRIDE_DOD_WIDOWER,
  'bride.address': (data: CsvFields) => data.marriage.BRIDE_RESIDENCE,
  'bride.fatherName': (data: CsvFields) => data.marriage.BRIDE_FATHER,
  'bride.fatherOccupation': (data: CsvFields) => data.marriage.BRIDE_FATHER_JOB,
  'bride.motherName': (data: CsvFields) => data.marriage.BRIDE_MOTHER,
  'bride.motherMaidenSurname': (data: CsvFields) =>
    data.marriage.BRIDE_MOTHER_MAIDEN,
  'bride.motherOccupation': '',
  'informantDetails.informantType': '',
  'informantDetails.relationshipToCouple': '',
  'informantDetails.name': '',
  'informantDetails.dob': '',
  'informantDetails.dobUnknown': '',
  'informantDetails.age': '',
  'informantDetails.nationality': '',
  'informantDetails.idType': '',
  'informantDetails.passport': '',
  'informantDetails.bc': '',
  'informantDetails.other': '',
  'informantDetails.address': '',
  'informantDetails.occupation': '',
  'informantDetails.phoneNumber': '',
  'informantDetails.email': '',
}

export const marriageLicenceMetaDataMapping: Record<string, string> = {
  registrationNumber: 'marriage.NOTICE_NUMBER', // That could make this not unique since it's used in marriage registrations too
  dateOfRegistration: 'marriage.MARRIAGE_DATE',
  registrar: 'marriage.REGISTRAR',
}

export const marriageLicenceNameMapping: Record<string, string> = {
  'brideGroom.name.firstname': 'marriage.GROOM_FIRSTNAME',
  'brideGroom.name.surname': 'marriage.GROOM_LASTNAME',
  'bride.name.firstname': 'marriage.BRIDE_FIRSTNAME',
  'bride.name.surname': 'marriage.BRIDE_LASTNAME',
}
