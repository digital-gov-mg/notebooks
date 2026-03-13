export const DEFAULT_FIELD_MAPPINGS = {
  // birth

  'birth.child.gender': 'child.gender',
  'birth.child.childBirthDate': 'child.dob',
  'birth.child.placeOfBirth': 'child.placeOfBirth',
  'birth.child.birthLocation': 'child.birthLocation',
  'birth.child.attendantAtBirth': 'child.attendantAtBirth',
  'birth.child.birthType': 'child.birthType',
  'birth.child.weightAtBirth': 'child.weightAtBirth',

  'birth.informant.informantNationalId': 'informant.nid',
  'birth.informant.informantPassport': 'informant.passport',
  'birth.informant.informantBirthRegistrationNumber': 'informant.brn',
  'birth.informant.informantBirthDate': 'informant.dob',
  'birth.informant.registrationPhone': 'informant.phoneNo',
  'birth.informant.registrationEmail': 'informant.email',
  'birth.informant.informantType': 'informant.relation',
  'birth.informant.otherInformantType': 'informant.other.relation',
  'birth.informant.exactDateOfBirthUnknown': 'informant.dobUnknown',
  'birth.informant.nationality': 'informant.nationality',

  'birth.mother.motherNationalId': 'mother.nid',
  'birth.mother.motherPassport': 'mother.passport',
  'birth.mother.motherBirthRegistrationNumber': 'mother.brn',
  'birth.mother.detailsExist': 'mother.detailsNotAvailable',
  'birth.mother.reasonNotApplying': 'mother.reason',
  'birth.mother.motherBirthDate': 'mother.dob',
  'birth.mother.exactDateOfBirthUnknown': 'mother.dobUnknown',
  'birth.mother.nationality': 'mother.nationality',
  'birth.mother.maritalStatus': 'mother.maritalStatus',
  'birth.mother.educationalAttainment': 'mother.educationalAttainment',
  'birth.mother.occupation': 'mother.occupation',
  'birth.mother.multipleBirth': 'mother.previousBirths',

  'birth.father.fatherNationalId': 'father.nid',
  'birth.father.fatherPassport': 'father.passport',
  'birth.father.fatherBirthRegistrationNumber': 'father.brn',
  'birth.father.detailsExist': 'father.detailsNotAvailable',
  'birth.father.reasonNotApplying': 'father.reason',
  'birth.father.fatherBirthDate': 'father.dob',
  'birth.father.exactDateOfBirthUnknown': 'father.dobUnknown',
  'birth.father.nationality': 'father.nationality',
  'birth.father.maritalStatus': 'father.maritalStatus',
  'birth.father.educationalAttainment': 'father.educationalAttainment',
  'birth.father.occupation': 'father.occupation',
  'birth.father.primaryAddressSameAsOtherPrimary': 'father.addressSameAs',

  'birth.documents.uploadDocForChildDOB': 'documents.proofOfBirth',
  'birth.documents.uploadDocForRecognition': 'documents.proofOfRecognition',
  'birth.documents.uploadDocForMother': 'documents.proofOfMother',
  'birth.documents.uploadDocForFather': 'documents.proofOfFather',
  'birth.documents.uploadDocForInformant': 'documents.proofOfInformant',
  'birth.documents.uploadDocForProofOfLegalGuardian': 'documents.proofOther',

  // death

  'death.deceased.gender': 'deceased.gender',
  'death.deceased.deceasedBirthDate': 'deceased.dob',
  'death.deceased.exactDateOfBirthUnknown': 'deceased.dobUnknown',
  'death.deceased.nationality': 'deceased.nationality',
  'death.deceased.deceasedNationalId': 'deceased.nid',
  'death.deceased.deceasedPassport': 'deceased.passport',
  'death.deceased.deceasedBirthRegistrationNumber': 'deceased.brn',
  'death.deceased.maritalStatus': 'deceased.maritalStatus',

  'death.deathEvent.deathDate': 'eventDetails.date',
  'death.deathEvent.mannerOfDeath': 'eventDetails.mannerOfDeath',
  'death.deathEvent.causeOfDeathEstablished':
    'eventDetails.causeOfDeathEstablished',
  'death.deathEvent.causeOfDeathMethod': 'eventDetails.sourceCauseDeath',
  'death.deathEvent.deathDescription': 'eventDetails.description',
  'death.deathEvent.placeOfDeath': 'eventDetails.placeOfDeath',
  'death.deathEvent.deathLocation': 'eventDetails.deathLocation',

  'death.informant.informantType': 'informant.relation',
  'death.informant.otherInformantType': 'informant.other.relation',
  'death.informant.informantBirthDate': 'informant.dob',
  'death.informant.exactDateOfBirthUnknown': 'informant.dobUnknown',
  'death.informant.nationality': 'informant.nationality',
  'death.informant.informantNationalId': 'informant.nid',
  'death.informant.informantPassport': 'informant.passport',
  'death.informant.informantBirthRegistrationNumber': 'informant.brn',
  'death.informant.primaryAddressSameAsOtherPrimary': 'informant.addressSameAs',
  'death.informant.registrationPhone': 'informant.phoneNo',
  'death.informant.registrationEmail': 'informant.email',
  'death.informant.ruralOrUrbanPrimaryInformant': 'informant.addressType',

  'death.spouse.detailsExist': 'spouse.detailsNotAvailable',
  'death.spouse.reasonNotApplying': 'spouse.reason',
  'death.spouse.spouseBirthDate': 'spouse.dob',
  'death.spouse.exactDateOfBirthUnknown': 'spouse.dobUnknown',
  // age mapping handled by AGE_MAPPINGS to transform to object with asOfDateRef
  'death.spouse.nationality': 'spouse.nationality',
  'death.spouse.spouseNationalId': 'spouse.nid',
  'death.spouse.spousePassport': 'spouse.passport',
  'death.spouse.spouseBirthRegistrationNumber': 'spouse.brn',
  'death.spouse.primaryAddressSameAsOtherPrimary': 'spouse.addressSameAs',

  'death.documents.uploadDocForDeceased': 'documents.proofOfDeceased',
  'death.documents.uploadDocForInformant': 'documents.proofOfInformant',
  'death.documents.uploadDocForDeceasedDeath': 'documents.proofOfDeath',
  'death.documents.uploadDocForCauseOfDeath': 'documents.proofOfCauseOfDeath',
}

