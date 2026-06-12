// @ts-expect-error - Using Deno-style npm import
import { v4 as uuidv4 } from 'npm:uuid'
import {
  DEFAULT_FIELD_MAPPINGS,
  CUSTOM_FIELD_MAPPINGS,
  AGE_MAPPINGS,
  VERIFIED_MAPPINGS,
} from './defaultMappings.ts'
import { normalizeDateString, isDateField } from './dateUtils.ts'
import { COUNTRY_FIELD_MAPPINGS } from '../countryData/countryMappings.ts'
import { NAME_MAPPINGS } from '../countryData/nameMappings.ts'
import { ADDRESS_MAPPINGS } from '../countryData/addressMappings.ts'
import {
  collectorResolver,
  correctionResolver,
  declareResolver,
} from './historyResolver.ts'
import {
  EventRegistration,
  HistoryItem,
  ResolverMap,
  TransformedDocument,
  Action,
  ActionType,
} from './types.ts'
import {
  BIRTH_LOCATION_OTHER_HOME_KEY,
  BIRTH_LOCATION_PRIVATE_HOME_KEY,
  COUNTRY_CODE,
} from '../countryData/addressResolver.ts'
import { documentsResolver } from './defaultResolvers.ts'

const mappings = {
  ...DEFAULT_FIELD_MAPPINGS,
  ...CUSTOM_FIELD_MAPPINGS,
  ...COUNTRY_FIELD_MAPPINGS,
}

function patternMatch(
  correction: Record<string, any>,
  declaration: Record<string, any>
) {
  const transformedData: Record<string, any> = {}

  for (const [key, value] of Object.entries(correction)) {
    const valueKey = mappings[key as keyof typeof mappings]
    if (valueKey) {
      if (Object.keys(documentsResolver).includes(valueKey)) {
        continue
      }
      transformedData[valueKey] = value
    } else if (NAME_MAPPINGS[key]) {
      const nameMapping = NAME_MAPPINGS[key](value as string)
      const nameKey = Object.keys(nameMapping)[0]
      const existing = transformedData[nameKey] || {}
      transformedData[nameKey] = { ...existing, ...nameMapping[nameKey] }
    } else if (VERIFIED_MAPPINGS[key]) {
      const verifiedMapping = VERIFIED_MAPPINGS[key](value as string)
      const verifiedKey = Object.keys(verifiedMapping)[0]
      transformedData[verifiedKey] = verifiedMapping[verifiedKey]
    } else if (AGE_MAPPINGS[key]) {
      const ageMapping = AGE_MAPPINGS[key](value as string)
      const ageKey = Object.keys(ageMapping)[0]
      const existing = transformedData[ageKey] || {}
      transformedData[ageKey] = { ...existing, ...ageMapping[ageKey] }
    } else if (ADDRESS_MAPPINGS[key]) {
      const addressMapping = ADDRESS_MAPPINGS[key](value as string)
      let addressKey = Object.keys(addressMapping)[0]
      let addressData = null
      let saveAddressKey = addressKey

      if (addressKey === BIRTH_LOCATION_PRIVATE_HOME_KEY) {
        saveAddressKey = declaration[addressKey]
          ? addressKey
          : BIRTH_LOCATION_OTHER_HOME_KEY
      }

      const transformedWithSameKey = transformedData[saveAddressKey] || {}

      addressData = addressMapping[addressKey]
      const currentAddress = declaration[addressKey] || {}

      const mergedAddress = {
        ...currentAddress,
        ...transformedWithSameKey,
        ...addressData,
      }

      transformedData[saveAddressKey] = {
        ...mergedAddress,
        addressType:
          mergedAddress.addressType ||
          (mergedAddress.country === COUNTRY_CODE
            ? 'DOMESTIC'
            : 'INTERNATIONAL'),
        streetLevelDetails: {
          ...(currentAddress.streetLevelDetails || {}),
          ...(transformedWithSameKey.streetLevelDetails || {}),
          ...addressData.streetLevelDetails,
        },
      }
    } else {
      const parts = key.split('.')
      const prefix = parts.slice(0, 2).join('.')
      const suffix = parts.slice(2).join('.')
      const mapKey = Object.keys(mappings).find(
        (m) => m.startsWith(prefix) && m.endsWith(suffix)
      )
      if (mapKey) {
        const valueKey = mappings[mapKey as keyof typeof mappings]
        transformedData[valueKey] = value
      }
    }
  }

  return transformedData
}

