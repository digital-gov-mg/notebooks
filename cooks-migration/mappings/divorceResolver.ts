import { CsvFields } from '../helpers/csvTypes.ts'

// Note: Divorce mappings use the same legacy field names as marriage registration
export const divorceResolver = {
  'informant.contact': '',
  'reason.option': '',
  'reason.other': '',
  'applicationDetails.typeOfApplication': '',
  'applicationDetails.applicantParty': '',
  'marriageDetails.marriageRegistrationNumber': (data: CsvFields) =>
    data.marriage.NOTICE_NUMBER,
  'marriageDetails.dateOfMarriage': (data: CsvFields) =>
    data.marriage.MARRIAGE_DATE,
  'marriageDetails.placeOfMarriage': (data: CsvFields) =>
    data.marriage.MARRIAGE_PLACE,
  'marriageDetails.bridegroomGivenNames': (data: CsvFields) =>
    data.marriage.GROOM_FIRSTNAME,
  'marriageDetails.bridegroomDob': (data: CsvFields) => data.marriage.GROOM_DOB,
  'marriageDetails.bridegroompob': (data: CsvFields) =>
    data.marriage.GROOM_BIRTHPLACE,
  'marriageDetails.bridegroomOccupation': (data: CsvFields) =>
    data.marriage.GROOM_OCCUPATION,
  'marriageDetails.bridegroomConjugalStatus': (data: CsvFields) =>
    data.marriage.GROOM_STATUS,
  'marriageDetails.bridegroomDecreeAbsoluteDate': '',
  'marriageDetails.bridegroomFormerWifeDeathDate': (data: CsvFields) =>
    data.marriage.GROOM_DOD_WIDOW,
  'marriageDetails.residence': (data: CsvFields) =>
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
  'marriageDetails.brideDecreeAbsoluteDate': '',
  'marriageDetails.brideFormerHusbandDeathDate': (data: CsvFields) =>
    data.marriage.BRIDE_DOD_WIDOWER,
  'marriageDetails.brideResidence': (data: CsvFields) =>
    data.marriage.BRIDE_RESIDENCE,
  'divorceOrderDetails.orderNumber': '',
  'divorceOrderDetails.issuingAuthority': '',
  'divorceOrderDetails.orderDate': '',
}
