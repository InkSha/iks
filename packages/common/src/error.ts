import { HttpStatusCode } from "./http"

export class HTTPException extends Error {
  public readonly code: HttpStatusCode
  public readonly name: string
}

export class NotFoundException extends HTTPException {
  public code = HttpStatusCode.NotFound
  public name = "NotFoundAssets"
}