export function transformCorrection(
  historyItem: HistoryItem,
  event: 'birth' | 'death',
  declaration: Record<string, any>
): Record<string, any> {

  const normalizeValue = (v: any) => {
    if (typeof v === 'string') {
      const s = v.trim().toLowerCase()
      if (s === 'true') return true
      if (s === 'false') return false
    }
    return v
  }

  const v1InputDeclaration =
    historyItem.input?.reduce((acc: Record<string, any>, curr: any) => {
      acc[`${event}.${curr.valueCode}.${curr.valueId}`] = curr.value
      return acc
    }, {}) || {}

  const v1OutputDeclaration =
    historyItem.output?.reduce((acc: Record<string, any>, curr: any) => {
      // Normalize date strings in output to ensure proper zero-padding
      const value = isDateField(curr.valueId)
        ? normalizeDateString(curr.value)
        : curr.value
      acc[`${event}.${curr.valueCode}.${curr.valueId}`] = value
      return acc
    }, {}) || {}

  return {
    input: patternMatch(v1InputDeclaration, declaration),
    output: patternMatch(v1OutputDeclaration, declaration),
  }
}

function legacyHistoryItemToV2ActionType(
  record: EventRegistration,
  declaration: Record<string, any>,
  historyItem: HistoryItem,
  eventType: 'birth' | 'death',
  rejectItem: boolean
): Partial<Action> | null {
  if (!historyItem.action) {
    const signed = record.registration.informantsSignature
    const uri = signed && new URL(signed)
    switch (historyItem.regStatus) {
      case 'DECLARED':
        return {
          type: 'DECLARE' as ActionType,
          declaration: declaration,
          annotation: {
            'review.signature': declareResolver['review.signature'](uri),
            'review.comment': declareResolver['review.comment'](historyItem),
          },
        }
      case 'REGISTERED':
        return {
          type: 'REGISTER' as ActionType,
          declaration: declaration,
          registrationNumber: record.registration.registrationNumber,
          annotation: {
            'review.signature': declareResolver['review.signature'](uri),
            'review.comment': declareResolver['review.comment'](historyItem),
          },
        }
      case 'WAITING_VALIDATION':
        if (rejectItem) {
          return {
            status: 'Rejected',
            type: 'REJECT' as ActionType,
            declaration: declaration,
            content: {
              reason: 'Rejected WAITING_VALIDATION records during migration',
            },
          }
        }
        return {
          type: 'REGISTER' as ActionType,
          declaration: {},
          status: 'Requested',
        }
      case 'VALIDATED':
        return {
          type: 'VALIDATE' as ActionType,
          declaration,
          annotation: {
            'review.signature': declareResolver['review.signature'](uri),
            'review.comment': declareResolver['review.comment'](historyItem),
          },
        }
      case 'ISSUED':
      case 'CERTIFIED':
        const annotation = {}
        Object.keys(collectorResolver).forEach((key) => {
          const resolver =
            collectorResolver[key as keyof typeof collectorResolver]
          const value =
            historyItem.certificates && resolver(historyItem.certificates[0])
          if (value) {
            ;(annotation as any)[key] = value
          }
        })

        return {
          type: 'PRINT_CERTIFICATE' as ActionType,
          content: {
            templateId:
              historyItem.certificateTemplateId ||
              historyItem.certificates?.[0]?.certificateTemplateId,
          },
          declaration: {},
          annotation: annotation,
        }
      case 'REJECTED':
        return {
          status: 'Accepted',
          type: 'REJECT' as ActionType,
          declaration: {},
          content: {
            reason: historyItem.statusReason?.text,
          },
        }
      case 'ARCHIVED':
        return {
          type: 'ARCHIVE' as ActionType,
          declaration: {},
          content: {
            reason: historyItem.statusReason?.text || 'None',
          },
        }
      case 'IN_PROGRESS':
        return {
          type: 'NOTIFY' as ActionType,
          declaration: declaration,
          annotation: {
            'review.signature': declareResolver['review.signature'](uri),
            'review.comment': declareResolver['review.comment'](historyItem),
          },
        }
      case 'DECLARATION_UPDATED': //TODO - check if this is correct
        const update = transformCorrection(historyItem, eventType, declaration)
        return {
          type: 'DECLARE' as ActionType,
          declaration: update.output,
          annotation: update.input,
        }
      default:
        break
    }
  }

  switch (historyItem.action) {
    case 'REQUESTED_CORRECTION':
      const correction = transformCorrection(
        historyItem,
        eventType,
        declaration
      )

      const annotation = Object.fromEntries(
        Object.entries(correctionResolver).map(([key, resolver]) => [
          key,
          resolver(historyItem),
        ])
      )

      return {
        status: 'Accepted',
        type: 'REQUEST_CORRECTION' as ActionType,
        declaration: correction.output,
        annotation: deepMerge(annotation, correction.input),
        requestId: historyItem.id,
      }
    case 'APPROVED_CORRECTION':
      return {
        status: 'Accepted',
        type: 'APPROVE_CORRECTION' as ActionType,
        requestId: historyItem.requestId,
        declaration: {},
        annotation: historyItem.annotation,
      }
    case 'ASSIGNED':
      if (!historyItem.user?.id) {
        console.warn('Skipping ASSIGN action with no user id', historyItem)
        return null
      }
      return {
        type: 'ASSIGN' as ActionType,
        assignedTo: historyItem.user.id,
        declaration: {},
      }
    case 'REJECTED_CORRECTION':
      return {
        status: 'Accepted',
        type: 'REJECT_CORRECTION' as ActionType,
        requestId: historyItem.requestId,
        declaration: {},
        content: {
          reason: historyItem.reason,
        },
      }
    case 'FLAGGED_AS_POTENTIAL_DUPLICATE':
      return {
        type: 'DUPLICATE_DETECTED' as ActionType,
        declaration: {},
        content: {
          duplicates:
            record.registration.duplicates?.map((x: any) => ({
              id: x.compositionId,
              trackingId: x.trackingId,
            })) || [],
        },
      }

    default:
      break
  }

  const actionMap: Record<string, ActionType> = {
    MARKED_AS_DUPLICATE: 'MARK_AS_DUPLICATE',
    MARKED_AS_NOT_DUPLICATE: 'MARK_AS_NOT_DUPLICATE',
    DOWNLOADED: 'READ',
    UNASSIGNED: 'UNASSIGN',
    VIEWED: 'READ',
    VERIFIED: 'VALIDATE',
    REINSTATED: 'REINSTATE',
  }

  const type = historyItem.action ? actionMap[historyItem.action] : undefined
  if (!type) {
    console.log('Invalid action', historyItem)
  }

  return { type, declaration: {} }
}

