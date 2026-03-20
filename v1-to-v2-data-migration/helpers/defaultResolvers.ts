import {
  getCustomField,
  getDocument,
  getDocuments,
  getIdentifier,
  isSpecialInformant,
} from './resolverUtils.ts'
import {
  COUNTRY_PHONE_CODE,
  resolveAddress,
} from '../countryData/addressResolver.ts'
import { EventRegistration, ResolverMap } from './types.ts'
import { resolveName } from '../countryData/nameResolver.ts'
import { getCustomFieldVerificationStatus } from '../countryData/verificationResolver.ts'
import { isValidDate, normalizeDateString } from './dateUtils.ts'

const informantResolver: ResolverMap = {
  'informant.dob': (data: EventRegistration, eventType: 'birth' | 'death') =>
    !isSpecialInformant(data.informant, eventType)
      ? data.informant?.birthDate
      : undefined, // type: 'DATE',
  /* @todo Addresses need to be properly handled */
  'informant.address': (
    data: EventRegistration,
    eventType: 'birth' | 'death'
  ) =>
    !isSpecialInformant(data.informant, eventType)
      ? resolveAddress(data, data.informant?.address?.[0])
      : undefined, // type: FieldType.ADDRESS,
  // @question, is informant.telecom correct or this?
  'informant.phoneNo': (
    data: EventRegistration,
    eventType: 'birth' | 'death'
  ) => data.registration.contactPhoneNumber?.replace(COUNTRY_PHONE_CODE, '0'), // @todo https://github.com/opencrvs/opencrvs-core/issues/9601
  'informant.email': (data: EventRegistration, eventType: 'birth' | 'death') =>
    data.registration.contactEmail, // type: FieldType.EMAIL,
  'informant.relation': (
    data: EventRegistration,
    eventType: 'birth' | 'death'
  ) => data.informant?.relationship, // FieldType.SELECT
  'informant.other.relation': (
    data: EventRegistration,
    eventType: 'birth' | 'death'
  ) => data.informant?.otherRelationship, // FieldType.TEXT
  'informant.name': (data: EventRegistration, eventType: 'birth' | 'death') =>
    !isSpecialInformant(data.informant, eventType)
      ? resolveName(data, data.informant?.name?.[0])
      : undefined, // FieldType.TEXT
  'informant.dobUnknown': (
    data: EventRegistration,
    eventType: 'birth' | 'death'
  ) => {
    if (isSpecialInformant(data.informant, eventType)) {
      return undefined
    }
    if (data.informant?.birthDate) {
      return false
    }

    return data.informant?.exactDateOfBirthUnknown
  }, // FieldType.CHECKBOX
  // @question, is this informant.age or informant.ageOfIndividualInYears?
  'informant.age': (data: EventRegistration, eventType: 'birth' | 'death') => {
    if (isSpecialInformant(data.informant, eventType)) {
      return undefined
    }
    if (data.informant?.birthDate) {
      return undefined
    }

    return (
      data.informant?.ageOfIndividualInYears && {
        age: parseInt(data.informant?.ageOfIndividualInYears?.toString(), 10),
        asOfDateRef: eventType == 'birth' ? 'child.dob' : 'eventDetails.date',
      }
    )
  },
  'informant.nationality': (
    data: EventRegistration,
    eventType: 'birth' | 'death'
  ) =>
    !isSpecialInformant(data.informant, eventType)
      ? data.informant?.nationality?.[0]
      : undefined, // FieldType.COUNTRY
  'informant.brn': (data: EventRegistration, eventType: 'birth' | 'death') =>
    !isSpecialInformant(data.informant, eventType)
      ? getIdentifier(data.informant, 'BIRTH_REGISTRATION_NUMBER')
      : undefined,
  'informant.nid': (data: EventRegistration, eventType: 'birth' | 'death') =>
    !isSpecialInformant(data.informant, eventType)
      ? getIdentifier(data.informant, 'NATIONAL_ID')
      : undefined,
  'informant.passport': (
    data: EventRegistration,
    eventType: 'birth' | 'death'
  ) =>
    !isSpecialInformant(data.informant, eventType)
      ? getIdentifier(data.informant, 'PASSPORT')
      : undefined,
}

