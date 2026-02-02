import { DOMAIN } from './vars.ts'

export const CONFIG = DOMAIN.includes('localhost')
  ? `http://${DOMAIN}:2021`
  : `https://config.${DOMAIN}`

export const GATEWAY = DOMAIN.includes('localhost')
  ? `http://${DOMAIN}:7070`
  : `https://gateway.${DOMAIN}`

export const AUTH = DOMAIN.includes('localhost')
  ? `http://${DOMAIN}:4040`
  : `https://auth.${DOMAIN}`

export const COUNTRY_CONFIG = DOMAIN.includes('localhost')
  ? `http://${DOMAIN}:3040`
  : `https://countryconfig.${DOMAIN}`

export const REGISTER_APP = DOMAIN.includes('localhost')
  ? `http://${DOMAIN}:3000`
  : `https://register.${DOMAIN}`

export const API = DOMAIN.includes('localhost')
  ? `http://${DOMAIN}:3000/api`
  : `https://${DOMAIN}/api`
