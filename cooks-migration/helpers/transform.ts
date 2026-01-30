import { v4 as uuidv4 } from 'npm:uuid'
import { ActionType, EventType } from './types.ts'

export const transform = (
  declaration: Record<string, unknown>,
  eventType: EventType,
  date: Date,
  user: string,
  role: string,
  location: string,
  trackingId: string,
) => ({
  id: uuidv4(),
  type: eventType,
  createdAt: new Date(date).toISOString(),
  updatedAt: new Date(date).toISOString(),
  updatedAtLocation: location, // Need location Id
  trackingId: trackingId, // Or generate it
  actions: [
    {
      type: 'CREATE' as ActionType,
      createdAt: new Date(date).toISOString(),
      createdBy: user,
      createdByUserType: 'user' as const,
      createdByRole: role, // Do I use a static role?
      createdAtLocation: location,
      updatedAtLocation: location,
      status: 'Accepted',
      declaration: {},
      id: uuidv4(),
      transactionId: uuidv4(),
    },
    {
      id: uuidv4(), // TODO for some reason the backend can send items with the same id, breaking Pkey
      type: 'REGISTER' as ActionType,
      transactionId: uuidv4(),
      createdAt: new Date(date).toISOString(),
      createdBy: user,
      createdByUserType: 'user' as const,
      createdByRole: role,
      createdAtLocation: location,
      updatedAtLocation: location,
      status: 'Accepted',
      declaration,
      registrationNumber: trackingId,
    },
  ],
})
