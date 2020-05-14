import {
  MutationStub,
  CreateMutationStub,
  DeleteMutationStub,
  PatchMutationStub,
  CreateSquashedMutation
} from './types'

type Handlers = {
  create: (selection: CreateMutationStub, mutation: MutationStub) => any
  createOrReplace: (selection: CreateMutationStub, mutation: MutationStub) => any
  createIfNotExists: (selection: CreateMutationStub, mutation: MutationStub) => any
  createSquashed: (
    selection: CreateSquashedMutation['createSquashed'],
    mutation: MutationStub
  ) => any
  delete: (selection: DeleteMutationStub, mutation: MutationStub) => any
  patch: (selection: PatchMutationStub, mutation: MutationStub) => any
}

export function mapMutations<T>(mutations: MutationStub[], handlers: Handlers): T[] {
  return mutations.map(
    (mutation): T => {
      if ('create' in mutation) {
        return handlers.create(mutation.create, mutation)
      }

      if ('createOrReplace' in mutation) {
        return handlers.createOrReplace(mutation.createOrReplace, mutation)
      }

      if ('createIfNotExists' in mutation) {
        return handlers.createIfNotExists(mutation.createIfNotExists, mutation)
      }

      if ('createSquashed' in mutation) {
        return handlers.createSquashed(mutation.createSquashed, mutation)
      }

      if ('delete' in mutation) {
        return handlers.delete(mutation.delete, mutation)
      }

      if ('patch' in mutation) {
        return handlers.patch(mutation.patch, mutation)
      }

      return mutation
    }
  )
}
