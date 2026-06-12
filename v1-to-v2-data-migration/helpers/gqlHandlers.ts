import { API, GATEWAY } from './routes.ts'

const fetchWithRetry = async (
  url: string,
  options: RequestInit,
  maxAttempts = 5
): Promise<Response> => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    let response: Response
    try {
      response = await fetch(url, options)
    } catch (err) {
      if (attempt === maxAttempts) throw err
      const delay = 1000 * 2 ** (attempt - 1)
      console.warn(`Fetch failed (attempt ${attempt}/${maxAttempts}), retrying in ${delay}ms...`, err)
      await new Promise((r) => setTimeout(r, delay))
      continue
    }
    if (response.status === 504) {
      if (attempt === maxAttempts) return response
      const delay = 15000 * attempt // 15s, 30s, 45s, 60s
      console.warn(`Gateway timeout (attempt ${attempt}/${maxAttempts}), retrying in ${delay}ms...`)
      await new Promise((r) => setTimeout(r, delay))
      continue
    }
    return response
  }
  throw new Error('unreachable')
}

export const declareEvent = async (document: any, token: string) => {
  const response = await fetch(`${GATEWAY}/events/event.import`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      json: document,
      meta: {
        values: {
          declaration: ['undefined'],
        },
      },
    }),
  })

  if (!response.ok) {
    console.log('DECLARE ERROR!')
    console.log((await response.json()).error)

    throw new Error(`Event creation failed: ${response.statusText}`)
  }
  return response.json()
}

export const bulkImport = async (documents: any[], token: string) => {
  const response = await fetchWithRetry(`${GATEWAY}/events/event.bulkImport`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      json: documents,
      meta: {
        values: {
          declaration: ['undefined'],
        },
      },
    }),
  })

  if (!response.ok) {
    console.log('DECLARE ERROR!')
    const errorBody = await response.json().catch(() => response.text())
    console.log("response body :>> ", JSON.stringify(errorBody, null, 2))

    throw new Error(`Event creation failed: ${response.statusText}`)
  }
  return response.json()
}

export const registerSystem = async (token: string) => {
  const response = await fetch(`${GATEWAY}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      operationName: 'registerSystem',
      variables: {
        system: {
          type: 'IMPORT_EXPORT',
          name: 'Migration',
        },
      },
      query: `mutation registerSystem($system: SystemInput) {
        registerSystem(system: $system) {
          clientSecret
          system {
            _id
            clientId
            name
            shaSecret
            status
            type
            integratingSystemType
            settings {
              webhook {
                event
                permissions
                __typename
              }
              __typename
            }
            __typename
          }
          __typename
        }
      }`,
    }),
  })

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.statusText}`)
  }
  return response.json()
}

