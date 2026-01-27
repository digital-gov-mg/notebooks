// CSV record types based on source data

/**
 * Birth register CSV record
 */
export type BirthCsvRecord = {
  Check: string
  BIRTH_REF: string
  CHILDS_NAME: string
  CHILDS_DOB: string
  CHILDS_BIRTHPLACE: string
  CHILDS_GENDER: string
  CHILDS_TWIN: string
  CHILDS_NEW_NAME: string
  FATHERS_NAME: string
  FATHERS_SURNAME: string
  FATHERS_OCCUPATION: string
  FATHERS_AGE: string
  FATHERS_DOB: string
  FATHERS_BIRTHPLACE: string
  FATHERS_ADDRESS: string
  FATHERS_RACE: string
  FATHERS_NATIONALITY: string
  MOTHERS_NAME: string
  MOTHERS_SURNAME: string
  MOTHERS_MAIDEN_NAME: string
  MOTHERS_AGE: string
  MOTHERS_DOB: string
  MOTHERS_BIRTHPLACE: string
  MOTHERS_ADDRESS: string
  MOTHERS_RACE: string
  MOTHERS_NATIONALITY: string
  WHEN_MARRIED: string
  WHERE_MARRIED: string
  LIVING_FEMALES: string
  LIVING_MALES: string
  DEAD_FEMALES: string
  DEAD_MALES: string
  INFORMANTS_NAME: string
  INFORMANTS_ADDRESS: string
  INFORMANTS_RELATIONSHIP: string
  REGISTRAR: string
  DATE_REGISTERED: string
  STATUS_FLAG: string
  ADOPT_BOOK_REF: string
  ADOP_REC_REF: string
  DEATH_REF: string
  MARRIAGE_REF: string
  INFORMANTS_OCCUPATION: string
  EXTRA_INFO: string
  FATHERS_REF: string
  MOTHERS_REF: string
  DP_REF: string
  NZ_CITIZEN: string
  CITIZEN_RIGHT_FROM: string
  CITIZENSHIP_PROOF: string
  DOCUMENT_NR: string
}

/**
 * Death register CSV record
 */
export type DeathCsvRecord = {
  Check: string
  DEATH_NUMBER: string
  WHEN_DIED: string
  WHERE_DIED: string
  USUAL_RESIDENCE: string
  NAME_OF_DECEASED: string
  OCCUPATION: string
  SEX: string
  AGE: string
  CAUSE_OF_DEATH: string
  MEDICAL_ATTENDANT: string
  DATE_LAST_ALIVE: string
  MOTHERS_NAME: string
  MOTHERS_MAIDEN_NAME: string
  FATHERS_NAME: string
  FATHERS_OCCUPATION: string
  WHEN_BURIED: string
  WHERE_BURIED: string
  WHERE_BORN: string
  LENGTH_IN_CIS: string
  WHERE_MARRIED: string
  WHEN_MARRIED: string
  WHOM_MARRIED: string
  AGE_OF_WIDOW: string
  LIVING_FEMALES: string
  LIVING_MALES: string
  REGISTRAR: string
  DATE_REGISTERED: string
  PLACE_REGISTERED: string
  BIRTH_REF: string
  DEATH_BOOK_REF: string
  INFORMANT_DESCRIPTION: string
  INFORMANT_RESIDENCE: string
  EXTRA_INFORMATION: string
}

/**
 * Marriage register CSV record
 */
export type MarriageCsvRecord = {
  NOTICE_NUMBER: string
  MARRIAGE_NO: string
  MARRIAGE_DATE: string
  MARRIAGE_PLACE: string
  GROOM_FIRSTNAME: string
  GROOM_LASTNAME: string
  GROOM_STATUS: string
  GROOM_DOD_WIDOW: string
  GROOM_AGE: string
  GROOM_BIRTHPLACE: string
  GROOM_OCCUPATION: string
  GROOM_RESIDENCE: string
  GROOM_FATHER: string
  GROOM_FATHER_JOB: string
  GROOM_MOTHER: string
  GROOM_MOTHER_MAIDEN: string
  BRIDE_FIRSTNAME: string
  BRIDE_LASTNAME: string
  BRIDE_MAIDEN_NAME: string
  BRIDE_STATUS: string
  BRIDE_DOD_WIDOWER: string
  BRIDE_AGE: string
  BRIDE_BIRTHPLACE: string
  BRIDE_OCCUPATION: string
  BRIDE_RESIDENCE: string
  BRIDE_FATHER: string
  BRIDE_FATHER_JOB: string
  BRIDE_MOTHER: string
  BRIDE_MOTHER_MAIDEN: string
  WITNESS_1: string
  WITNESS_2: string
  PASTOR_NAME: string
  DENOMINATION: string
  CHURCH_NAME: string
  ISLAND: string
  REGISTRAR: string
  LICENCE_EXPIRY_DATE: string
  Dissolved: string
  Extra_info: string
  Witness1_Address: string
  Witness2_Address: string
  GROOM_DOB: string
  BRIDE_DOB: string
}

/**
 * Adoption register CSV record
 */
export type AdoptionCsvRecord = {
  Check: string
  ADOPTION_REF: string
  CHILDS_NAME: string
  CHILDS_DOB: string
  CHILDS_BIRTHPLACE: string
  CHILDS_GENDER: string
  CHILDS_TWIN: string
  CHILDS_NEW_NAME: string
  FATHERS_NAME: string
  FATHERS_SURNAME: string
  FATHERS_OCCUPATION: string
  FATHERS_AGE: string
  FATHERS_DOB: string
  FATHERS_BIRTHPLACE: string
  FATHERS_ADDRESS: string
  FATHERS_RACE: string
  FATHERS_NATIONALITY: string
  MOTHERS_NAME: string
  MOTHERS_SURNAME: string
  MOTHERS_MAIDEN_NAME: string
  MOTHERS_AGE: string
  MOTHERS_DOB: string
  MOTHERS_BIRTHPLACE: string
  MOTHERS_ADDRESS: string
  MOTHERS_RACE: string
  MOTHERS_NATIONALITY: string
  REGISTRAR: string
  DATE_REGISTERED: string
  STATUS_FLAG: string
  BIRTH_REF: string
  DEATH_REF: string
  MARRIAGE_REF: string
  EXTRA_INFO: string
  FATHERS_REF: string
  MOTHERS_REF: string
  ACT: string
  DP_REF: string
  NZ_CITIZEN: string
  CITIZEN_RIGHT_FROM: string
  CITIZENSHIP_PROOF: string
  DOCUMENT_NR: string
}

/**
 * Deedpoll register CSV record
 */
export type DeedpollCsvRecord = {
  DP_REF: string
  BIRTH_REF: string
  ADOPTION_REF: string
  OLD_FIRSTNAMES: string
  OLD_SURNAME: string
  NEW_FIRSTNAMES: string
  NEW_SURNAME: string
  ISLAND: string
  DATE: string
  WITNESS: string
  WITNESS_ADDRESS: string
  WITNESS_OCCUPATION: string
}

/**
 * Main type for all CSV fields returned by readCsvHeader
 */
export type CsvFields = {
  birth: BirthCsvRecord[]
  death: DeathCsvRecord[]
  marriage: MarriageCsvRecord[]
  adoption: AdoptionCsvRecord[]
  deedpoll: DeedpollCsvRecord[]
}
