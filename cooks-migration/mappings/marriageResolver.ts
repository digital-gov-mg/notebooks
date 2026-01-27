import { CsvFields } from '../helpers/csvTypes.ts'

export const marriageResolver = {
  'informant.contact': '',
  'reason.option': '',
  'reason.other': '',
  'marriageDetails.licenceNumber': (data: CsvFields) =>
    data.marriage.NOTICE_NUMBER,
  'marriageDetails.expiryDate': (data: CsvFields) =>
    data.marriage.LICENCE_EXPIRY_DATE,
  'marriageDetails.dateOfMarriage': (data: CsvFields) =>
    data.marriage.MARRIAGE_DATE,
  'marriageDetails.address': (data: CsvFields) => data.marriage.MARRIAGE_PLACE,
  'marriageDetails.venueName': (data: CsvFields) => data.marriage.CHURCH_NAME,
  'marriageDetails.officiantType': '',
  'marriageDetails.officiantFullName': (data: CsvFields) =>
    data.marriage.PASTOR_NAME,
  'marriageDetails.officiantAffiliation': (data: CsvFields) =>
    data.marriage.DENOMINATION,
  'marriageDetails.bridegroomName': (data: CsvFields) =>
    data.marriage.GROOM_FIRSTNAME,
  'marriageDetails.bridegroomDob': (data: CsvFields) => data.marriage.GROOM_DOB,
  'marriageDetails.bridegroomPlaceOfBirth': (data: CsvFields) =>
    data.marriage.GROOM_BIRTHPLACE,
  'marriageDetails.bridegroomOccupation': (data: CsvFields) =>
    data.marriage.GROOM_OCCUPATION,
  'marriageDetails.bridegroomConjugalStatus': (data: CsvFields) =>
    data.marriage.GROOM_STATUS,
  'marriageDetails.bridegroomDateOfDecreeAbsolute': '',
  'marriageDetails.bridegroomDateOfDeathFormerWife': (data: CsvFields) =>
    data.marriage.GROOM_DOD_WIDOW,
  'marriageDetails.bridegroomAddress': (data: CsvFields) =>
    data.marriage.GROOM_RESIDENCE,
  'marriageDetails.brideName': (data: CsvFields) =>
    data.marriage.BRIDE_FIRSTNAME,
  'marriageDetails.brideDob': (data: CsvFields) => data.marriage.BRIDE_DOB,
  'marriageDetails.bridePlaceOfBirth': (data: CsvFields) =>
    data.marriage.BRIDE_BIRTHPLACE,
  'marriageDetails.brideOccupation': (data: CsvFields) =>
    data.marriage.BRIDE_OCCUPATION,
  'marriageDetails.brideConjugalStatus': (data: CsvFields) =>
    data.marriage.BRIDE_STATUS,
  'marriageDetails.brideDateOfDecreeAbsolute': '',
  'marriageDetails.brideDateOfDeathFormerHusband': (data: CsvFields) =>
    data.marriage.BRIDE_DOD_WIDOWER,
  'marriageDetails.brideAddress': (data: CsvFields) =>
    data.marriage.BRIDE_RESIDENCE,
  'informantDetails.informantType': '',
  'informantDetails.relationshipToOfficiantOrCouple': '',
  'informantDetails.name': '',
  'informantDetails.phoneNumber': '',
  'informantDetails.email': '',
  'supportingDocuments.marriageRegisterForm': '',
  'supportingDocuments.authorisationLetter': '',
}

export const marriageMetaDataMapping: Record<string, string> = {
  registrationNumber: 'marriage.NOTICE_NUMBER',
  dateOfRegistration: 'marriage.MARRIAGE_DATE',
  registrar: 'marriage.REGISTRAR',
}

export const marriageNameMapping: Record<string, string> = {
  'marriageDetails.bridegroomName.firstname': 'marriage.GROOM_FIRSTNAME',
  'marriageDetails.bridegroomName.surname': 'marriage.GROOM_LASTNAME',
  'marriageDetails.brideName.firstname': 'marriage.BRIDE_FIRSTNAME',
  'marriageDetails.brideName.surname': 'marriage.BRIDE_LASTNAME',
}