export const documentsResolver: ResolverMap = {
  'documents.proofOfBirth': (data: EventRegistration) =>
    getDocuments(data, 'CHILD'),
  'documents.proofOfMother': (data: EventRegistration) =>
    getDocuments(data, 'MOTHER'),
  'documents.proofOfFather': (data: EventRegistration) =>
    getDocuments(data, 'FATHER'),
  'documents.proofOfRecognition': (data: EventRegistration) =>
    getDocuments(data, 'OTHER'),
  'documents.proofOfInformant': (data: EventRegistration) =>
    getDocuments(data, 'INFORMANT_ID_PROOF'),
  'documents.proofOther': (data: EventRegistration) =>
    (getDocuments(data, 'OTHER') || []).concat(
      getDocuments(data, 'LEGAL_GUARDIAN_PROOF') || []
    ),
  'documents.proofOfDeceased': (data: EventRegistration) =>
    getDocuments(data, 'DECEASED_ID_PROOF'),
  'documents.proofOfDeath': (data: EventRegistration) =>
    getDocuments(data, 'DECEASED_DEATH_PROOF'),
  'documents.proofOfCauseOfDeath': (data: EventRegistration) =>
    getDocuments(data, 'DECEASED_DEATH_CAUSE_PROOF'),
}

function mapMannerOfDeath(mannerOfDeath: string | undefined): any {
  const mannerMap = {
    NATURAL_CAUSES: 'MANNER_NATURAL',
    ACCIDENT: 'MANNER_ACCIDENT',
    HOMICIDE: 'MANNER_HOMICIDE',
    SUICIDE: 'MANNER_SUICIDE',
    MANNER_UNDETERMINED: 'MANNER_UNDETERMINED',
  }
  return mannerMap[mannerOfDeath as keyof typeof mannerMap]
}

export const defaultDeathResolver: ResolverMap = {
  'deceased.name': (data: EventRegistration) =>
    resolveName(data, data.deceased?.name?.[0]),
  'deceased.gender': (data: EventRegistration) => data.deceased?.gender,
  'deceased.dob': (data: EventRegistration) => data.deceased?.birthDate,
  'deceased.dobUnknown': (data: EventRegistration) =>
    data.deceased?.exactDateOfBirthUnknown,
  'deceased.age': (data: EventRegistration) => ({
    age: data.deceased?.ageOfIndividualInYears,
    asOfDateRef: 'eventDetails.date',
  }),
  'deceased.nationality': (data: EventRegistration) =>
    data.deceased?.nationality?.[0],
  'deceased.idType': (data: EventRegistration) =>
    getCustomField(data, 'death.deceased.deceased-view-group.deceasedIdType'),
  'deceased.nid': (data: EventRegistration) =>
    getIdentifier(data.deceased, 'NATIONAL_ID'),
  'deceased.passport': (data: EventRegistration) =>
    getIdentifier(data.deceased, 'PASSPORT'),
  'deceased.brn': (data: EventRegistration) =>
    getIdentifier(data.deceased, 'BIRTH_REGISTRATION_NUMBER'),
  'deceased.maritalStatus': (data: EventRegistration) =>
    data.deceased?.maritalStatus,
  'deceased.numberOfDependants': (data: EventRegistration) => {
    const numberOfDependants = getCustomField(
      data,
      'death.deceased.deceased-view-group.numberOfDependants'
    )
    return numberOfDependants ? parseInt(numberOfDependants, 10) : undefined
  },
  'deceased.address': (data: EventRegistration) =>
    resolveAddress(data, data.deceased?.address?.[0]),
  'eventDetails.date': (data: EventRegistration) =>
    data.deceased?.deceased?.deathDate || data.deathDate,
  'eventDetails.description': (data: EventRegistration) =>
    data.deathDescription,
  'eventDetails.reasonForLateRegistration': (data: EventRegistration) =>
    getCustomField(
      data,
      'death.deathEvent.death-event-details.reasonForLateRegistration'
    ),
  'eventDetails.causeOfDeathEstablished': (data: EventRegistration) =>
    data.causeOfDeathEstablished === 'true',
  'eventDetails.sourceCauseDeath': (data: EventRegistration) =>
    data.causeOfDeathMethod,
  'eventDetails.mannerOfDeath': (data: EventRegistration) =>
    mapMannerOfDeath(data.mannerOfDeath),
  'eventDetails.placeOfDeath': (data: EventRegistration) =>
    data.eventLocation?.type,
  'eventDetails.deathLocation': (data: EventRegistration) =>
    data.eventLocation?.type === 'HEALTH_FACILITY'
      ? data.eventLocation.id
      : null,
  'eventDetails.deathLocationOther': (data: EventRegistration) =>
    data.eventLocation?.type === 'OTHER'
      ? resolveAddress(data, data.eventLocation.address)
      : null,
  'informant.addressSameAs': (data: EventRegistration) =>
    JSON.stringify(data.informant?.address?.[0]) ===
    JSON.stringify(data.deceased?.address?.[0])
      ? 'YES'
      : 'NO',
  'informant.idType': (data: EventRegistration) =>
    getCustomField(
      data,
      'death.informant.informant-view-group.informantIdType'
    ),
  'spouse.detailsNotAvailable': (data: EventRegistration) =>
    !data.spouse?.detailsExist,
  'spouse.reason': (data: EventRegistration) => data.spouse?.reasonNotApplying,
  'spouse.name': (data: EventRegistration) =>
    resolveName(data, data.spouse?.name?.[0]),
  'spouse.dob': (data: EventRegistration) => data.spouse?.birthDate,
  'spouse.dobUnknown': (data: EventRegistration) =>
    data.spouse?.exactDateOfBirthUnknown,
  'spouse.age': (data: EventRegistration) => ({
    age: data.spouse?.ageOfIndividualInYears,
    asOfDateRef: 'eventDetails.date',
  }),
  'spouse.nationality': (data: EventRegistration) =>
    data.spouse?.nationality?.[0],
  'spouse.idType': (data: EventRegistration) =>
    getCustomField(data, 'death.spouse.spouse-view-group.spouseIdType'),
  'spouse.nid': (data: EventRegistration) =>
    getIdentifier(data.spouse, 'NATIONAL_ID'),
  'spouse.passport': (data: EventRegistration) =>
    getIdentifier(data.spouse, 'PASSPORT'),
  'spouse.brn': (data: EventRegistration) =>
    getIdentifier(data.spouse, 'BIRTH_REGISTRATION_NUMBER'),
  'spouse.address': (data: EventRegistration) =>
    resolveAddress(data, data.spouse?.address?.[0]),
  'spouse.addressSameAs': (data: EventRegistration) =>
    JSON.stringify(data.deceased?.address?.[0]) ===
    JSON.stringify(data.spouse?.address?.[0])
      ? 'YES'
      : 'NO',

  // MOSIP E-Signet / ID Auth verification fields
  'deceased.verified': (data: EventRegistration) =>
    getCustomFieldVerificationStatus(
      data,
      'death.deceased.deceased-view-group.verified'
    ),
  'informant.verified': (data: EventRegistration) =>
    getCustomFieldVerificationStatus(
      data,
      'death.informant.informant-view-group.verified'
    ),
  'spouse.verified': (data: EventRegistration) =>
    getCustomFieldVerificationStatus(
      data,
      'death.spouse.spouse-view-group.verified'
    ),
}

