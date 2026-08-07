/** Structural server guards — stacked via `chainHooks` in `s3.ts`. */
export {
  createKeyOwnershipGuard,
  type KeyOwnershipContext,
} from "./upload/key-ownership"
