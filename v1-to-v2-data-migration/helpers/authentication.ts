import { GATEWAY } from './routes.ts'

export async function authenticate(
  username: string,
  password: string
): Promise<string> {
  const response = await fetch(`${GATEWAY}/auth/authenticate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (!response.ok) {
    throw new Error(`Authentication failed: ${response.statusText}`)
  }
  const authResponse = await response.json()

  const nonce = authResponse.nonce
  const verifyCode = async (code: string, nonce: string) => {
    const response = await fetch(`${GATEWAY}/auth/verifyCode`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, nonce }),
    })
    if (!response.ok) {
      throw new Error(`Code verification failed: ${response.statusText}`)
    }
    return response.json()
  }

  return (await verifyCode('000000', nonce)).token
}

export async function getTokenForSystemClient(
  clientId: string,
  clientSecret: string
): Promise<string> {
  const authenticateResponse = await fetch(
    `${GATEWAY}/auth/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-correlation-id': clientId + '-' + Date.now(),
      },
    }
  )
  const res = await authenticateResponse.json()
  if (!authenticateResponse.ok) {
    throw new Error(
      `Failed to get token for system client: ${
        res.message || authenticateResponse.statusText
      }`
    )
  }

  return res.token || res.access_token
}
