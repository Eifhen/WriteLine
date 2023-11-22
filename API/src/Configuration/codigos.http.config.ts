export enum CodigoHTTP {
  // Información
  OK = 200,
  Created = 201,
  Accepted = 202,
  Deleted = 204,
  Updated = 200,

  // Errores de cliente
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  UnprocessableEntity = 422,

  // Errores de servidor
  InternalServerError = 500,
  NotImplemented = 501,
  BadGateway = 502,
  ServiceUnavailable = 503,
}

export enum MensajeHTTP {
  // Información
  OK = 'Petición exitosa',
  Created = 'Recurso creado exitosamente',
  Accepted = 'Petición aceptada',
  Updated = 'Recurso actualizado exitosamente',
  Deleted = 'Recurso eliminado exitosamente',

  // Errores de cliente
  BadRequest = 'Solicitud incorrecta',
  Unauthorized = 'No autorizado',
  Forbidden = 'Acceso prohibido',
  NotFound = 'Recurso no encontrado',
  MethodNotAllowed = 'Método no permitido',
  UnprocessableEntity = 'Entidad no procesable',

  // Errores de servidor
  InternalServerError = 'Error interno del servidor',
  NotImplemented = 'Funcionalidad no implementada',
  BadGateway = 'Puerta de enlace incorrecta',
  ServiceUnavailable = 'Servicio no disponible',
}

export function GetHttpErrorMsg(codigo: number): string {
  switch (codigo) {
      case CodigoHTTP.BadRequest:
          return MensajeHTTP.BadRequest;
      case CodigoHTTP.Unauthorized:
          return MensajeHTTP.Unauthorized;
      case CodigoHTTP.Forbidden:
          return MensajeHTTP.Forbidden;
      case CodigoHTTP.NotFound:
          return MensajeHTTP.NotFound;
      case CodigoHTTP.MethodNotAllowed:
          return MensajeHTTP.MethodNotAllowed;
      case CodigoHTTP.UnprocessableEntity:
          return MensajeHTTP.UnprocessableEntity;
      case CodigoHTTP.InternalServerError:
          return MensajeHTTP.InternalServerError;
      case CodigoHTTP.NotImplemented:
          return MensajeHTTP.NotImplemented;
      case CodigoHTTP.BadGateway:
          return MensajeHTTP.BadGateway;
      case CodigoHTTP.ServiceUnavailable:
          return MensajeHTTP.ServiceUnavailable;
      default:
          return 'Ha ocurrido un error.';
  }
}