import { Certificate, HistoryItem } from './types.ts'

export const collectorResolver = {
  'collector.requesterId': (data: Certificate) =>
    other(data) ? 'SOMEONE_ELSE' : data.collector?.relationship,
  'collector.OTHER.name': (data: Certificate) =>
    other(data) && data.collector?.name?.[0] && {
      surname: data.collector.name[0].familyName,
      firstname: data.collector.name[0].firstNames,
    },
  'collector.brn': (data: Certificate) =>
    getIdForType(data, 'BIRTH_REGISTRATION_NUMBER'),
  'collector.nid': (data: Certificate) => getIdForType(data, 'NATIONAL_ID'),
  'collector.OTHER.idType': (data: Certificate) =>
    other(data) && getId(data).type,
  'collector.PASSPORT.details': (data: Certificate) =>
    getIdForType(data, 'PASSPORT'),
  'collector.DRIVING-LICENCE.details': (data: Certificate) =>
    getIdForType(data, 'DRIVING_LICENSE'),
  'collector.DRIVING-LICENSE.details': (data: Certificate) =>
    getIdForType(data, 'DRIVING_LICENSE'),
  'collector.REFUGEE-NUMBER.details': (data: Certificate) =>
    getIdForType(data, 'REFUGEE_NUMBER'),
  'collector.ALIEN-NUMBER.details': (data: Certificate) =>
    getIdForType(data, 'ALIEN_NUMBER'),
  'collector.OTHER.idTypeOther': (data: Certificate) =>
    other(data) && getId(data).otherType,
  'collector.OTHER.idNumberOther': (data: Certificate) =>
    getIdForType(data, 'OTHER'),
  'collector.OTHER.relationshipToChild': (data: Certificate) =>
    data.collector?.otherRelationship,
  'collector.OTHER.signedAffidavit': (data: Certificate) => data.x,
  'collector.identity.verify': (data: Certificate) =>
    data.hasShowedVerifiedDocument,
  'collector.identity.verify.data.mother': (data: Certificate) => data.x, // TODO
  'collector.identity.verify.data.father': (data: Certificate) => data.x, // TODO
  'collector.identity.verify.data.other': (data: Certificate) => data.x, // TODO
  'collector.collect.payment.data.afterLateRegistrationTarget': (
    data: Certificate
  ) => data.x, // TODO
  'collector.collect.payment.data.inBetweenRegistrationTargets': (
    data: Certificate
  ) => data.x, // TODO
  'collector.collect.payment.data.beforeRegistrationTarget': (
    data: Certificate
  ) => data.x, // TODO
  'collector.collect.payment.data.afterRegistrationTarget': (
    data: Certificate
  ) => data.x, // TODO
}

export const correctionResolver = {
  'fees.amount': (historyItem: HistoryItem) => historyItem.payment?.amount,
  'reason.option': (historyItem: HistoryItem) => historyItem.reason,
  'reason.other': (historyItem: HistoryItem) => historyItem.otherReason,
  'requester.identity.verify': (historyItem: HistoryItem) =>
    historyItem.hasShowedVerifiedDocument,
  'requester.type': (historyItem: HistoryItem) =>
    historyItem.requester === 'REGISTRAR' ? 'ME' : historyItem.requester,
  'requester.other': (historyItem: HistoryItem) => historyItem.requesterOther,
}

export const declareResolver = {
  'review.signature': (uri: any) =>
    uri &&
    typeof uri !== 'string' && {
      path: uri.pathname,
      originalFilename: uri.pathname.replace('/ocrvs/', ''),
      type: 'image/png',
    },
  'review.comment': (historyItem: HistoryItem) =>
    historyItem.comments?.map(({ comment }: any) => comment).join('\n'),
}

function getIdForType(data: any, type: string) {
  return data.collector?.identifier?.find((id: any) => id.type === type)?.id
}

function getId(data: any) {
  return data.collector?.identifier?.[0]
}

function other(data: any) {
  return data.collector?.relationship === 'OTHER'
}

export default {
  ...collectorResolver,
  ...correctionResolver,
  ...declareResolver,
}