export const defaultBirthResolver: ResolverMap = {
  'child.name': (data: EventRegistration) =>
    resolveName(data, data.child?.name?.[0]),

  /*
   * OPTIONAL FOR COUNTRIES
   */

  'child.gender': (data: EventRegistration) => data.child?.gender,
  'child.dob': (data: EventRegistration) => data.child?.birthDate,
  /*
   * Address fields in different situations
   * @todo Addresses need to be properly handled
   */
  'child.placeOfBirth': (data: EventRegistration) => data.eventLocation?.type,
  'child.birthLocation': (data: EventRegistration) =>
    data.eventLocation?.type === 'HEALTH_FACILITY'
      ? data.eventLocation.id
      : null,
  'child.birthLocation.privateHome': (data: EventRegistration) =>
    data.eventLocation?.type === 'PRIVATE_HOME'
      ? resolveAddress(data, data.eventLocation?.address, 'child')
      : null,
  'child.birthLocation.other': (data: EventRegistration) =>
    data.eventLocation?.type === 'OTHER'
      ? resolveAddress(data, data.eventLocation?.address, 'child')
      : null,
  /*
   * MISSING FIELDS that are in GraphQL but not in the form
   * In GraphQL there's a field "otherAttendantAtBirth". I wonder what that is
   */
  'child.attendantAtBirth': (data: EventRegistration) => data.attendantAtBirth, // FieldType.SELECT,
  'child.birthType': (data: EventRegistration) => data.birthType, // FieldType.SELECT,
  'child.weightAtBirth': (data: EventRegistration) => data.weightAtBirth, // FieldType.NUMBER,
  /*
   * MISSING FIELDS that are in GraphQL but not in the form
   * childrenBornAliveToMother
   * foetalDeathsToMother
   * lastPreviousLiveBirth
   */
  'mother.detailsNotAvailable': (data: EventRegistration) =>
    !data.mother?.detailsExist,
  'mother.reason': (data: EventRegistration) => data.mother?.reasonNotApplying,
  'mother.name': (data: EventRegistration) =>
    resolveName(data, data.mother?.name?.[0]),
  'mother.dob': (data: EventRegistration) => data.mother?.birthDate,
  'mother.dobUnknown': (data: EventRegistration) =>
    data.mother?.exactDateOfBirthUnknown,
  'mother.age': (data: EventRegistration) =>
    data.mother?.ageOfIndividualInYears && {
      age: data.mother?.ageOfIndividualInYears,
      asOfDateRef: 'child.dob',
    },
  'mother.nationality': (data: EventRegistration) =>
    data.mother?.nationality?.[0],
  'mother.maritalStatus': (data: EventRegistration) =>
    data.mother?.maritalStatus,
  'mother.educationalAttainment': (data: EventRegistration) =>
    data.mother?.educationalAttainment,
  'mother.occupation': (data: EventRegistration) => data.mother?.occupation,
  'mother.previousBirths': (data: EventRegistration) =>
    data.mother?.multipleBirth,
  'mother.address': (data: EventRegistration) =>
    resolveAddress(data, data.mother?.address?.[0], 'mother'),
  'father.detailsNotAvailable': (data: EventRegistration) =>
    !data.father?.detailsExist,
  // @question, is this the right field?
  'father.reason': (data: EventRegistration) => data.father?.reasonNotApplying,
  'father.name': (data: EventRegistration) =>
    resolveName(data, data.father?.name?.[0]),
  'father.dob': (data: EventRegistration) => {
      const dateStr = data.father?.birthDate

      if (!dateStr) return undefined
  
      if (isValidDate(dateStr)) {
        const normalized = normalizeDateString(dateStr);
        return normalized
      }
    },
  'father.dobUnknown': (data: EventRegistration) =>
    data.father?.exactDateOfBirthUnknown,
  'father.age': (data: EventRegistration) =>
    data.father?.ageOfIndividualInYears && {
      age: data.father?.ageOfIndividualInYears,
      asOfDateRef: 'child.dob',
    },
  'father.nationality': (data: EventRegistration) =>
    data.father?.nationality?.[0],
  'father.maritalStatus': (data: EventRegistration) =>
    data.father?.maritalStatus,
  'father.educationalAttainment': (data: EventRegistration) =>
    data.father?.educationalAttainment,
  'father.occupation': (data: EventRegistration) => data.father?.occupation,
  'father.address': (data: EventRegistration) =>
    resolveAddress(data, data.father?.address?.[0], 'father'),
  // @todo this is a nasty one as it never was a field in the database
  // but instead a computed field that just copied mothers address data for father as
  'father.addressSameAs': (data: EventRegistration) =>
    JSON.stringify(data.father?.address?.[0]) ===
    JSON.stringify(data.mother?.address?.[0])
      ? 'YES'
      : 'NO',

  // @todo
  // PARENT: 'PARENT',
  // INFORMANT_ID_PROOF: 'INFORMANT_ID_PROOF',
  // LEGAL_GUARDIAN_PROOF: 'LEGAL_GUARDIAN_PROOF'

  'informant.brn': (data: EventRegistration) =>
    getIdentifier(data.informant, 'BIRTH_REGISTRATION_NUMBER'),
  'mother.brn': (data: EventRegistration) =>
    getIdentifier(data.mother, 'BIRTH_REGISTRATION_NUMBER'),
  'father.brn': (data: EventRegistration) =>
    getIdentifier(data.father, 'BIRTH_REGISTRATION_NUMBER'),

  'mother.nid': (data: EventRegistration) =>
    getIdentifier(data.mother, 'NATIONAL_ID'),
  'father.nid': (data: EventRegistration) =>
    getIdentifier(data.father, 'NATIONAL_ID'),

  'mother.passport': (data: EventRegistration) =>
    getIdentifier(data.mother, 'PASSPORT'),
  'father.passport': (data: EventRegistration) =>
    getIdentifier(data.father, 'PASSPORT'),

  // Previously custom fields
  'child.reason': (data: EventRegistration) =>
    getCustomField(
      data,
      'birth.child.child-view-group.reasonForLateRegistration'
    ),

  'informant.idType': (data: EventRegistration) =>
    getCustomField(
      data,
      'birth.informant.informant-view-group.informantIdType'
    ),

  'mother.idType': (data: EventRegistration) =>
    getCustomField(data, 'birth.mother.mother-view-group.motherIdType'),

  'father.idType': (data: EventRegistration) =>
    getCustomField(data, 'birth.father.father-view-group.fatherIdType'),

  // MOSIP E-Signet / ID Auth verification fields
  'mother.verified': (data: EventRegistration) =>
    getCustomFieldVerificationStatus(
      data,
      'birth.mother.mother-view-group.verified'
    ),
  'father.verified': (data: EventRegistration) =>
    getCustomFieldVerificationStatus(
      data,
      'birth.father.father-view-group.verified'
    ),
  'informant.verified': (data: EventRegistration) =>
    getCustomFieldVerificationStatus(
      data,
      'birth.informant.informant-view-group.verified'
    ),
  'child.nid': (data: EventRegistration) =>
    getIdentifier(data.child, 'NATIONAL_ID'),
}

const defaultResolvers: ResolverMap = {
  ...informantResolver,
  ...documentsResolver,
}

export default defaultResolvers