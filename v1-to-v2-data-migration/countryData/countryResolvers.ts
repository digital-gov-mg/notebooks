import { isValidDate, normalizeDateString } from '../helpers/dateUtils.ts';
import { getCustomField, getDocuments } from '../helpers/resolverUtils.ts'
import { EventRegistration } from '../helpers/types.ts'
import pairs from './unResolvedBirthFields.json' with { type: 'json' };

const initialCountryResolver = {
  'child.birthTime': (data: EventRegistration) =>
    getCustomField(data, 'birth.child.child-view-group.birthTime'),
  'child.iD': (data: EventRegistration) => data.child?.identifier?.[0]?.id,
  'child.legacyBirthRegistrationNumber': (data: EventRegistration) =>
    getCustomField(
      data,
      'birth.child.child-view-group.legacyBirthRegistrationNumber'
    ),
  'child.legacyBirthRegistrationDate': (data: EventRegistration) =>
    {
    const field = data?.questionnaire?.find(
      ({ fieldId }: { fieldId: string }) => fieldId === 'birth.child.child-view-group.legacyBirthRegistrationDate'
    )

    if (!field) return undefined

    const dateStr = field?.value

    if (isValidDate(dateStr)) {
      const normalized = normalizeDateString(dateStr);
      return normalized
    }
    console.log('Invalid legacyBirthRegistrationDate :>> ', dateStr);
    // Try and get date the record was registered
    const dateFromStatus = data.registration?.status.reverse().find(status => status.type === 'REGISTERED')?.timestamp.split('T')[0]
    //console.log('returning either dateFromStatus or a default date :>> ',  dateFromStatus ? dateFromStatus : '2026-01-01');
    return dateFromStatus ?? '2026-01-01'
  }
    /* getCustomField(
      data,
      'birth.child.child-view-group.legacyBirthRegistrationDate'
    ) */,
  'child.legacyBirthRegistrationTime': (data: EventRegistration) =>
    getCustomField(
      data,
      'birth.child.child-view-group.legacyBirthRegistrationTime'
    ),
  'informant.customizedExactDateOfBirthUnknown': (data: EventRegistration) => {
    const val = getCustomField(data, 'birth.informant.informant-view-group.customizedExactDateOfBirthUnknown')
    if (val === 'true' || val === true) return true
    if (val === 'false' || val === false) return false
    if (val != null) return true // année ou autre valeur non-boolean = date inconnue
    return undefined
  },
  'informant.yearOfBirth': (data: EventRegistration) =>
    getCustomField(data, 'birth.informant.informant-view-group.yearOfBirth'),
  'informant.iD': (data: EventRegistration) =>
    data.informant?.identifier?.[0]?.id?.toString(),
  'informant.birthPlace': (data: EventRegistration) =>
    getCustomField(data, 'birth.informant.informant-view-group.birthPlace'),
  'informant.occupation': (data: EventRegistration) =>
    data.informant?.occupation,
  'mother.motherIsDeceased': (data: EventRegistration) =>
    getCustomField(data, 'birth.mother.mother-view-group.motherIsDeceased'),
  /* 'mother.address.streetLevelDetails.fokontanyCustomAddress': (data) => getCustomField(data,'birth.mother.mother-view-group.fokontanyCustomAddress'), */
  'mother.customizedExactDateOfBirthUnknown': (data: EventRegistration) => {
    const val = getCustomField(data, 'birth.mother.mother-view-group.customizedExactDateOfBirthUnknown')
    if (val === 'true' || val === true) return true
    if (val === 'false' || val === false) return false
    if (val != null) return true
    return undefined
  },
  'mother.yearOfBirth': (data: EventRegistration) =>
    getCustomField(data, 'birth.mother.mother-view-group.yearOfBirth'),
  'mother.iD': (data: EventRegistration) => data.mother?.identifier?.[0]?.id,
  'mother.birthPlace': (data: EventRegistration) =>
    getCustomField(data, 'birth.mother.mother-view-group.birthPlace'),
  'father.fatherIsDeceased': (data: EventRegistration) =>
    getCustomField(data, 'birth.father.father-view-group.fatherIsDeceased'),
  'father.fatherHasFormallyRecognisedChild': (data: EventRegistration) =>
    getCustomField(
      data,
      'birth.father.father-view-group.fatherHasFormallyRecognisedChild'
    ),
  'father.customizedExactDateOfBirthUnknown': (data: EventRegistration) => {
    const val = getCustomField(data, 'birth.father.father-view-group.customizedExactDateOfBirthUnknown')
    if (val === 'true' || val === true) return true
    if (val === 'false' || val === false) return false
    if (val != null) return true
    return undefined
  },
  'father.yearOfBirth': (data: EventRegistration) =>
    getCustomField(data, 'birth.father.father-view-group.yearOfBirth'),
  'father.iD': (data: EventRegistration) => data.father?.identifier?.[0]?.id,
  'father.birthPlace': (data: EventRegistration) =>
    getCustomField(data, 'birth.father.father-view-group.birthPlace'),
  'documents.upload': (data: EventRegistration) =>
    !!data?.registration?.attachments,
  'documents.proofOther': (data: EventRegistration) =>
    getDocuments(data, 'LEGAL_GUARDIAN_PROOF'),
}

const unResolvedBirthFieldsResolverObject = Object.fromEntries(
  (pairs as [string, string][]).map(([v1, v2]) => [
    v2,
    (data: EventRegistration) => getCustomField(data, v1)
  ])
);


export const countryResolver = {
  ...initialCountryResolver,
  ...unResolvedBirthFieldsResolverObject
}

/* 
'child.createNUI': ,
'child.nuiGenerator': ,
'birth.child-view-group.fokontanyCustomAddress' : 'child.address.privateHome.fokontanyCustomAddress',
'birth.child-view-group.otherPlaceOfBirthAddress' : 'child.address.other', */
/* 'birth.child-view-group.nuiGeneratorError' : '', */
/* 'birth.child-view-group.iDManual' : '', */
/* 'birth.informant-view-group.fokontanyCustomAddress' : 'informant.address.streetLevelDetails.fokontanyCustomAddress',  */
/* 'birth.father-view-group.fokontanyCustomAddress' : 'father.address.streetLevelDetails.fokontanyCustomAddress' */
/* 'birth.documents-view-group.uploadDocForRecognition' : '' */
export const birthSpecialInformants = ['MOTHER', 'FATHER']
export const deathSpecialInformants = ['SPOUSE']