function nonNullObjectKeys(obj: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([_, value]) => value !== null && value !== undefined
    )
  )
}

const preProcessHistory = (eventRegistration: EventRegistration) => {
  // Handle CORRECTED items by duplicating them
  const processedHistory: any[] = []
  const issued: any[] = []
  const corrections: any[] = []
  const reinstated: any[] = []
  let issuances = 0
  for (const historyItem of eventRegistration.history.sort(
    (a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf()
  )) {
    if (historyItem.action === 'CORRECTED') {
      const requestCorrectionId = uuidv4()

      // First item: REQUEST_CORRECTION
      processedHistory.push({
        ...historyItem,
        action: 'REQUESTED_CORRECTION',
        id: requestCorrectionId,
      })

      // Second item: APPROVE_CORRECTION
      const approveDate = new Date(historyItem.date)
      approveDate.setMilliseconds(approveDate.getMilliseconds() + 1)
      processedHistory.push({
        ...historyItem,
        date: approveDate,
        action: 'APPROVED_CORRECTION',
        requestId: requestCorrectionId,
        annotation: {
          isImmediateCorrection: true,
        },
      })
    } else if (historyItem.action === 'REQUESTED_CORRECTION') {
      historyItem.id = uuidv4()
      const req = corrections.pop()
      if (req) {
        req.requestId = historyItem?.id
      }
      processedHistory.push(historyItem)
    } else if (historyItem.action === 'REJECTED_CORRECTION') {
      corrections.push(historyItem)
      processedHistory.push(historyItem)
    } else if (historyItem.action === 'APPROVED_CORRECTION') {
      corrections.push(historyItem)
      processedHistory.push(historyItem)
    } else if (!historyItem.action && historyItem.regStatus === 'CERTIFIED') {
      const matchingIssue = issued.pop()

      const issuedNotNull: any = matchingIssue
        ? nonNullObjectKeys(matchingIssue)
        : { certificates: [{}] }

      const cert = historyItem.certificates?.reverse()?.[issuances]

      processedHistory.push({
        ...historyItem,
        ...issuedNotNull,
        certificates: [
          { ...cert, ...nonNullObjectKeys(issuedNotNull.certificates[0]) },
        ],
      })
      issuances++
    } else if (!historyItem.action && historyItem.regStatus === 'ISSUED') {
      issued.push({
        ...historyItem,
        certificates: [historyItem.certificates?.reverse()?.[issuances]],
      })
      issuances++
    } else if (historyItem.action === 'REINSTATED') {
      reinstated.push(historyItem)
    } else if (!historyItem.action && historyItem.regStatus === 'ARCHIVED') {
      const wasReinstate = reinstated.pop()
      if (!wasReinstate) {
        processedHistory.push(historyItem)
      }
    } else {
      processedHistory.push(historyItem)
    }
  }
  return processedHistory
}

export function transform(
  eventRegistration: EventRegistration,
  resolver: ResolverMap,
  eventType: 'birth' | 'death'
): TransformedDocument {
  const result = Object.entries(resolver).map(([fieldId, r]) => {
    return [fieldId, r(eventRegistration, eventType)]
  })

  const withOutNulls = result.filter(
    ([_, value]) => value !== null && value !== undefined
  )
  const declaration = Object.fromEntries(withOutNulls)

  const processedHistory = preProcessHistory(eventRegistration)

  const historyAsc = processedHistory
    .sort((a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf())
    .filter((x) => x.system?.type !== 'IMPORT_EXPORT') // Remove migration system actions

  const newest = historyAsc[historyAsc.length - 1]

  const documents: TransformedDocument = {
    id: eventRegistration.id,
    type: eventType,
    createdAt: new Date(historyAsc[0].date).toISOString(),
    updatedAt: new Date(newest.date).toISOString(),
    updatedAtLocation: newest.office?.id || '',
    trackingId: eventRegistration.registration.trackingId,
    actions: [
      {
        type: 'CREATE' as ActionType,
        createdAt: new Date(historyAsc[0].date).toISOString(),
        createdBy: historyAsc[0].user?.id || '',
        createdByUserType: 'user' as const,
        createdByRole: historyAsc[0].user?.role?.id || '',
        createdAtLocation: historyAsc[0].office?.id,
        updatedAtLocation: historyAsc[0].office?.id,
        status: 'Accepted',
        declaration: {},
        id: uuidv4(),
        transactionId: uuidv4(),
      },
      ...historyAsc.flatMap((history) => {
        const actionData = legacyHistoryItemToV2ActionType(
          eventRegistration,
          declaration,
          history,
          eventType,
          newest.regStatus === 'WAITING_VALIDATION'
        )
        if (actionData === null) return []
        return [{
          id: history?.id || uuidv4(), // TODO for some reason the backend can send items with the same id, breaking Pkey
          transactionId: uuidv4(),
          createdAt: new Date(history.date).toISOString(),
          createdBy: history.user?.id || history.system?.type || '',
          createdByUserType: history.user
            ? ('user' as const)
            : ('system' as const),
          createdByRole: history.user?.role?.id || history.system?.type || '',
          createdAtLocation: history.office?.id,
          updatedAtLocation: history.office?.id,
          status: 'Accepted',
          ...actionData,
        } as Action]
      }),
    ],
  }

  return postProcess(documents, declaration)
}

/**
 * Deep merge two objects, with priority given to source values
 */
function deepMerge(target: any, source: any): any {
  const result = { ...target }

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const sourceValue = source[key]
      const targetValue = target[key]

      // If both are plain objects, merge recursively
      if (
        sourceValue &&
        typeof sourceValue === 'object' &&
        !Array.isArray(sourceValue) &&
        targetValue &&
        typeof targetValue === 'object' &&
        !Array.isArray(targetValue)
      ) {
        result[key] = deepMerge(targetValue, sourceValue)
      } else {
        // Otherwise, use source value
        result[key] = sourceValue
      }
    }
  }

  return result
}

