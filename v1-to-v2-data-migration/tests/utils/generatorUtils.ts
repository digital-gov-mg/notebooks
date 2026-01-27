import { GATEWAY } from '../../helpers/routes.ts'
import type { fhir } from 'fhir'
import { CREATE_BIRTH_REGISTRATION } from './queries.ts'

export async function getAllLocations(
  type: 'ADMIN_STRUCTURE' | 'HEALTH_FACILITY' | 'CRVS_OFFICE'
) {
  const locations = (await fetch(
    `${GATEWAY}/location?type=${type}&_count=0`
  ).then((res) => res.json())) as fhir.Bundle

  return locations.entry!.map(
    (entry: fhir.Resource) => entry.resource as fhir.Location
  )
}

export async function getEvent(
  compositionId: string,
  token: { nonce: string }
) {
  const baseUrl = 'http://localhost:3000/api/events/events/search'

  const params = new URLSearchParams({
    type: 'and',
    clauses: JSON.stringify({
      id: compositionId,
    }),
  })

  const url = `${baseUrl}?${params.toString()}`

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

export async function createDeclaration(token: string, details: any) {
  const res = await fetch(`${GATEWAY}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: CREATE_BIRTH_REGISTRATION,
      variables: { details },
    }),
  })
  return res.json()
}

export async function runMigration() {
  await Deno.mkdir('./tmp', { recursive: true })

  const convertCommand = new Deno.Command('bash', {
    args: [
      '../scripts/deno-notebook-to-deno.sh',
      '../v1-to-v2-data-migration/migrate.ipynb',
      './tmp/migrate.ts',
    ],
    stdout: 'inherit',
    stderr: 'inherit',
  })

  const { success: convertSuccess, code: convertCode } =
    await convertCommand.output()
  if (!convertSuccess) {
    throw new Error(`Notebook conversion failed with code ${convertCode}`)
  }

  const runCommand = new Deno.Command('deno', {
    args: ['run', '--allow-net', './tmp/migrate.ts'],
    stdout: 'inherit',
    stderr: 'inherit',
  })

  const { success: runSuccess, code: runCode } = await runCommand.output()
  if (!runSuccess) {
    console.log(`Migration script failed with code ${runCode}`)
    throw new Error(`Migration script failed with code ${runCode}`)
  }
}