const GetRegistrationsList = async (
  token: string,
  event: string,
  page: number,
  pageSize: number,
  maxAttempts = 5
) => {
  const skip = (page - 1) * pageSize
  const searchSet =
    event === 'birth' ? 'BirthEventSearchSet' : 'DeathEventSearchSet'
  const requestBody = JSON.stringify({
    operationName: 'GetRegistrationsListByFilter',
    query: `query GetRegistrationsListByFilter {
      searchEvents(advancedSearchParameters: { event: ${event} }, count: ${pageSize}, skip: ${skip}, sortColumn: "createdAt.keyword") {
        totalItems
        results {
          ... on ${searchSet} {
            id
          }
        }
      }
    }`,
  })

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const response = await fetch(`${GATEWAY}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: requestBody,
    })
    if (response.status === 504) {
      const delay = 15000 * attempt // 15s, 30s, 45s, 60s, 75s
      console.warn(`searchEvents gateway timeout (attempt ${attempt}/${maxAttempts}), retrying in ${delay}ms...`)
      await new Promise((r) => setTimeout(r, delay))
      continue
    }
    if (!response.ok) {
      throw new Error(`GraphQL request failed: ${response.status} ${response.statusText}`)
    }
    return response.json()
  }
  throw new Error(`searchEvents gateway timeout after ${maxAttempts} attempts (skip=${skip})`)
}

export const fetchAllBirthRegistrations = async (
  token: string,
  page: number,
  pageSize: number
) => {
  return await GetRegistrationsList(token, 'birth', page, pageSize)
}

export const fetchAllDeathRegistrations = async (
  token: string,
  page: number,
  pageSize: number
) => {
  return await GetRegistrationsList(token, 'death', page, pageSize)
}

export const fetchBirthRegistration = async (
  recordId: string,
  token: string
) => {
  const response = await fetchWithRetry(`${GATEWAY}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      operationName: 'fetchBirthRegistrationForReview',
      variables: {
        id: recordId,
      },
      query: `query fetchBirthRegistrationForReview($id: ID!) {
        fetchBirthRegistration(id: $id) {
          _fhirIDMap
          id
          child {
            id
            identifier {
              id
              type
              otherType
              __typename
            }
            name {
              use
              firstNames
              middleName
              familyName
              __typename
            }
            birthDate
            gender
            __typename
          }
          informant {
            id
            relationship
            otherRelationship
            _fhirIDPatient
            identifier {
              id
              type
              otherType
              fieldsModifiedByIdentity
              __typename
            }
            name {
              use
              firstNames
              middleName
              familyName
              __typename
            }
            occupation
            nationality
            birthDate
            ageOfIndividualInYears
            exactDateOfBirthUnknown
            address {
              type
              line
              district
              state
              city
              postalCode
              country
              __typename
            }
            __typename
          }
          mother {
            id
            name {
              use
              firstNames
              middleName
              familyName
              __typename
            }
            multipleBirth
            birthDate
            maritalStatus
            occupation
            detailsExist
            reasonNotApplying
            ageOfIndividualInYears
            exactDateOfBirthUnknown
            dateOfMarriage
            educationalAttainment
            nationality
            identifier {
              id
              type
              otherType
              fieldsModifiedByIdentity
              __typename
            }
            address {
              type
              line
              district
              state
              city
              postalCode
              country
              __typename
            }
            telecom {
              system
              value
              __typename
            }
            __typename
          }
          father {
            id
            name {
              use
              firstNames
              middleName
              familyName
              __typename
            }
            birthDate
            maritalStatus
            occupation
            detailsExist
            reasonNotApplying
            ageOfIndividualInYears
            exactDateOfBirthUnknown
            dateOfMarriage
            educationalAttainment
            nationality
            identifier {
              id
              type
              otherType
              fieldsModifiedByIdentity
              __typename
            }
            address {
              type
              line
              district
              state
              city
              postalCode
              country
              __typename
            }
            telecom {
              system
              value
              __typename
            }
            __typename
          }
          registration {
            id
            informantType
            otherInformantType
            contact
            contactRelationship
            contactPhoneNumber
            contactEmail
            assignment {
              practitionerId
              firstName
              lastName
              officeName
              avatarURL
              __typename
            }
            certificates {
              hasShowedVerifiedDocument
              certificateTemplateId
              collector {
                relationship
                otherRelationship
                name {
                  use
                  firstNames
                  familyName
                  __typename
                }
                telecom {
                  system
                  value
                  use
                  __typename
                }
                identifier {
                  id
                  type
                  otherType
                  __typename
                }
                __typename
              }
              __typename
            }
            duplicates {
              compositionId
              trackingId
              __typename
            }
            informantsSignature
            attachments {
              data
              uri
              type
              contentType
              subject
              __typename
            }
            status {
              comments {
                comment
                __typename
              }
              type
              timestamp
              office {
                name
                alias
                address {
                  district
                  state
                  __typename
                }
                partOf
                __typename
              }
              __typename
            }
            type
            trackingId
            registrationNumber
            __typename
          }
          attendantAtBirth
          weightAtBirth
          birthType
          eventLocation {
            id
            type
            address {
              line
              district
              state
              city
              postalCode
              country
              __typename
            }
            __typename
          }
          questionnaire {
            fieldId
            value
            __typename
          }
          history {
            otherReason
            requester
            requesterOther
            noSupportingDocumentationRequired
            hasShowedVerifiedDocument
            certificateTemplateId
            date
            action
            regStatus
            dhis2Notification
            ipAddress
            documents {
              id
              data
              uri
              type
              __typename
            }
            payment {
              id
              type
              amount
              outcome
              date
              attachmentURL
              __typename
            }
            statusReason {
              text
              __typename
            }
            reason
            location {
              id
              name
              __typename
            }
            office {
              id
              name
              alias
              address {
                state
                district
                __typename
              }
              __typename
            }
            system {
              name
              type
              __typename
            }
            user {
              id
              role {
                id
                label {
                  id
                  defaultMessage
                  description
                  __typename
                }
                __typename
              }
              primaryOffice {
                id
                __typename
              }
              name {
                firstNames
                familyName
                use
                __typename
              }
              avatar {
                data
                type
                __typename
              }
              fullHonorificName
              __typename
            }
            signature {
              data
              type
              __typename
            }
            comments {
              user {
                id
                username
                avatar {
                  data
                  type
                  __typename
                }
                __typename
              }
              comment
              createdAt
              __typename
            }
            input {
              valueCode
              valueId
              value
              __typename
            }
            output {
              valueCode
              valueId
              value
              __typename
            }
            certificates {
              hasShowedVerifiedDocument
              certificateTemplateId
              collector {
                relationship
                otherRelationship
                name {
                  use
                  firstNames
                  familyName
                  __typename
                }
                telecom {
                  system
                  value
                  use
                  __typename
                }
                identifier {
                  id
                  type
                  otherType
                  __typename
                }
                __typename
              }
              certifier {
                name {
                  use
                  firstNames
                  familyName
                  __typename
                }
                role {
                  id
                  label {
                    id
                    defaultMessage
                    description
                    __typename
                  }
                  __typename
                }
                __typename
              }
              __typename
            }
            duplicateOf
            potentialDuplicates
            __typename
          }
          __typename
        }
      }`,
    }),
  })

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.statusText}`)
  }
  return response.json()
}

export const fetchDeathRegistration = async (
  recordId: string,
  token: string
) => {
  const response = await fetch(`${GATEWAY}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      operationName: 'fetchDeathRegistrationForReview',
      variables: {
        id: recordId,
      },
      query: `query fetchDeathRegistrationForReview($id: ID!) {
        fetchDeathRegistration(id: $id) {
          _fhirIDMap
          id
          deceased {
            id
            name {
              use
              firstNames
              middleName
              familyName
              __typename
            }
            birthDate
            age
            ageOfIndividualInYears
            exactDateOfBirthUnknown
            gender
            maritalStatus
            occupation
            nationality
            identifier {
              id
              type
              otherType
              __typename
            }
            gender
            deceased {
              deathDate
              __typename
            }
            address {
              type
              line
              district
              state
              city
              postalCode
              country
              __typename
            }
            __typename
          }
          informant {
            id
            relationship
            otherRelationship
            _fhirIDPatient
            identifier {
              id
              type
              otherType
              __typename
            }
            name {
              use
              firstNames
              middleName
              familyName
              __typename
            }
            nationality
            occupation
            birthDate
            ageOfIndividualInYears
            exactDateOfBirthUnknown
            telecom {
              system
              value
              __typename
            }
            address {
              type
              line
              district
              state
              city
              postalCode
              country
              __typename
            }
            __typename
          }
          father {
            id
            name {
              use
              firstNames
              middleName
              familyName
              __typename
            }
            birthDate
            maritalStatus
            occupation
            detailsExist
            reasonNotApplying
            ageOfIndividualInYears
            exactDateOfBirthUnknown
            dateOfMarriage
            educationalAttainment
            nationality
            identifier {
              id
              type
              otherType
              fieldsModifiedByIdentity
              __typename
            }
            address {
              type
              line
              district
              state
              city
              postalCode
              country
              __typename
            }
            telecom {
              system
              value
              __typename
            }
            __typename
          }
          mother {
            id
            name {
              use
              firstNames
              middleName
              familyName
              __typename
            }
            birthDate
            maritalStatus
            occupation
            detailsExist
            reasonNotApplying
            ageOfIndividualInYears
            exactDateOfBirthUnknown
            dateOfMarriage
            educationalAttainment
            nationality
            identifier {
              id
              type
              otherType
              fieldsModifiedByIdentity
              __typename
            }
            address {
              type
              line
              district
              state
              city
              postalCode
              country
              __typename
            }
            telecom {
              system
              value
              __typename
            }
            __typename
          }
          spouse {
            id
            name {
              use
              firstNames
              middleName
              familyName
              __typename
            }
            birthDate
            maritalStatus
            occupation
            detailsExist
            reasonNotApplying
            ageOfIndividualInYears
            exactDateOfBirthUnknown
            dateOfMarriage
            educationalAttainment
            nationality
            identifier {
              id
              type
              otherType
              fieldsModifiedByIdentity
              __typename
            }
            address {
              type
              line
              district
              state
              city
              postalCode
              country
              __typename
            }
            telecom {
              system
              value
              __typename
            }
            __typename
          }
          medicalPractitioner {
            name
            qualification
            lastVisitDate
            __typename
          }
          registration {
            id
            contact
            informantType
            otherInformantType
            contactRelationship
            contactPhoneNumber
            contactEmail
            assignment {
              practitionerId
              firstName
              lastName
              officeName
              avatarURL
              __typename
            }
            certificates {
              hasShowedVerifiedDocument
              certificateTemplateId
              collector {
                relationship
                otherRelationship
                name {
                  use
                  firstNames
                  familyName
                  __typename
                }
                telecom {
                  system
                  value
                  use
                  __typename
                }
                identifier {
                  id
                  type
                  otherType
                  __typename
                }
                __typename
              }
              __typename
            }
            duplicates {
              compositionId
              trackingId
              __typename
            }
            informantsSignature
            attachments {
              data
              uri
              type
              contentType
              subject
              __typename
            }
            status {
              comments {
                comment
                __typename
              }
              type
              timestamp
              office {
                name
                alias
                address {
                  district
                  state
                  __typename
                }
                partOf
                __typename
              }
              __typename
            }
            type
            trackingId
            registrationNumber
            __typename
          }
          eventLocation {
            id
            type
            address {
              type
              line
              district
              state
              city
              postalCode
              country
              __typename
            }
            __typename
          }
          questionnaire {
            fieldId
            value
            __typename
          }
          mannerOfDeath
          causeOfDeathEstablished
          causeOfDeathMethod
          causeOfDeath
          deathDescription
          maleDependentsOfDeceased
          femaleDependentsOfDeceased
          history {
            documents {
              id
              data
              uri
              type
              __typename
            }
            payment {
              id
              type
              amount
              outcome
              date
              attachmentURL
              __typename
            }
            otherReason
            requester
            requesterOther
            hasShowedVerifiedDocument
            certificateTemplateId
            noSupportingDocumentationRequired
            date
            action
            regStatus
            dhis2Notification
            ipAddress
            statusReason {
              text
              __typename
            }
            reason
            location {
              id
              name
              __typename
            }
            office {
              id
              name
              alias
              address {
                state
                district
                __typename
              }
              __typename
            }
            system {
              name
              type
              __typename
            }
            user {
              id
              role {
                id
                label {
                  id
                  defaultMessage
                  description
                  __typename
                }
                __typename
              }
              primaryOffice {
                id
                __typename
              }
              name {
                firstNames
                familyName
                use
                __typename
              }
              avatar {
                data
                type
                __typename
              }
              fullHonorificName
              __typename
            }
            signature {
              data
              type
              __typename
            }
            comments {
              user {
                id
                username
                avatar {
                  data
                  type
                  __typename
                }
                __typename
              }
              comment
              createdAt
              __typename
            }
            input {
              valueCode
              valueId
              value
              __typename
            }
            output {
              valueCode
              valueId
              value
              __typename
            }
            certificates {
              hasShowedVerifiedDocument
              certificateTemplateId
              collector {
                relationship
                otherRelationship
                name {
                  use
                  firstNames
                  familyName
                  __typename
                }
                telecom {
                  system
                  value
                  use
                  __typename
                }
                identifier {
                  id
                  type
                  otherType
                  __typename
                }          
                __typename
              }
              certifier {
                name {
                  use
                  firstNames
                  familyName
                  __typename
                }
                role {
                  id
                  label {
                    id
                    defaultMessage
                    description
                    __typename
                  }
                  __typename
                }
                __typename
              }
              __typename
            }
            duplicateOf
            potentialDuplicates
            __typename
          }
          __typename
        }
      }`,
    }),
  })

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.statusText}`)
  }
  return response.json()
}

export const syncLocations = async (token: string, maxAttempts = 5) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const response = await fetch(`${API}/events/sync-locations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (response.status === 504) {
      const delay = 15000 * attempt // 15s, 30s, 45s, 60s, 75s
      console.warn(`syncLocations gateway timeout (attempt ${attempt}/${maxAttempts}), retrying in ${delay}ms...`)
      await new Promise((r) => setTimeout(r, delay))
      continue
    }
    if (!response.ok) {
      const body = await response.text().catch(() => '(unreadable body)')
      throw new Error(`Sync Locations failed: ${response.status} ${response.statusText}\n${body}`)
    }
    return response.statusText
  }
  throw new Error(`syncLocations gateway timeout after ${maxAttempts} attempts`)
}

export const reindex = async (token: string) => {
  const response = await fetch(`${API}/events/events/reindex`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response.ok) {
    throw new Error(`Reindex failed: ${response.statusText}`)
  }
  return response.statusText
}
