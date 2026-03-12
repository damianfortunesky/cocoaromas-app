import axios, { type AxiosError } from 'axios';

export type HttpError = {
  status?: number;
  message: string;
  details?: unknown;
};

const statusMessages: Record<number, string> = {
  400: 'Solicitud inválida.',
  401: 'No autorizado.',
  403: 'No tenés permisos para esta acción.',
  404: 'Recurso no encontrado.',
  409: 'Conflicto al procesar la solicitud.',
  422: 'Error de validación.',
  500: 'Error interno del servidor.',
  503: 'Servicio temporalmente no disponible.'
};

export const toHttpError = (error: unknown): HttpError => {
  if (!axios.isAxiosError(error)) {
    return { message: 'Ocurrió un error inesperado.', details: error };
  }

  const axiosError = error as AxiosError<{ message?: string; error?: string; details?: unknown }>;
  const status = axiosError.response?.status;
  const responseData = axiosError.response?.data;

  const message =
    responseData?.message ??
    responseData?.error ??
    (status ? statusMessages[status] : undefined) ??
    axiosError.message ??
    'No se pudo completar la operación HTTP.';

  return {
    status,
    message,
    details: responseData?.details
  };
};