function postProcess(
  document: TransformedDocument,
  currDeclaration: Record<string, any>
): TransformedDocument {
  const resolverKeys = Object.keys({
    ...correctionResolver,
    ...declareResolver,
  })
  const hasKeys = (declaration: {} | null | undefined) =>
    Object.keys(declaration || {}).length > 0
  let previousDeclaration = currDeclaration

  const approvedCorrections = []

  let rev = document.actions.slice().reverse()
  let firstRegisterAction = null
  const actionsToRemove: string[] = []

  for (const action of rev) {
    if (action.type === 'REGISTER') {
      if (action.registrationNumber) {
        if (firstRegisterAction) {
          console.warn(
            `Multiple REGISTER actions found for document ${document.id}`,
          )
          action.registrationNumber = undefined
          action.status = 'Requested'

          firstRegisterAction.originalActionId = action.id
        } else {
          firstRegisterAction = action
        }
      } else {
        if (!firstRegisterAction || firstRegisterAction.originalActionId) {
          actionsToRemove.push(action.id)
        } else {
          firstRegisterAction.originalActionId = action.id
        }
      }
    }

    if (action.type === 'APPROVE_CORRECTION') {
      approvedCorrections.push(action.requestId)
    }

    const declaration = action.declaration || {}
    const annotation = Object.fromEntries(
      Object.entries(action.annotation || {}).filter(
        ([key]) => !resolverKeys.includes(key)
      )
    )

    if (hasKeys(declaration)) {
      if (action.type === 'REQUEST_CORRECTION') {
        if (approvedCorrections.includes(action.requestId)) {
          previousDeclaration = deepMerge(previousDeclaration, annotation)
          action.annotation = previousDeclaration
        }
        continue
      }
      action.declaration = previousDeclaration
      if (hasKeys(annotation)) {
        previousDeclaration = deepMerge(previousDeclaration, annotation)
        action.annotation = previousDeclaration
      }
    }
  }

  if (actionsToRemove.length > 0) {
    rev = rev.filter((action) => !actionsToRemove.includes(action.id))
  }

  document.actions = rev.reverse()

  return document
}
