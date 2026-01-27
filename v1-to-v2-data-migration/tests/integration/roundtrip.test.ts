import { expect } from 'jsr:@std/expect'
import { generateBirthRegistration } from '../utils/dataGenerators.ts'
import { authenticate } from '../../helpers/authentication.ts'
import { GATEWAY } from '../../helpers/routes.ts'
import {
  createDeclaration,
  getEvent,
  runMigration,
} from '../utils/generatorUtils.ts'

Deno.test('Create some data to test with', async (t) => {
  const token = await authenticate('s.faisal', 'test')
  for (let index = 0; index < 9000; index++) {
    const birthDeclaration = await generateBirthRegistration()

    //await t.step('Post declaration', async () => {})

    //console.log(birthDeclaration)
    const result = await createDeclaration(token.toString(), birthDeclaration)
    console.log(index)
  }

  // const { compositionId } = result.data.createBirthRegistration
  // console.log('CompositionId:', compositionId)

  // await runMigration()

  // const data = await getEvent(compositionId, token)
  // console.log(data)

  // expect(data).toBeDefined()
  // expect(birthDeclaration).toBe(data[0].declaration)
})