export const CUSTOM_FIELD_MAPPINGS = {
  'birth.child.child-view-group.reasonForLateRegistration': 'child.reason',
  'birth.informant.informant-view-group.informantIdType': 'informant.idType',
  'birth.mother.mother-view-group.motherIdType': 'mother.idType',
  'birth.father.father-view-group.fatherIdType': 'father.idType',
  'death.deceased.deceased-view-group.deceasedIdType': 'deceased.idType',
  'death.deceased.deceased-view-group.numberOfDependants':
    'deceased.numberOfDependants',
  'death.deathEvent.death-event-details.reasonForLateRegistration':
    'eventDetails.reasonForLateRegistration',
  'death.informant.informant-view-group.informantIdType': 'informant.idType',
  'death.spouse.spouse-view-group.spouseIdType': 'spouse.idType',
  'birth.mother.mother-view-group.verified': 'mother.verified',
  'birth.father.father-view-group.verified': 'father.verified',
  'birth.informant.informant-view-group.verified': 'informant.verified',
  'death.deceased.deceased-view-group.verified': 'deceased.verified',
  'death.informant.informant-view-group.verified': 'informant.verified',
  'death.spouse.spouse-view-group.verified': 'spouse.verified',
}

export const VERIFIED_MAPPINGS: Record<
  string,
  (data: string) => Record<string, any>
> = {
  'birth.informant.verified': (data: string) => ({
    'informant.verified': data === '' ? undefined : data,
  }),
  'birth.mother.verified': (data: string) => ({
    'mother.verified': data === '' ? undefined : data,
  }),
  'birth.father.verified': (data: string) => ({
    'father.verified': data === '' ? undefined : data,
  }),
  'death.informant.verified': (data: string) => ({
    'informant.verified': data === '' ? undefined : data,
  }),
  'death.deceased.verified': (data: string) => ({
    'deceased.verified': data === '' ? undefined : data,
  }),
  'death.spouse.verified': (data: string) => ({
    'spouse.verified': data === '' ? undefined : data,
  }),
  'birth.father.fatherBirthDate': (data: string) => ({
    'father.dob': data === '' ? undefined : data,
  }),
  'birth.informant.informantBirthDate': (data: string) => ({
    'informant.dob': data === '' ? undefined : data,
  }),
}

export const AGE_MAPPINGS: Record<
  string,
  (data: string) => Record<string, any>
> = {
  'birth.mother.ageOfIndividualInYears': (data: string) => ({
    'mother.age': {
      age: data,
      asOfDateRef: 'child.dob',
    },
  }),
  'birth.father.ageOfIndividualInYears': (data: string) => ({
    'father.age': {
      age: data,
      asOfDateRef: 'child.dob',
    },
  }),
  'birth.informant.ageOfIndividualInYears': (data: string) => ({
    'informant.age': {
      age: data,
      asOfDateRef: 'child.dob',
    },
  }),
  'death.deceased.ageOfIndividualInYears': (data: string) => ({
    'deceased.age': {
      age: data,
      asOfDateRef: 'eventDetails.date',
    },
  }),
  'death.informant.ageOfIndividualInYears': (data: string) => ({
    'informant.age': {
      age: data,
      asOfDateRef: 'eventDetails.date',
    },
  }),
  'death.spouse.ageOfIndividualInYears': (data: string) => ({
    'spouse.age': {
      age: data,
      asOfDateRef: 'eventDetails.date',
    },
  }),
}
